"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/mock-auth";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/my");
      } else {
        setError("로그인에 실패했습니다.");
      }
    } catch {
      setError("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-foreground/10 bg-white p-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full bg-foreground text-background hover:bg-foreground/90"
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </Button>

        <p className="mt-4 text-center text-sm text-foreground/60">
          테스트: 아무 이메일/비밀번호로 로그인 가능
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-foreground/60">
          계정이 없으신가요?{" "}
          <Link href="/my/signup" className="text-foreground underline-offset-4 hover:underline">
            회원가입
          </Link>
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/my/lookup"
          className="text-sm text-foreground/60 underline-offset-4 hover:text-foreground hover:underline"
        >
          비회원 예약 조회
        </Link>
      </div>
    </form>
  );
}
