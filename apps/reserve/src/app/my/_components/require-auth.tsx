"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/mock-auth";
import { Button } from "@/components/ui/button";
import { currentUrl, loginUrl, signupUrl } from "@/lib/auth-urls";

interface RequireAuthProps {
  children: React.ReactNode;
  title?: string;
}

export function RequireAuth({ children, title }: RequireAuthProps) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-foreground/10 bg-white px-8 py-16 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-foreground/5">
          <Lock className="size-8 text-foreground/40" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          로그인이 필요합니다
        </h2>
        <p className="mb-6 text-sm text-foreground/60">
          {title ? `${title} 기능을 이용하려면` : "이 페이지를 보려면"} 로그인이 필요합니다.
        </p>
        <div className="flex gap-3">
          <Button asChild className="bg-foreground text-background hover:bg-foreground/90">
            <a href={loginUrl(currentUrl())}>로그인</a>
          </Button>
          <Button asChild variant="outline">
            <a href={signupUrl(currentUrl())}>회원가입</a>
          </Button>
        </div>
        <Link
          href="/my/lookup"
          className="mt-6 text-sm text-foreground/60 underline-offset-4 hover:text-foreground hover:underline"
        >
          비회원 예약 조회는 여기서 가능합니다
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
