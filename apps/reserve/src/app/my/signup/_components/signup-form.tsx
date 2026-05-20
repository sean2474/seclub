"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/mock-auth";

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
      });
      if (success) {
        router.push("/my");
      } else {
        setError("회원가입에 실패했습니다.");
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
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
              이름
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="홍길동"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
              이메일
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-foreground">
              전화번호
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="010-1234-5678"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
              비밀번호
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호 입력"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="passwordConfirm" className="mb-1.5 block text-sm font-medium text-foreground">
              비밀번호 확인
            </label>
            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호 재입력"
              value={formData.passwordConfirm}
              onChange={handleChange}
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
          {isLoading ? "가입 중..." : "회원가입"}
        </Button>

        <p className="mt-4 text-center text-sm text-foreground/60">
          테스트: 아무 정보로 가입 가능
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-foreground/60">
          이미 계정이 있으신가요?{" "}
          <Link href="/my/login" className="text-foreground underline-offset-4 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </form>
  );
}
