import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CheckCircle2, Calendar, Download, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRoomById, formatPrice } from "@/lib/room-data";
import { getSiteById, type SiteData } from "@/lib/site-data";
import { StepIndicator } from "../../_components/step-indicator";
import type { RoomType, AccommodationType } from "@/types";

interface CompletePageProps {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{
    type?: AccommodationType;
    id?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    pets?: string;
    siteNumber?: string;
    vehicleCount?: string;
    total?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    bookingNumber?: string;
    paidAt?: string;
  }>;
}

export default async function CompletePage({ params, searchParams }: CompletePageProps) {
  const { bookingId } = await params;
  const query = await searchParams;

  if (!query.id || !query.checkIn || !query.checkOut) {
    notFound();
  }

  const accommodationType = query.type || "room";
  let accommodation: RoomType | SiteData | undefined;
  
  if (accommodationType === "site") {
    accommodation = getSiteById(query.id);
  } else {
    accommodation = getRoomById(query.id);
  }

  if (!accommodation) {
    notFound();
  }

  // 숙박 정보 추출
  const name = accommodationType === "room" 
    ? (accommodation as RoomType).name 
    : (accommodation as SiteData).title;
  const image = accommodationType === "room"
    ? (accommodation as RoomType).images[0]
    : ((accommodation as SiteData).image || "/placeholder.svg?height=400&width=600");
  const checkInTime = accommodation.checkIn;
  const checkOutTime = accommodation.checkOut;

  const checkIn = new Date(query.checkIn);
  const checkOut = new Date(query.checkOut);
  const adults = parseInt(query.adults || "2", 10);
  const children = parseInt(query.children || "0", 10);
  const pets = parseInt(query.pets || "0", 10);
  const siteNumber = query.siteNumber || "";
  const totalAmount = parseInt(query.total || "0", 10);
  const firstName = query.firstName || "";
  const lastName = query.lastName || "";
  const email = query.email || "";
  const phone = query.phone || "";
  const bookingNumber = query.bookingNumber || bookingId;

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="border-b border-foreground/10 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-lg font-light tracking-[0.3em] text-foreground">SE</span>
            <span className="text-[9px] font-light tracking-[0.15em] text-foreground -mt-1">CLUB</span>
          </Link>
          <Link
            href="/contact"
            className="text-sm text-foreground/60 hover:text-foreground"
          >
            도움이 필요하신가요?
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12">
        {/* Step Indicator */}
        <div className="mb-12">
          <StepIndicator currentStep={4} />
        </div>

        {/* Success Message */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="size-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-foreground">
            예약이 완료되었습니다
          </h1>
          <p className="text-foreground/60">
            예약 확인서가 {email}로 발송되었습니다.
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="rounded-lg border border-foreground/10 bg-white overflow-hidden">
          {/* Accommodation Image */}
          <div className="relative h-48 w-full">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6 space-y-6">
            {/* Booking Number */}
            <div className="rounded-lg bg-foreground/5 p-4 text-center">
              <p className="text-sm text-foreground/60">예약 번호</p>
              <p className="mt-1 text-xl font-semibold tracking-wider text-foreground">
                {bookingNumber}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-foreground/10 pb-4">
                <span className="text-foreground/60">
                  {accommodationType === "room" ? "객실" : "사이트"}
                </span>
                <span className="font-medium text-foreground">
                  {name}
                  {siteNumber && ` - ${siteNumber}`}
                </span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-4">
                <span className="text-foreground/60">체크인</span>
                <span className="font-medium text-foreground">
                  {format(checkIn, "yyyy년 M월 d일 (EEE)", { locale: ko })} {checkInTime}
                </span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-4">
                <span className="text-foreground/60">체크아웃</span>
                <span className="font-medium text-foreground">
                  {format(checkOut, "yyyy년 M월 d일 (EEE)", { locale: ko })} {checkOutTime}
                </span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-4">
                <span className="text-foreground/60">인원</span>
                <span className="font-medium text-foreground">
                  성인 {adults}명{children > 0 && `, 소인 ${children}명`}
                  {pets > 0 && `, 반려동물 ${pets}마리`}
                </span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-4">
                <span className="text-foreground/60">예약자</span>
                <span className="font-medium text-foreground">
                  {lastName}{firstName}
                </span>
              </div>
              <div className="flex justify-between border-b border-foreground/10 pb-4">
                <span className="text-foreground/60">연락처</span>
                <span className="font-medium text-foreground">{phone}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-semibold text-foreground">결제 금액</span>
                <span className="text-lg font-semibold text-primary">
                  {formatPrice(totalAmount)}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Button
            variant="outline"
            className="h-12 border-foreground/20 bg-white hover:bg-foreground/5"
            asChild
          >
            <Link href={`/bookings/${bookingNumber}`}>
              <Calendar className="mr-2 size-4" />
              예약 확인
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-12 border-foreground/20 bg-white hover:bg-foreground/5"
          >
            <Download className="mr-2 size-4" />
            캘린더 추가
          </Button>
          <Button
            className="h-12 bg-foreground text-background hover:bg-foreground/90"
            asChild
          >
            <Link href="/">
              <Home className="mr-2 size-4" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-center text-sm text-foreground/60">
          문의사항이 있으시면{" "}
          <Link href="/contact" className="underline underline-offset-2">
            고객센터
          </Link>
          로 연락해주세요.
        </p>
      </main>
    </div>
  );
}
