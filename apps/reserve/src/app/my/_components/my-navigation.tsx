"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Heart,
  CreditCard,
  Award,
  User,
  LogOut,
  Search,
} from "lucide-react";
import { useAuth } from "@/lib/mock-auth";

const navItems = [
  {
    label: "내 예약",
    href: "/my/reservations",
    icon: Calendar,
    requiresAuth: true,
  },
  {
    label: "즐겨찾기",
    href: "/my/favorites",
    icon: Heart,
    requiresAuth: true,
  },
  {
    label: "결제/환불 내역",
    href: "/my/payments",
    icon: CreditCard,
    requiresAuth: true,
  },
  {
    label: "멤버십/포인트",
    href: "/my/membership",
    icon: Award,
    requiresAuth: true,
  },
  {
    label: "프로필 관리",
    href: "/my/profile",
    icon: User,
    requiresAuth: true,
  },
];

const guestNavItems = [
  {
    label: "예약 조회",
    href: "/my/lookup",
    icon: Search,
  },
];

export function MyNavigation() {
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <nav className="space-y-1">
      {/* User Info Card */}
      <div className="mb-6 rounded-lg border border-foreground/10 bg-white p-4">
        {isLoggedIn && user ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-foreground/5">
                <User className="size-6 text-foreground/60" />
              </div>
              <div>
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-sm text-foreground/60">{user.membershipTier} 회원</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-foreground/5 px-3 py-2">
              <span className="text-xs text-foreground/60">보유 포인트</span>
              <span className="font-medium text-foreground">{user.points.toLocaleString()}P</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-foreground/5">
                <User className="size-6 text-foreground/60" />
              </div>
              <div>
                <p className="font-medium text-foreground">게스트</p>
                <p className="text-sm text-foreground/60">로그인하세요</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href="/my/login"
                className="flex-1 rounded-lg bg-foreground py-2 text-center text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                로그인
              </Link>
              <Link
                href="/my/signup"
                className="flex-1 rounded-lg border border-foreground/20 py-2 text-center text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
              >
                회원가입
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Guest Navigation - 비회원용 */}
      {!isLoggedIn && (
        <div className="rounded-lg border border-foreground/10 bg-white">
          {guestNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 border-b border-foreground/5 px-4 py-3 text-sm transition-colors last:border-b-0 ${
                  isActive
                    ? "bg-foreground/5 font-medium text-foreground"
                    : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Member Navigation Links - 로그인한 사용자용 */}
      {isLoggedIn && (
        <>
          <div className="rounded-lg border border-foreground/10 bg-white">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 border-b border-foreground/5 px-4 py-3 text-sm transition-colors last:border-b-0 ${
                    isActive
                      ? "bg-foreground/5 font-medium text-foreground"
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={logout}
            className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-lg border border-foreground/10 bg-white px-4 py-3 text-sm text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <LogOut className="size-4" />
            로그아웃
          </button>
        </>
      )}

      {/* Login Required Notice for Guests */}
      {!isLoggedIn && (
        <div className="mt-4 rounded-lg border border-foreground/10 bg-foreground/5 p-4">
          <p className="text-xs text-foreground/60">
            내 예약, 즐겨찾기, 멤버십 등의 기능을 이용하려면 로그인이 필요합니다.
          </p>
        </div>
      )}
    </nav>
  );
}
