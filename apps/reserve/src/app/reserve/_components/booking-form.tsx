"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { format, addDays, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Minus, Plus, ChevronRight, Car, Tent, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type RoomType, formatPrice, rooms, getRoomById } from "@/lib/room-data";
import { type SiteData, siteData, getSiteById } from "@/lib/site-data";
import {
  TAX_RATE,
  generateDraftId,
  calculateNights,
} from "@/lib/booking-store";
import {
  type BookingProgress,
  setBookingProgress,
  getBookingProgress,
} from "@/lib/cookies";
import type { DateRange } from "react-day-picker";
import type { AccommodationType } from "@/types";

interface BookingFormProps {
  defaultRoom: RoomType;
}

// 통합 숙박 타입 (객실 또는 캠핑장)
type SelectedAccommodation = 
  | { type: "room"; data: RoomType }
  | { type: "site"; data: SiteData };

export function BookingForm({ defaultRoom }: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 숙박 유형과 선택된 숙박
  const [accommodationType, setAccommodationType] = useState<AccommodationType>("room");
  const [selectedRoom, setSelectedRoom] = useState<RoomType>(defaultRoom);
  const [selectedSite, setSelectedSite] = useState<SiteData>(siteData[0]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 날짜 범위 선택
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [adults, setAdults] = useState(defaultRoom.baseGuests);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  
  // 사이트/방 번호 선택
  const [selectedNumber, setSelectedNumber] = useState<string>("");
  
  // 차량 대수 선택
  const [vehicleCount, setVehicleCount] = useState<number>(0);

  // 쿠키에서 예약 진행 상황 복원 (최초 마운트 시)
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (isInitialized) return;
    
    const type = searchParams.get("type") as AccommodationType | null;
    const id = searchParams.get("room") || searchParams.get("site");
    
    // URL에 파라미터가 없으면 쿠키에서 복원
    if (!id) {
      const savedProgress = getBookingProgress();
      if (savedProgress) {
        // 숙박 타입과 ID 복원
        if (savedProgress.accommodationType === "site") {
          const site = getSiteById(savedProgress.accommodationId);
          if (site) {
            setAccommodationType("site");
            setSelectedSite(site);
            setAdults(savedProgress.adults);
            setChildren(savedProgress.children);
            setPets(savedProgress.pets);
            setSelectedNumber(savedProgress.selectedNumber);
            setVehicleCount(savedProgress.vehicleCount);
            // 날짜 복원
            if (savedProgress.checkIn && savedProgress.checkOut) {
              setDateRange({
                from: new Date(savedProgress.checkIn),
                to: new Date(savedProgress.checkOut),
              });
            }
          }
        } else {
          const room = getRoomById(savedProgress.accommodationId);
          if (room) {
            setAccommodationType("room");
            setSelectedRoom(room);
            setAdults(savedProgress.adults);
            setChildren(savedProgress.children);
            setPets(savedProgress.pets);
            setSelectedNumber(savedProgress.selectedNumber);
            setVehicleCount(savedProgress.vehicleCount);
            // 날짜 복원
            if (savedProgress.checkIn && savedProgress.checkOut) {
              setDateRange({
                from: new Date(savedProgress.checkIn),
                to: new Date(savedProgress.checkOut),
              });
            }
          }
        }
      }
    } else if (type === "site" && id) {
      setAccommodationType("site");
      const site = getSiteById(id);
      if (site) {
        setSelectedSite(site);
        setAdults(site.baseGuests);
        setChildren(0);
        setPets(0);
        setSelectedNumber("");
      }
    } else if (id) {
      setAccommodationType("room");
      const room = getRoomById(id);
      if (room) {
        setSelectedRoom(room);
        setAdults(room.baseGuests);
        setChildren(0);
        setPets(0);
        setSelectedNumber("");
      }
    }
    
    setIsInitialized(true);
  }, [searchParams, isInitialized]);
  
  // 예약 진행 상황을 쿠키에 저장
  useEffect(() => {
    if (!isInitialized) return;
    
    const progress: BookingProgress = {
      accommodationType,
      accommodationId: accommodationType === "room" ? selectedRoom.id : selectedSite.id,
      selectedNumber,
      checkIn: dateRange?.from?.toISOString() ?? null,
      checkOut: dateRange?.to?.toISOString() ?? null,
      adults,
      children,
      pets,
      vehicleCount,
      updatedAt: Date.now(),
    };
    
    setBookingProgress(progress);
  }, [
    isInitialized,
    accommodationType,
    selectedRoom.id,
    selectedSite.id,
    selectedNumber,
    dateRange,
    adults,
    children,
    pets,
    vehicleCount,
  ]);

  // 현재 선택된 숙박 정보
  const currentAccommodation: SelectedAccommodation = accommodationType === "room"
    ? { type: "room", data: selectedRoom }
    : { type: "site", data: selectedSite };

  // 현재 선택된 숙박의 정보
  const accommodationInfo = useMemo(() => {
    if (currentAccommodation.type === "room") {
      const room = currentAccommodation.data;
      return {
        id: room.id,
        name: room.name,
        category: room.category,
        image: room.images[0],
        price: room.price,
        baseGuests: room.baseGuests,
        maxGuests: room.maxGuests,
        petAllowed: room.petAllowed,
        maxPets: room.maxPets,
        petFee: room.petFee,
        extraPersonFee: room.extraPersonFee,
        numbers: room.roomNumbers || [],
        checkIn: room.checkIn,
        checkOut: room.checkOut,
        siteSize: undefined as string | undefined,
      };
    } else {
      const site = currentAccommodation.data;
      return {
        id: site.id,
        name: site.title,
        category: "캠핑장",
        image: site.image || "/placeholder.svg?height=400&width=600",
        price: site.price,
        baseGuests: site.baseGuests,
        maxGuests: site.maxGuests,
        petAllowed: site.petAllowed || false,
        maxPets: site.maxPets,
        petFee: site.petFee,
        extraPersonFee: site.extraPersonFee,
        numbers: site.siteNumbers || [],
        checkIn: site.checkIn,
        checkOut: site.checkOut,
        siteSize: site.siteSize,
      };
    }
  }, [currentAccommodation]);

  const nights = useMemo(() => {
    return calculateNights(dateRange?.from ?? null, dateRange?.to ?? null);
  }, [dateRange]);

  // 선택된 번호의 maxNights
  const selectedNumberMaxNights = useMemo(() => {
    if (!selectedNumber) return 14; // 기본값
    const found = accommodationInfo.numbers.find(n => n.id === selectedNumber);
    return found?.maxNights || 14;
  }, [selectedNumber, accommodationInfo.numbers]);

  const pricing = useMemo(() => {
    const roomSubtotal = accommodationInfo.price * nights;
    const extraGuests = Math.max(0, adults + children - accommodationInfo.baseGuests);
    const extraGuestFee = (accommodationInfo.extraPersonFee ?? 0) * extraGuests * nights;
    const petFee = (accommodationInfo.petFee ?? 0) * pets * nights;

    const subtotal = roomSubtotal + extraGuestFee + petFee;
    const taxes = Math.round(subtotal * TAX_RATE);
    const total = subtotal + taxes;

    return {
      roomSubtotal,
      extraGuestFee,
      petFee,
      subtotal,
      taxes,
      total,
    };
  }, [accommodationInfo, nights, adults, children, pets]);

  const handleAccommodationChange = (type: AccommodationType, id: string) => {
    // URL 업데이트
    if (type === "room") {
      router.push(`/reserve?room=${id}`, { scroll: false });
      const room = getRoomById(id);
      if (room) {
        setAccommodationType("room");
        setSelectedRoom(room);
        setAdults(room.baseGuests);
        setChildren(0);
        setPets(0);
        setSelectedNumber("");
      }
    } else {
      router.push(`/reserve?type=site&site=${id}`, { scroll: false });
      const site = getSiteById(id);
      if (site) {
        setAccommodationType("site");
        setSelectedSite(site);
        setAdults(site.baseGuests);
        setChildren(0);
        setPets(0);
        setSelectedNumber("");
      }
    }
    setIsDialogOpen(false);
  };

  const handleContinue = () => {
    if (!dateRange?.from || !dateRange?.to) {
      alert("체크인/체크아웃 날짜를 선택해주세요.");
      return;
    }
    if (!selectedNumber) {
      alert(accommodationType === "room" ? "방 번호를 선택해주세요." : "사이트 번호를 선택해주세요.");
      return;
    }

    const draftId = generateDraftId();
    
    const params = new URLSearchParams({
      type: accommodationType,
      id: accommodationInfo.id,
      checkIn: dateRange.from.toISOString(),
      checkOut: dateRange.to.toISOString(),
      adults: adults.toString(),
      children: children.toString(),
      pets: pets.toString(),
      siteNumber: selectedNumber,
      vehicleCount: vehicleCount.toString(),
      total: pricing.total.toString(),
    });

    router.push(`/reserve/details/${draftId}?${params.toString()}`);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      {/* 숙박 선택 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-foreground">숙박 선택</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="text-primary hover:text-primary/80"
          >
            변경하기
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-4 rounded-lg border border-foreground/10 bg-white p-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-md">
            <Image
              src={accommodationInfo.image}
              alt={accommodationInfo.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/60">{accommodationInfo.category}</span>
              {accommodationType === "site" && (
                <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                  캠핑장
                </span>
              )}
            </div>
            <p className="font-medium text-foreground">{accommodationInfo.name}</p>
            <p className="text-sm text-foreground/60">
              {formatPrice(accommodationInfo.price)}원/박
            </p>
          </div>
        </div>
      </div>

      {/* 날짜 선택 (범위) */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">날짜 선택</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-12 w-full justify-start border-foreground/20 bg-white text-left font-normal"
            >
              <CalendarIcon className="mr-2 size-4 text-foreground/60" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <span>
                    {format(dateRange.from, "M월 d일 (EEE)", { locale: ko })} - {format(dateRange.to, "M월 d일 (EEE)", { locale: ko })}
                  </span>
                ) : (
                  <span>{format(dateRange.from, "M월 d일 (EEE)", { locale: ko })} - 체크아웃 선택</span>
                )
              ) : (
                <span className="text-foreground/60">체크인 - 체크아웃</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                // maxNights 초과 체크
                if (range?.from && range?.to) {
                  const selectedNights = differenceInDays(range.to, range.from);
                  if (selectedNights > selectedNumberMaxNights) {
                    // maxNights를 초과하면 체크아웃을 maxNights로 제한
                    setDateRange({
                      from: range.from,
                      to: addDays(range.from, selectedNumberMaxNights),
                    });
                    return;
                  }
                }
                setDateRange(range);
              }}
              disabled={(date) => {
                // 오늘 이전 날짜는 선택 불가
                if (date < today) return true;
                // 체크��이 선택된 상태에서 체크아웃 선택 시, maxNights 초과 날짜 비활성화
                if (dateRange?.from && !dateRange?.to) {
                  const maxDate = addDays(dateRange.from, selectedNumberMaxNights);
                  if (date > maxDate) return true;
                }
                return false;
              }}
              locale={ko}
              numberOfMonths={2}
              className="rounded-md border-0"
            />
          </PopoverContent>
        </Popover>
        {nights > 0 && (
          <p className="text-sm text-foreground/60">{nights}박 숙박</p>
        )}
      </div>

      {/* 사이트/방 번호 선택 */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">
          {accommodationType === "room" ? "방 번호 선택" : "사이트 번호 선택"}
        </h3>
        
        {/* 배치도 이미지 */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-foreground/10 bg-foreground/5">
          <Image
            src="/placeholder.svg?height=360&width=640&text=배치도"
            alt="배치도"
            fill
            className="object-contain"
          />
        </div>
        
        {/* 번호 그리드 */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {accommodationInfo.numbers.map((item) => {
            // 번호에서 숫자만 추출 (예: "S1" -> "1", "전망14" -> "14")
            const displayNumber = item.id.replace(/[^0-9]/g, "");
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedNumber(item.id);
                  // 번호 변경 시 이미 선택된 날짜가 maxNights를 초과하면 초기화
                  if (dateRange?.from && dateRange?.to) {
                    const currentNights = differenceInDays(dateRange.to, dateRange.from);
                    if (currentNights > item.maxNights) {
                      setDateRange({
                        from: dateRange.from,
                        to: addDays(dateRange.from, item.maxNights),
                      });
                    }
                  }
                }}
                className={`flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border p-3 transition-colors ${
                  selectedNumber === item.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/20 bg-white text-foreground hover:border-foreground/40"
                }`}
              >
                <span className="text-base font-semibold">{displayNumber}</span>
                <span className={`text-[10px] ${
                  selectedNumber === item.id ? "text-primary-foreground/80" : "text-foreground/50"
                }`}>
                  {accommodationInfo.siteSize && <>{accommodationInfo.siteSize}<br /></>}
                  최대 {item.maxNights}박
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 인원 선택 */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">인원 선택</h3>
        <div className="space-y-3">
          <GuestRow
            label="성인"
            description="만 18세 이상"
            value={adults}
            min={1}
            max={accommodationInfo.maxGuests}
            onChange={setAdults}
          />
          <GuestRow
            label="소인"
            description="만 18세 미만"
            value={children}
            min={0}
            max={Math.max(0, accommodationInfo.maxGuests - adults)}
            onChange={setChildren}
          />
          {accommodationInfo.petAllowed && accommodationInfo.maxPets && (
            <GuestRow
              label="반려동물"
              description={`소형 10kg 미만 / 1마리당 ${formatPrice(accommodationInfo.petFee ?? 0)}원/박`}
              value={pets}
              min={0}
              max={accommodationInfo.maxPets}
              onChange={setPets}
            />
          )}
        </div>
      </div>

      {/* 차량 대수 선택 */}
      <div className="space-y-4">
        <h3 className="font-medium text-foreground">차량 대수</h3>
        <div className="flex items-center justify-between rounded-lg border border-foreground/10 bg-white p-4">
          <div className="flex items-center gap-2">
            <Car className="size-5 text-foreground/60" />
            <div>
              <p className="font-medium text-foreground">예약 차량</p>
              <p className="text-sm text-foreground/60">입장 차량 대수</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setVehicleCount(Math.max(0, vehicleCount - 1))}
              disabled={vehicleCount <= 0}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground/60 transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center font-medium">{vehicleCount}</span>
            <button
              type="button"
              onClick={() => setVehicleCount(Math.min(5, vehicleCount + 1))}
              disabled={vehicleCount >= 5}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground/60 transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 요금 요약 */}
      <div className="space-y-3 border-t border-foreground/10 pt-6">
        <h3 className="font-medium text-foreground">요금 상세</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/60">
              {accommodationType === "room" ? "객실" : "캠핑장"} 요금 ({nights}박)
            </span>
            <span>{formatPrice(pricing.roomSubtotal)}원</span>
          </div>
          {pricing.extraGuestFee > 0 && (
            <div className="flex justify-between">
              <span className="text-foreground/60">추가 인원 요금</span>
              <span>{formatPrice(pricing.extraGuestFee)}원</span>
            </div>
          )}
          {pricing.petFee > 0 && (
            <div className="flex justify-between">
              <span className="text-foreground/60">반려동물 동반 요금</span>
              <span>{formatPrice(pricing.petFee)}원</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-foreground/60">세금 및 수수료</span>
            <span>{formatPrice(pricing.taxes)}원</span>
          </div>
          <div className="flex justify-between border-t border-foreground/10 pt-2 text-base font-semibold">
            <span>총 결제 금액</span>
            <span className="text-primary">{formatPrice(pricing.total)}원</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button
        onClick={handleContinue}
        disabled={!dateRange?.from || !dateRange?.to || !selectedNumber}
        className="h-14 w-full bg-foreground text-base font-medium text-background hover:bg-foreground/90"
      >
        계속하기
      </Button>

      {/* 숙박 변경 Dialog */}
      <AccommodationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentType={accommodationType}
        currentId={accommodationInfo.id}
        onSelect={handleAccommodationChange}
      />
    </div>
  );
}

// 인원 선택 Row 컴포넌트
interface GuestRowProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function GuestRow({ label, description, value, min, max, onChange }: GuestRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-foreground/10 bg-white p-4">
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-foreground/60">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground/60 transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center font-medium">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground/60 transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

// 숙박 변경 Dialog 컴포넌트
interface AccommodationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentType: AccommodationType;
  currentId: string;
  onSelect: (type: AccommodationType, id: string) => void;
}

function AccommodationDialog({ 
  open, 
  onOpenChange, 
  currentType, 
  currentId, 
  onSelect 
}: AccommodationDialogProps) {
  const [tab, setTab] = useState<AccommodationType>(currentType);

  // Dialog 열릴 때 현재 타입으로 탭 설정
  useEffect(() => {
    if (open) {
      setTab(currentType);
    }
  }, [open, currentType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>숙박 변경</DialogTitle>
          <DialogDescription>
            원하시는 객실 또는 캠핑장을 선택하세요.
          </DialogDescription>
        </DialogHeader>
        
        {/* 탭 버튼 */}
        <div className="mt-4 flex gap-2 border-b border-foreground/10 pb-4">
          <button
            onClick={() => setTab("room")}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === "room"
                ? "bg-foreground text-background"
                : "bg-foreground/5 text-foreground hover:bg-foreground/10"
            }`}
          >
            <Home className="size-4" />
            객실
          </button>
          <button
            onClick={() => setTab("site")}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === "site"
                ? "bg-foreground text-background"
                : "bg-foreground/5 text-foreground hover:bg-foreground/10"
            }`}
          >
            <Tent className="size-4" />
            캠핑장
          </button>
        </div>
        
        {/* 객실 목록 */}
        {tab === "room" && (
          <div className="space-y-3">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onSelect("room", room.id)}
                className={`flex w-full cursor-pointer items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                  currentType === "room" && currentId === room.id
                    ? "border-primary bg-primary/5"
                    : "border-foreground/10 bg-white hover:border-foreground/20"
                }`}
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-foreground/60">{room.category}</span>
                  <p className="font-medium text-foreground">{room.name}</p>
                  <p className="text-sm text-foreground/60">{room.roomConfig}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatPrice(room.price)}원/박
                  </p>
                </div>
                {currentType === "room" && currentId === room.id && (
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* 캠핑장 목록 */}
        {tab === "site" && (
          <div className="space-y-3">
            {siteData.map((site) => (
              <button
                key={site.id}
                onClick={() => onSelect("site", site.id)}
                className={`flex w-full cursor-pointer items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                  currentType === "site" && currentId === site.id
                    ? "border-primary bg-primary/5"
                    : "border-foreground/10 bg-white hover:border-foreground/20"
                }`}
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={site.image || "/placeholder.svg?height=400&width=600"}
                    alt={site.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/60">캠핑장</span>
                    {site.petAllowed && (
                      <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-700">
                        반려동물
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-foreground">{site.title}</p>
                  <p className="text-sm text-foreground/60">{site.features.slice(0, 2).join(" · ")}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {formatPrice(site.price)}원/박
                  </p>
                </div>
                {currentType === "site" && currentId === site.id && (
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
