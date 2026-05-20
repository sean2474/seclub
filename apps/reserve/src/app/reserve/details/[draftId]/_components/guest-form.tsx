"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface GuestFormProps {
  draftId: string;
  searchParams: string;
}

export function GuestForm({ draftId, searchParams }: GuestFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    arrivalTime: "15:00",
    specialRequests: "",
  });
  const [agreements, setAgreements] = useState({
    cancellationPolicy: false,
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    agreements.cancellationPolicy &&
    agreements.terms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    // 결제 페이지로 이동
    const params = new URLSearchParams(searchParams);
    params.set("firstName", formData.firstName);
    params.set("lastName", formData.lastName);
    params.set("email", formData.email);
    params.set("phone", formData.phone);
    params.set("arrivalTime", formData.arrivalTime);
    params.set("specialRequests", formData.specialRequests);

    router.push(`/reserve/payment/${draftId}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Contact Information */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">연락처 정보</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-foreground">
              이름 <span className="text-red-500">*</span>
            </label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              placeholder="길동"
              required
              className="h-12 border-foreground/20 bg-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-foreground">
              성 <span className="text-red-500">*</span>
            </label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              placeholder="홍"
              required
              className="h-12 border-foreground/20 bg-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            이메일 <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="example@email.com"
            required
            className="h-12 border-foreground/20 bg-white"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            전화번호 <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="010-1234-5678"
            required
            className="h-12 border-foreground/20 bg-white"
          />
        </div>
      </section>

      {/* Stay Preferences */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">숙박 정보</h2>
        <div className="space-y-2">
          <label htmlFor="arrivalTime" className="text-sm font-medium text-foreground">
            예상 도착 시간
          </label>
          <select
            id="arrivalTime"
            value={formData.arrivalTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, arrivalTime: e.target.value }))
            }
            className="flex h-12 w-full rounded-md border border-foreground/20 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            {Array.from({ length: 9 }, (_, i) => {
              const hour = 15 + i;
              const time = `${hour.toString().padStart(2, "0")}:00`;
              return (
                <option key={time} value={time}>
                  {time}
                </option>
              );
            })}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="specialRequests" className="text-sm font-medium text-foreground">
            특별 요청 사항
          </label>
          <Textarea
            id="specialRequests"
            value={formData.specialRequests}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, specialRequests: e.target.value }))
            }
            placeholder="요청 사항을 입력해주세요 (선택)"
            className="min-h-24 border-foreground/20 bg-white resize-none"
          />
        </div>
      </section>

      {/* Agreements */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">약관 동의</h2>
        <div className="space-y-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-foreground/10 bg-white p-4">
            <Checkbox
              id="cancellationPolicy"
              checked={agreements.cancellationPolicy}
              onCheckedChange={(checked) =>
                setAgreements((prev) => ({
                  ...prev,
                  cancellationPolicy: checked === true,
                }))
              }
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="font-medium text-foreground">취소 및 환불 정책에 동의합니다</p>
              <p className="mt-1 text-sm text-foreground/60">
                체크인 7일 전까지 무료 취소 가능합니다. 이후 취소 시 1박 요금이 부과됩니다.
              </p>
            </div>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-foreground/10 bg-white p-4">
            <Checkbox
              id="terms"
              checked={agreements.terms}
              onCheckedChange={(checked) =>
                setAgreements((prev) => ({
                  ...prev,
                  terms: checked === true,
                }))
              }
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="font-medium text-foreground">이용약관에 동의합니다</p>
              <p className="mt-1 text-sm text-foreground/60">
                SE CLUB의 이용약관 및 개인정보처리방침에 동의합니다.
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="h-14 w-full bg-foreground text-base font-medium text-background hover:bg-foreground/90 disabled:opacity-50"
      >
        {isSubmitting ? "처리 중..." : "결제 진행하기"}
      </Button>
    </form>
  );
}
