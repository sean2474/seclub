import Link from "next/link";
import { rooms, getRoomById } from "@/lib/room-data";
import { StepIndicator } from "./_components/step-indicator";
import { BookingForm } from "./_components/booking-form";

interface ReservePageProps {
  searchParams: Promise<{ room?: string }>;
}

export default async function ReservePage({ searchParams }: ReservePageProps) {
  const { room: roomId } = await searchParams;
  
  // URL 쿼리에서 객실 ID를 가져오거나, 없으면 첫 번째 객실 선택
  const selectedRoom = roomId ? getRoomById(roomId) : null;
  const defaultRoom = selectedRoom || rooms[0];

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
          <StepIndicator currentStep={1} />
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-xl">
          <h1 className="mb-6 text-2xl font-semibold text-foreground">
            숙박 일정 선택
          </h1>

          {/* Booking Form */}
          <BookingForm defaultRoom={defaultRoom} />
        </div>
      </main>
    </div>
  );
}
