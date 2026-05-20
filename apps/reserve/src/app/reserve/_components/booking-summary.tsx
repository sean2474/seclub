import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { type RoomType, formatPrice } from "@/lib/room-data";
import { type SiteData } from "@/lib/site-data";
import { TAX_RATE, calculateNights } from "@/lib/booking-store";
import type { AccommodationType } from "@/types";

interface BookingSummaryProps {
  accommodation: RoomType | SiteData;
  accommodationType: AccommodationType;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  pets: number;
  siteNumber?: string;
  vehicleCount?: number;
}

export function BookingSummary({
  accommodation,
  accommodationType,
  checkIn,
  checkOut,
  adults,
  children,
  pets,
  siteNumber,
  vehicleCount,
}: BookingSummaryProps) {
  const nights = calculateNights(checkIn, checkOut);
  
  // 숙박 정보 추출
  const name = accommodationType === "room" 
    ? (accommodation as RoomType).name 
    : (accommodation as SiteData).title;
  const category = accommodationType === "room"
    ? (accommodation as RoomType).category
    : "캠핑장";
  const image = accommodationType === "room"
    ? (accommodation as RoomType).images[0]
    : ((accommodation as SiteData).image || "/placeholder.svg?height=400&width=600");
  
  // 요금 계산
  const basePrice = accommodation.price * nights;
  const extraGuests = Math.max(0, adults + children - accommodation.baseGuests);
  const extraGuestFee = (accommodation.extraPersonFee ?? 0) * extraGuests * nights;
  const petFee = (accommodation.petFee ?? 0) * pets * nights;

  const subtotal = basePrice + extraGuestFee + petFee;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;

  return (
    <div className="rounded-lg border border-foreground/10 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">예약 정보</h2>

      {/* Accommodation Info */}
      <div className="flex gap-4 border-b border-foreground/10 pb-4">
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-md">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-foreground">{name}</h3>
          <p className="text-sm text-foreground/60">{category}</p>
          {siteNumber && (
            <p className="text-sm text-primary">{siteNumber}</p>
          )}
        </div>
      </div>

      {/* Dates & Guests */}
      <div className="space-y-3 border-b border-foreground/10 py-4 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/60">체크인</span>
          <span className="font-medium">
            {format(checkIn, "yyyy년 M월 d일 (EEE)", { locale: ko })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">체크아웃</span>
          <span className="font-medium">
            {format(checkOut, "yyyy년 M월 d일 (EEE)", { locale: ko })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">숙박</span>
          <span className="font-medium">{nights}박</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/60">인원</span>
          <span className="font-medium">
            성인 {adults}명{children > 0 && `, 소인 ${children}명`}
            {pets > 0 && `, 반려동물 ${pets}마리`}
          </span>
        </div>
        {vehicleCount !== undefined && vehicleCount > 0 && (
          <div className="flex justify-between">
            <span className="text-foreground/60">차량</span>
            <span className="font-medium">{vehicleCount}대</span>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 py-4 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/60">
            {accommodationType === "room" ? "객실" : "사이트"} 요금 ({nights}박)
          </span>
          <span>{formatPrice(basePrice)}원</span>
        </div>
        {extraGuestFee > 0 && (
          <div className="flex justify-between">
            <span className="text-foreground/60">추가 인원</span>
            <span>{formatPrice(extraGuestFee)}원</span>
          </div>
        )}
        {petFee > 0 && (
          <div className="flex justify-between">
            <span className="text-foreground/60">반려동물 동반</span>
            <span>{formatPrice(petFee)}원</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-foreground/60">세금 및 수수료</span>
          <span>{formatPrice(taxes)}원</span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between border-t border-foreground/10 pt-4">
        <span className="text-lg font-semibold text-foreground">총 결제 금액</span>
        <span className="text-lg font-semibold text-primary">
          {formatPrice(total)}원
        </span>
      </div>
    </div>
  );
}
