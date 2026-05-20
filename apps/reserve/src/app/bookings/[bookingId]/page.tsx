import Link from "next/link";
import Image from "next/image";
import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Users,
  PawPrint,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Download,
  Printer,
  ChevronRight,
  Home,
  Car,
  Utensils,
  Coffee,
  BedDouble,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRoomById, formatPrice } from "@/lib/room-data";

interface BookingPageProps {
  params: Promise<{ bookingId: string }>;
}

// 목업 데이터 - 실제로는 DB에서 가져옴
function getMockBookingData(bookingId: string) {
  const room = getRoomById("ocean-pool-villa");
  if (!room) return null;

  return {
    bookingNumber: bookingId,
    status: "confirmed" as const,
    room,
    checkIn: addDays(new Date(), 14),
    checkOut: addDays(new Date(), 16),
    nights: 2,
    adults: 4,
    children: 1,
    pets: 1,
    addOns: {
      breakfast: true,
      lateCheckout: false,
      extraBed: true,
    },
    guest: {
      firstName: "길동",
      lastName: "홍",
      email: "hong@example.com",
      phone: "010-1234-5678",
      arrivalTime: "16:00",
      specialRequests: "조용한 객실 부탁드립니다.",
    },
    payment: {
      method: "신용카드",
      paidAt: new Date(),
      roomTotal: 900000,
      extraPersonFee: 30000,
      petFee: 40000,
      addOnTotal: 90000,
      tax: 106000,
      total: 1166000,
    },
  };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { bookingId } = await params;
  const booking = getMockBookingData(bookingId);

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            예약을 찾을 수 없습니다
          </h1>
          <p className="mt-2 text-foreground/60">
            예약 번호를 다시 확인해주세요.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels = {
    confirmed: "예약 확정",
    pending: "대기중",
    cancelled: "취소됨",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-lg font-light tracking-[0.3em] text-foreground">
              SE
            </span>
            <span className="-mt-1 text-[9px] font-light tracking-[0.15em] text-foreground">
              CLUB
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              고객센터
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-foreground/60">
          <Link href="/" className="hover:text-foreground">
            홈
          </Link>
          <ChevronRight className="size-4" />
          <span className="text-foreground">예약 확인</span>
        </nav>

        {/* Header Section */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                예약 확인서
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[booking.status]}`}
              >
                {statusLabels[booking.status]}
              </span>
            </div>
            <p className="mt-1 text-foreground/60">
              예약 번호: <span className="font-mono">{booking.bookingNumber}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-foreground/20"
            >
              <Printer className="mr-2 size-4" />
              인쇄
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-foreground/20"
            >
              <Download className="mr-2 size-4" />
              PDF 저장
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Room Card */}
            <section className="overflow-hidden rounded-lg border border-foreground/10 bg-white">
              <div className="relative h-48 w-full sm:h-64">
                <Image
                  src={booking.room.images[0]}
                  alt={booking.room.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded bg-black/60 px-2 py-1 text-xs text-white">
                    {booking.room.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {booking.room.name}
                </h2>
                <p className="mt-1 text-sm text-foreground/60">
                  {booking.room.roomConfig}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {/* Check-in */}
                  <div className="rounded-lg bg-foreground/5 p-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <Calendar className="size-4" />
                      체크인
                    </div>
                    <p className="mt-1 font-semibold text-foreground">
                      {format(booking.checkIn, "yyyy년 M월 d일 (EEE)", {
                        locale: ko,
                      })}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {booking.room.checkIn} 이후
                    </p>
                  </div>

                  {/* Check-out */}
                  <div className="rounded-lg bg-foreground/5 p-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/60">
                      <Clock className="size-4" />
                      체크아웃
                    </div>
                    <p className="mt-1 font-semibold text-foreground">
                      {format(booking.checkOut, "yyyy년 M월 d일 (EEE)", {
                        locale: ko,
                      })}
                    </p>
                    <p className="text-sm text-foreground/60">
                      {booking.room.checkOut} 이전
                    </p>
                  </div>
                </div>

                {/* Guests */}
                <div className="mt-4 flex items-center gap-4 rounded-lg bg-foreground/5 p-4">
                  <Users className="size-5 text-foreground/60" />
                  <div>
                    <p className="font-medium text-foreground">
                      성인 {booking.adults}명
                      {booking.children > 0 && `, 소인 ${booking.children}명`}
                    </p>
                    {booking.pets > 0 && (
                      <p className="flex items-center gap-1 text-sm text-primary">
                        <PawPrint className="size-3" />
                        반려동물 {booking.pets}마리
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Add-ons */}
            {(booking.addOns.breakfast ||
              booking.addOns.lateCheckout ||
              booking.addOns.extraBed) && (
              <section className="rounded-lg border border-foreground/10 bg-white p-6">
                <h3 className="mb-4 font-semibold text-foreground">추가 옵션</h3>
                <div className="space-y-3">
                  {booking.addOns.breakfast && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <Coffee className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">조식 포함</p>
                        <p className="text-foreground/60">
                          {booking.adults + booking.children}인 x {booking.nights}박
                        </p>
                      </div>
                    </div>
                  )}
                  {booking.addOns.extraBed && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <BedDouble className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">엑스트라 베드</p>
                        <p className="text-foreground/60">{booking.nights}박</p>
                      </div>
                    </div>
                  )}
                  {booking.addOns.lateCheckout && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">레이트 체크아웃</p>
                        <p className="text-foreground/60">14:00까지</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Guest Information */}
            <section className="rounded-lg border border-foreground/10 bg-white p-6">
              <h3 className="mb-4 font-semibold text-foreground">예약자 정보</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 size-4 text-foreground/40" />
                  <div>
                    <dt className="text-foreground/60">이름</dt>
                    <dd className="font-medium text-foreground">
                      {booking.guest.lastName}
                      {booking.guest.firstName}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-4 text-foreground/40" />
                  <div>
                    <dt className="text-foreground/60">이메일</dt>
                    <dd className="font-medium text-foreground">
                      {booking.guest.email}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-4 text-foreground/40" />
                  <div>
                    <dt className="text-foreground/60">연락처</dt>
                    <dd className="font-medium text-foreground">
                      {booking.guest.phone}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-4 text-foreground/40" />
                  <div>
                    <dt className="text-foreground/60">예상 도착 시간</dt>
                    <dd className="font-medium text-foreground">
                      {booking.guest.arrivalTime}
                    </dd>
                  </div>
                </div>
                {booking.guest.specialRequests && (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="mt-0.5 size-4 text-foreground/40" />
                    <div>
                      <dt className="text-foreground/60">특별 요청사항</dt>
                      <dd className="font-medium text-foreground">
                        {booking.guest.specialRequests}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
            </section>

            {/* Location & Directions */}
            <section className="rounded-lg border border-foreground/10 bg-white p-6">
              <h3 className="mb-4 font-semibold text-foreground">오시는 길</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-4 text-foreground/40" />
                  <div>
                    <p className="font-medium text-foreground">SE CLUB</p>
                    <p className="text-sm text-foreground/60">
                      경상남도 남해군 미조면 미조로 123
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-foreground/5 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="size-4 text-foreground/60" />
                    <span className="font-medium text-foreground">
                      자가용 이용시
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground/60">
                    남해고속도로 진주IC에서 약 1시간 소요. 무료 주차 가능.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-foreground/20"
                  asChild
                >
                  <Link
                    href="https://map.naver.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="mr-2 size-4" />
                    네이버 지도에서 보기
                  </Link>
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar - Payment Summary */}
          <div className="space-y-6">
            {/* Payment Details */}
            <section className="rounded-lg border border-foreground/10 bg-white p-6">
              <h3 className="mb-4 font-semibold text-foreground">결제 내역</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-foreground/60">
                    객실 요금 ({booking.nights}박)
                  </dt>
                  <dd className="text-foreground">
                    {formatPrice(booking.payment.roomTotal)}원
                  </dd>
                </div>
                {booking.payment.extraPersonFee > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-foreground/60">추가 인원</dt>
                    <dd className="text-foreground">
                      {formatPrice(booking.payment.extraPersonFee)}원
                    </dd>
                  </div>
                )}
                {booking.payment.petFee > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-foreground/60">반려동물 요금</dt>
                    <dd className="text-foreground">
                      {formatPrice(booking.payment.petFee)}원
                    </dd>
                  </div>
                )}
                {booking.payment.addOnTotal > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-foreground/60">추가 옵션</dt>
                    <dd className="text-foreground">
                      {formatPrice(booking.payment.addOnTotal)}원
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-foreground/60">세금 및 수수료</dt>
                  <dd className="text-foreground">
                    {formatPrice(booking.payment.tax)}원
                  </dd>
                </div>
                <div className="border-t border-foreground/10 pt-3">
                  <div className="flex justify-between text-base">
                    <dt className="font-semibold text-foreground">총 결제 금액</dt>
                    <dd className="font-semibold text-primary">
                      {formatPrice(booking.payment.total)}원
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-4 rounded-lg bg-foreground/5 p-3 text-sm">
                <p className="text-foreground/60">결제 수단</p>
                <p className="font-medium text-foreground">
                  {booking.payment.method}
                </p>
                <p className="text-xs text-foreground/60">
                  {format(booking.payment.paidAt, "yyyy년 M월 d일 HH:mm 결제", {
                    locale: ko,
                  })}
                </p>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="rounded-lg border border-foreground/10 bg-white p-6">
              <h3 className="mb-4 font-semibold text-foreground">빠른 메뉴</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-foreground/20"
                >
                  <Download className="mr-2 size-4" />
                  캘린더에 추가
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-foreground/20"
                >
                  <Utensils className="mr-2 size-4" />
                  주변 맛집 보기
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-foreground/20"
                  asChild
                >
                  <Link href="/contact">
                    <MessageSquare className="mr-2 size-4" />
                    문의하기
                  </Link>
                </Button>
              </div>
            </section>

            {/* Cancellation Policy */}
            <section className="rounded-lg border border-foreground/10 bg-white p-6">
              <h3 className="mb-4 font-semibold text-foreground">취소 정책</h3>
              <div className="space-y-2 text-sm text-foreground/60">
                <p>- 체크인 7일 전: 전액 환불</p>
                <p>- 체크인 3일 전: 50% 환불</p>
                <p>- 체크인 당일: 환불 불가</p>
              </div>
              <Button
                variant="ghost"
                className="mt-4 h-auto p-0 text-sm text-red-600 hover:text-red-700 hover:bg-transparent"
              >
                예약 취소 요청
              </Button>
            </section>

            {/* Need Help */}
            <section className="rounded-lg border border-primary/20 bg-primary/5 p-6">
              <h3 className="mb-2 font-semibold text-foreground">
                도움이 필요하신가요?
              </h3>
              <p className="mb-4 text-sm text-foreground/60">
                예약 변경이나 문의사항이 있으시면 언제든 연락주세요.
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href="tel:055-123-4567"
                  className="flex items-center gap-2 text-foreground hover:text-primary"
                >
                  <Phone className="size-4" />
                  055-123-4567
                </a>
                <a
                  href="mailto:help@seclub.kr"
                  className="flex items-center gap-2 text-foreground hover:text-primary"
                >
                  <Mail className="size-4" />
                  help@seclub.kr
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="border-foreground/20"
            asChild
          >
            <Link href="/">
              <Home className="mr-2 size-4" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-foreground/10 bg-white py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-foreground/60">
          <p>SE CLUB | 경상남도 남해군 미조면 미조로 123</p>
          <p className="mt-1">
            Tel: 055-123-4567 | Email: help@seclub.kr
          </p>
        </div>
      </footer>
    </div>
  );
}
