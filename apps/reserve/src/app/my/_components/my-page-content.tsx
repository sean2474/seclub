"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Heart, CreditCard, Award, Search, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/mock-auth";
import { getReservationCounts, getMembershipInfo, type MembershipInfo } from "@/lib/api";
import type { ReservationStatus } from "@/types/reservation";

const quickLinks = [
  {
    label: "내 예약",
    description: "예약 내역 확인 및 관리",
    href: "/my/reservations",
    icon: Calendar,
  },
  {
    label: "즐겨찾기",
    description: "관심 있는 객실 모아보기",
    href: "/my/favorites",
    icon: Heart,
  },
  {
    label: "결제/환불",
    description: "결제 내역 및 환불 상태",
    href: "/my/payments",
    icon: CreditCard,
  },
  {
    label: "멤버십",
    description: "등급 및 포인트 확인",
    href: "/my/membership",
    icon: Award,
  },
];

const tierKorean: Record<string, string> = {
  BRONZE: "브론즈",
  SILVER: "실버",
  GOLD: "골드",
  PLATINUM: "플래티넘",
};

export function MyPageContent() {
  const { user, isLoggedIn } = useAuth();
  const [counts, setCounts] = useState<Record<ReservationStatus, number> | null>(null);
  const [membership, setMembership] = useState<MembershipInfo | null>(null);

  useEffect(() => {
    if (isLoggedIn && user) {
      getReservationCounts(user.id).then(setCounts);
      getMembershipInfo(user.id).then(setMembership);
    }
  }, [isLoggedIn, user]);

  const totalReservations = counts
    ? counts.confirmed + counts.completed + counts.pending
    : 0;

  // 비로그인 상태
  if (!isLoggedIn) {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <section>
          <h1 className="text-2xl font-semibold text-foreground">마이페이지</h1>
          <p className="mt-2 text-foreground/60">
            로그인하면 예약 내역, 멤버십, 프로필을 관리할 수 있습니다.
          </p>
        </section>

        {/* Non-member Lookup Section */}
        <section className="rounded-lg border border-foreground/10 bg-white p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Search className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-foreground">비회원 예약 조회</h2>
              <p className="mt-1 text-sm text-foreground/60">
                예약번호와 이메일 또는 전화번호로 예약 내역을 확인할 수 있습니다.
              </p>
              <Link
                href="/my/lookup"
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                <Search className="size-4" />
                예약 조회하기
              </Link>
            </div>
          </div>
        </section>

        {/* Login Prompt */}
        <section className="rounded-lg border border-foreground/10 bg-gradient-to-br from-foreground/5 to-foreground/10 p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground">회원 전용 서비스</h2>
            <p className="mt-2 text-foreground/60">
              로그인하면 더 많은 기능을 이용할 수 있습니다.
            </p>
            
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <div
                    key={link.href}
                    className="flex flex-col items-center gap-2 rounded-lg bg-white/50 p-4 text-center"
                  >
                    <Icon className="size-6 text-foreground/40" />
                    <span className="text-sm text-foreground/60">{link.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/my/login"
                className="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                로그인
              </Link>
              <Link
                href="/my/signup"
                className="rounded-lg border border-foreground/20 bg-white px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
              >
                회원가입
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 로그인 상태
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-2xl font-semibold text-foreground">
          안녕하세요, {user?.name}님
        </h1>
        <p className="mt-2 text-foreground/60">
          SE CLUB에 오신 것을 환영합니다.
        </p>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-foreground/10 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-foreground">
            {membership?.points.toLocaleString() ?? "-"}
          </p>
          <p className="mt-1 text-sm text-foreground/60">보유 포인트</p>
        </div>
        <div className="rounded-lg border border-foreground/10 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-foreground">
            {membership ? tierKorean[membership.tier] : "-"}
          </p>
          <p className="mt-1 text-sm text-foreground/60">멤버십 등급</p>
        </div>
        <div className="rounded-lg border border-foreground/10 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-foreground">{totalReservations}</p>
          <p className="mt-1 text-sm text-foreground/60">예약 내역</p>
        </div>
      </section>

      {/* Quick Access Links */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center justify-between rounded-lg border border-foreground/10 bg-white p-4 transition-colors hover:border-foreground/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-foreground/5 transition-colors group-hover:bg-foreground/10">
                  <Icon className="size-5 text-foreground/60" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{link.label}</p>
                  <p className="text-sm text-foreground/60">{link.description}</p>
                </div>
              </div>
              <ArrowRight className="size-5 text-foreground/30 transition-transform group-hover:translate-x-1 group-hover:text-foreground/60" />
            </Link>
          );
        })}
      </section>

      {/* Non-member Lookup Section */}
      <section className="rounded-lg border border-foreground/10 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="size-5 text-foreground/40" />
            <span className="text-sm text-foreground/60">비회원으로 예약한 내역 조회</span>
          </div>
          <Link
            href="/my/lookup"
            className="text-sm text-foreground/60 underline-offset-4 hover:text-foreground hover:underline"
          >
            예약 조회
          </Link>
        </div>
      </section>
    </div>
  );
}
