"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, Home, Tent, Calendar, Users, Car, Phone, Mail, CreditCard, Clock, Loader2 } from "lucide-react";
import { getReservationById } from "@/lib/api";
import { getStatusLabel, getStatusColor, getRefundRate, REFUND_POLICIES, type Reservation } from "@/types/reservation";
import { RequireAuth } from "../../../_components/require-auth";
import { CancelButton } from "./cancel-button";

interface ReservationDetailContentProps {
  id: string;
}

export function ReservationDetailContent({ id }: ReservationDetailContentProps) {
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getReservationById(id)
      .then(setReservation)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <RequireAuth title="예약 상세">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-foreground/30" />
        </div>
      </RequireAuth>
    );
  }

  if (!reservation) {
    return (
      <RequireAuth title="예약 상세">
        <div className="rounded-lg border border-foreground/10 bg-white p-8 text-center">
          <p className="text-foreground/60">예약을 찾을 수 없습니다.</p>
          <Link
            href="/my/reservations"
            className="mt-4 inline-block rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            예약 목록으로
          </Link>
        </div>
      </RequireAuth>
    );
  }

  const checkIn = new Date(reservation.checkIn);
  const checkOut = new Date(reservation.checkOut);
  const Icon = reservation.accommodationType === "room" ? Home : Tent;
  const canCancel = reservation.status === "confirmed" || reservation.status === "pending";
  const refundRate = canCancel ? getRefundRate(checkIn) : 0;
  const expectedRefund = Math.round(reservation.paidAmount * (refundRate / 100));

  return (
    <RequireAuth title="예약 상세">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/my/reservations"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground/60 transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            <ChevronLeft className="size-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">예약 상세</h1>
            <p className="text-sm text-foreground/60">예약번호: {reservation.bookingNumber}</p>
          </div>
        </div>

        {/* Status Card */}
        <div className="rounded-lg border border-foreground/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-lg bg-foreground/5">
                <Icon className="size-7 text-foreground/60" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">{reservation.accommodationName}</p>
                <p className="text-foreground/60">{reservation.siteNumber}</p>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(reservation.status)}`}>
              {getStatusLabel(reservation.status)}
            </span>
          </div>
        </div>

        {/* Schedule & Guests */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-foreground/10 bg-white p-4">
            <div className="flex items-center gap-2 text-foreground/60">
              <Calendar className="size-4" />
              <span className="text-sm font-medium">일정</span>
            </div>
            <p className="mt-2 font-medium text-foreground">
              {format(checkIn, "yyyy년 M월 d일 (EEE)", { locale: ko })}
            </p>
            <p className="text-foreground/60">체크인 15:00</p>
            <div className="my-2 border-t border-foreground/10" />
            <p className="font-medium text-foreground">
              {format(checkOut, "yyyy년 M월 d일 (EEE)", { locale: ko })}
            </p>
            <p className="text-foreground/60">체크아웃 11:00</p>
            <p className="mt-2 text-sm text-primary">{reservation.nights}박</p>
          </div>

          <div className="rounded-lg border border-foreground/10 bg-white p-4">
            <div className="flex items-center gap-2 text-foreground/60">
              <Users className="size-4" />
              <span className="text-sm font-medium">인원 및 차량</span>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-foreground">성인 {reservation.adults}명</p>
              {reservation.children > 0 && (
                <p className="text-foreground">아동 {reservation.children}명</p>
              )}
              {reservation.pets > 0 && (
                <p className="text-foreground">반려동물 {reservation.pets}마리</p>
              )}
            </div>
            {reservation.vehicleCount > 0 && (
              <div className="mt-3 flex items-center gap-2 text-foreground/60">
                <Car className="size-4" />
                <span>차량 {reservation.vehicleCount}대</span>
              </div>
            )}
          </div>
        </div>

        {/* Guest Info */}
        <div className="rounded-lg border border-foreground/10 bg-white p-4">
          <h3 className="font-medium text-foreground">예약자 정보</h3>
          <div className="mt-3 space-y-2">
            <p className="flex items-center gap-2 text-foreground/80">
              <span className="font-medium">{reservation.guestName}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-foreground/60">
              <Phone className="size-4" />
              {reservation.guestPhone}
            </p>
            <p className="flex items-center gap-2 text-sm text-foreground/60">
              <Mail className="size-4" />
              {reservation.guestEmail}
            </p>
            {reservation.arrivalTime && (
              <p className="flex items-center gap-2 text-sm text-foreground/60">
                <Clock className="size-4" />
                도착 예정: {reservation.arrivalTime}
              </p>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="rounded-lg border border-foreground/10 bg-white p-4">
          <h3 className="flex items-center gap-2 font-medium text-foreground">
            <CreditCard className="size-4" />
            결제 정보
          </h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">숙박 요금</span>
              <span className="text-foreground">{reservation.basePrice.toLocaleString()}원</span>
            </div>
            {reservation.extraFees > 0 && (
              <div className="flex justify-between">
                <span className="text-foreground/60">추가 요금</span>
                <span className="text-foreground">{reservation.extraFees.toLocaleString()}원</span>
              </div>
            )}
            <div className="border-t border-foreground/10 pt-2">
              <div className="flex justify-between font-medium">
                <span className="text-foreground">총 결제 금액</span>
                <span className="text-foreground">{reservation.totalAmount.toLocaleString()}원</span>
              </div>
            </div>
            {reservation.paidAt && (
              <p className="text-foreground/60">
                결제일: {format(new Date(reservation.paidAt), "yyyy년 M월 d일 HH:mm", { locale: ko })}
              </p>
            )}
            {reservation.refundedAmount > 0 && (
              <div className="mt-2 rounded-lg bg-red-50 p-3">
                <p className="text-sm text-red-700">
                  환불 금액: {reservation.refundedAmount.toLocaleString()}원
                </p>
                {reservation.refundedAt && (
                  <p className="text-xs text-red-600">
                    환불일: {format(new Date(reservation.refundedAt), "yyyy년 M월 d일", { locale: ko })}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Refund Policy */}
        {canCancel && (
          <div className="rounded-lg border border-foreground/10 bg-white p-4">
            <h3 className="font-medium text-foreground">취소/환불 규정</h3>
            <div className="mt-3 space-y-1 text-sm">
              {REFUND_POLICIES.map((policy, index) => (
                <p
                  key={index}
                  className={policy.refundRate === refundRate ? "font-medium text-primary" : "text-foreground/60"}
                >
                  {policy.description}
                </p>
              ))}
            </div>
            {refundRate > 0 && (
              <div className="mt-4 rounded-lg bg-primary/5 p-3">
                <p className="text-sm text-primary">
                  현재 취소 시 예상 환불액: <span className="font-medium">{expectedRefund.toLocaleString()}원</span> ({refundRate}%)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {canCancel && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/my/reservations/${reservation.id}/modify`}
              className="flex-1 rounded-lg border border-foreground/20 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
            >
              예약 변경
            </Link>
            <CancelButton 
              reservationId={reservation.id}
              bookingNumber={reservation.bookingNumber}
              refundRate={refundRate}
              expectedRefund={expectedRefund}
            />
          </div>
        )}

        {/* Help */}
        <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-4 text-center">
          <p className="text-sm text-foreground/60">
            예약 관련 문의가 있으신가요?
          </p>
          <Link
            href="/contact"
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
          >
            고객센터 문의하기
          </Link>
        </div>
      </div>
    </RequireAuth>
  );
}
