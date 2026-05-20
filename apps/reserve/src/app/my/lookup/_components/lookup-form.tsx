"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lookupReservation } from "@/lib/api";

type LookupMethod = "email" | "phone";

export function LookupForm() {
  const router = useRouter();
  const [bookingNumber, setBookingNumber] = useState("");
  const [lookupMethod, setLookupMethod] = useState<LookupMethod>("email");
  const [contactInfo, setContactInfo] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!bookingNumber.trim()) {
      setError("예약번호를 입력해주세요.");
      return;
    }

    if (!contactInfo.trim()) {
      setError(lookupMethod === "email" ? "이메일을 입력해주세요." : "전화번호를 입력해주세요.");
      return;
    }

    setIsSearching(true);

    try {
      const result = await lookupReservation(
        bookingNumber.trim().toUpperCase(),
        contactInfo
      );

      if (!result.success || !result.reservation) {
        setError(result.error || "예약 내역을 찾을 수 없습니다. 예약번호와 연락처를 다시 확인해주세요.");
        setIsSearching(false);
        return;
      }

      // 예약 상세 페이지로 이동 (비회원 토큰 포함)
      router.push(`/my/lookup/result/${result.reservation.id}?token=${btoa(contactInfo)}`);
    } catch {
      setError("조회 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Booking Number */}
      <div className="space-y-2">
        <label htmlFor="bookingNumber" className="block text-sm font-medium text-foreground">
          예약번호 <span className="text-red-500">*</span>
        </label>
        <Input
          id="bookingNumber"
          type="text"
          placeholder="예: SE260314-ABC1"
          value={bookingNumber}
          onChange={(e) => setBookingNumber(e.target.value.toUpperCase())}
          className="h-12 font-mono uppercase"
        />
      </div>

      {/* Lookup Method Toggle */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          예약자 확인 방법 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setLookupMethod("email");
              setContactInfo("");
              setError("");
            }}
            className={`flex-1 cursor-pointer rounded-lg border py-2 text-sm font-medium transition-colors ${
              lookupMethod === "email"
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/20 text-foreground/70 hover:border-foreground/40"
            }`}
          >
            이메일
          </button>
          <button
            type="button"
            onClick={() => {
              setLookupMethod("phone");
              setContactInfo("");
              setError("");
            }}
            className={`flex-1 cursor-pointer rounded-lg border py-2 text-sm font-medium transition-colors ${
              lookupMethod === "phone"
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/20 text-foreground/70 hover:border-foreground/40"
            }`}
          >
            전화번호
          </button>
        </div>
      </div>

      {/* Contact Info Input */}
      <div className="space-y-2">
        <label htmlFor="contactInfo" className="block text-sm font-medium text-foreground">
          {lookupMethod === "email" ? "이메일" : "전화번호"} <span className="text-red-500">*</span>
        </label>
        <Input
          id="contactInfo"
          type={lookupMethod === "email" ? "email" : "tel"}
          placeholder={lookupMethod === "email" ? "example@email.com" : "010-1234-5678"}
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          className="h-12"
        />
        <p className="text-xs text-foreground/60">
          예약 시 입력한 {lookupMethod === "email" ? "이메일" : "전화번호"}를 입력해주세요.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSearching}
        className="h-12 w-full cursor-pointer bg-foreground text-background hover:bg-foreground/90"
      >
        {isSearching ? (
          "조회 중..."
        ) : (
          <>
            <Search className="mr-2 size-4" />
            예약 조회하기
          </>
        )}
      </Button>
    </form>
  );
}
