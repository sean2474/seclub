"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Calendar, ChevronRight, Home, Tent, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/mock-auth";
import { getMyReservations } from "@/lib/api";
import { getStatusLabel, getStatusColor, type Reservation } from "@/types/reservation";
import { RequireAuth } from "../../_components/require-auth";

export function ReservationsContent() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getMyReservations(user.id)
        .then(setReservations)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  // 예약을 상태별로 분류
  const upcomingReservations = reservations.filter(
    (r) => r.status === "confirmed" || r.status === "pending"
  );
  const pastReservations = reservations.filter(
    (r) => r.status === "completed" || r.status === "cancelled" || r.status === "refunded" || r.status === "refund_pending"
  );

  return (
    <RequireAuth title="내 예약">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">내 예약</h1>
          <p className="mt-2 text-foreground/60">
            예약 내역을 확인하고 관리할 수 있습니다.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-foreground/30" />
          </div>
        ) : (
          <>
            {/* Upcoming Reservations */}
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-medium text-foreground">
                <Calendar className="size-5" />
                다가오는 예약
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-sm text-primary">
                  {upcomingReservations.length}
                </span>
              </h2>
              
              {upcomingReservations.length === 0 ? (
                <div className="rounded-lg border border-foreground/10 bg-white p-8 text-center">
                  <p className="text-foreground/60">예정된 예약이 없습니다.</p>
                  <Link
                    href="/reserve"
                    className="mt-4 inline-block rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    새 예약하기
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
              )}
            </section>

            {/* Past Reservations */}
            <section>
              <h2 className="mb-4 text-lg font-medium text-foreground">
                지난 예약
              </h2>
              
              {pastReservations.length === 0 ? (
                <div className="rounded-lg border border-foreground/10 bg-white p-8 text-center">
                  <p className="text-foreground/60">지난 예약 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </RequireAuth>
  );
}

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const checkIn = new Date(reservation.checkIn);
  const checkOut = new Date(reservation.checkOut);
  const Icon = reservation.accommodationType === "room" ? Home : Tent;

  return (
    <Link
      href={`/my/reservations/${reservation.id}`}
      className="group flex cursor-pointer items-start gap-4 rounded-lg border border-foreground/10 bg-white p-4 transition-colors hover:border-foreground/20"
    >
      {/* Icon */}
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-foreground/5">
        <Icon className="size-6 text-foreground/60" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-foreground">{reservation.accommodationName}</p>
            <p className="text-sm text-foreground/60">{reservation.siteNumber}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(reservation.status)}`}>
            {getStatusLabel(reservation.status)}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/60">
          <span>
            {format(checkIn, "M월 d일", { locale: ko })} - {format(checkOut, "M월 d일", { locale: ko })}
          </span>
          <span>{reservation.nights}박</span>
          <span>
            성인 {reservation.adults}명
            {reservation.children > 0 && `, 아동 ${reservation.children}명`}
          </span>
        </div>

        <p className="mt-2 text-sm font-medium text-foreground">
          {reservation.totalAmount.toLocaleString()}원
        </p>
      </div>

      {/* Arrow */}
      <ChevronRight className="size-5 shrink-0 text-foreground/30 transition-colors group-hover:text-foreground/60" />
    </Link>
  );
}
