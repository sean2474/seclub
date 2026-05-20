import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getRoomById } from "@/lib/room-data";
import { getSiteById, type SiteData } from "@/lib/site-data";
import { StepIndicator } from "../../_components/step-indicator";
import { BookingSummary } from "../../_components/booking-summary";
import { PaymentMethods } from "./_components/payment-methods";
import type { RoomType, AccommodationType } from "@/types";

interface PaymentPageProps {
  params: Promise<{ draftId: string }>;
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
  }>;
}

export default async function PaymentPage({ params, searchParams }: PaymentPageProps) {
  const { draftId } = await params;
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

  const checkIn = new Date(query.checkIn);
  const checkOut = new Date(query.checkOut);
  const adults = parseInt(query.adults || "2", 10);
  const children = parseInt(query.children || "0", 10);
  const pets = parseInt(query.pets || "0", 10);
  const siteNumber = query.siteNumber || "";
  const vehicleCount = parseInt(query.vehicleCount || "0", 10);
  const totalAmount = parseInt(query.total || "0", 10);
  
  // 고객 정보
  const firstName = query.firstName || "";
  const lastName = query.lastName || "";
  const email = query.email || "";
  const phone = query.phone || "";
  const customerName = `${lastName}${firstName}`.trim() || "고객";

  // 숙박 이름
  const orderName = accommodationType === "room"
    ? (accommodation as RoomType).name
    : (accommodation as SiteData).title;

  // 원본 searchParams를 문자열로 전달
  const searchParamsString = new URLSearchParams(
    Object.entries(query).filter(([, v]) => v !== undefined) as [string, string][]
  ).toString();

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

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={3} />
        </div>

        <div className="mb-8 flex items-center gap-4">
          <Link 
            href={`/reserve/details/${draftId}?${searchParamsString}`}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground/60 transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">
            결제
          </h1>
        </div>

        {/* 2-Column Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          {/* Left: Payment Methods */}
          <PaymentMethods
            draftId={draftId}
            searchParams={searchParamsString}
            totalAmount={totalAmount}
            customerName={customerName}
            customerEmail={email}
            customerPhone={phone}
            orderName={orderName}
          />

          {/* Right: Summary */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <BookingSummary
              accommodation={accommodation}
              accommodationType={accommodationType}
              checkIn={checkIn}
              checkOut={checkOut}
              adults={adults}
              children={children}
              pets={pets}
              siteNumber={siteNumber}
              vehicleCount={vehicleCount}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
