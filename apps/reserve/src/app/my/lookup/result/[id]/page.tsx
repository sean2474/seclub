import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, Home, Tent, Calendar, Users, Car, Phone, Mail, CreditCard, Clock, AlertTriangle } from "lucide-react";
import { getReservationById } from "@/lib/api";
import { getStatusLabel, getStatusColor, getRefundRate, REFUND_POLICIES } from "@/types/reservation";
import { loginUrl, signupUrl } from "@/lib/auth-urls";

interface LookupResultPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function LookupResultPage({ params, searchParams }: LookupResultPageProps) {
  const { id } = await params;
  const { token } = await searchParams;

  // 토큰 검증 (실제로는 서버에서 검증)
  if (!token) {
    notFound();
  }

  const reservation = await getReservationById(id);

  if (!reservation) {
    notFound();
  }

  const checkIn = new Date(reservation.checkIn);
  const checkOut = new Date(reservation.checkOut);
  const Icon = reservation.accommodationType === "room" ? Home : Tent;
  const canCancel = reservation.status === "confirmed" || reservation.status === "pending";
  const refundRate = canCancel ? getRefundRate(checkIn) : 0;
  const expectedRefund = Math.round(reservation.paidAmount * (refundRate / 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/my/lookup"
          className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground/60 transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">예약 조회 결과</h1>
          <p className="text-sm text-foreground/60">예약번호: {reservation.bookingNumber}</p>
        </div>
      </div>

      {/* Guest Notice */}
      <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <AlertTriangle className="size-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">비회원 예약 조회</p>
          <p className="text-xs text-foreground/60">
            회원 가입 시 예약 내역 자동 연동 및 포인트 적립 혜택을 받으실 수 있습니다.
          </p>
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

      {/* Guest Info (Masked for non-members) */}
      <div className="rounded-lg border border-foreground/10 bg-white p-4">
        <h3 className="font-medium text-foreground">예약자 정보</h3>
        <div className="mt-3 space-y-2">
          <p className="flex items-center gap-2 text-foreground/80">
            <span className="font-medium">{reservation.guestName}</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-foreground/60">
            <Phone className="size-4" />
            {reservation.guestPhone.replace(/(\d{3})(\d{4})(\d{4})/, "$1-****-$3")}
          </p>
          <p className="flex items-center gap-2 text-sm text-foreground/60">
            <Mail className="size-4" />
            {reservation.guestEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
          </p>
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
            href="/contact"
            className="flex-1 rounded-lg border border-foreground/20 py-3 text-center text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
          >
            예약 변경 문의
          </Link>
          <Link
            href="/contact"
            className="flex-1 rounded-lg border border-red-200 bg-red-50 py-3 text-center text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            예약 취소 문의
          </Link>
        </div>
      )}

      {/* Register Prompt */}
      <div className="rounded-lg border border-foreground/10 bg-gradient-to-r from-foreground/5 to-transparent p-6 text-center">
        <h3 className="font-medium text-foreground">회원이 되시면 더 많은 혜택을!</h3>
        <p className="mt-2 text-sm text-foreground/60">
          예약 내역 자동 관리, 포인트 적립, 멤버십 혜택까지
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <a
            href={signupUrl()}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            회원가입
          </a>
          <a
            href={loginUrl()}
            className="rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
          >
            로그인
          </a>
        </div>
      </div>
    </div>
  );
}
