"use client";

import { useEffect, useRef, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { Button } from "@/components/ui/button";
import { generateBookingNumber } from "@/lib/booking-store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WidgetsInstance = any;

interface TossPaymentWidgetProps {
  draftId: string;
  searchParams: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderName: string;
}

// 테스트용 결제위젯 클라이언트 키
const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_WIDGET_CLIENT_KEY!;

export function TossPaymentWidget({
  draftId,
  searchParams,
  totalAmount,
  customerName,
  customerEmail,
  customerPhone,
  orderName,
}: TossPaymentWidgetProps) {
  const [widgets, setWidgets] = useState<WidgetsInstance | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const paymentMethodRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initTossPayments() {
      try {
        const tossPayments = await loadTossPayments(CLIENT_KEY);

        // 비회원 결제 (customerKey: ANONYMOUS)
        const widgetsInstance = tossPayments.widgets({
          customerKey: "ANONYMOUS",
        });

        // 결제 금액 설정
        await widgetsInstance.setAmount({
          currency: "KRW",
          value: totalAmount,
        });

        setWidgets(widgetsInstance);
      } catch (error) {
        console.error("[v0] 토스페이먼츠 초기화 오류:", error);
      }
    }

    initTossPayments();
  }, [totalAmount]);

  useEffect(() => {
    async function renderWidgets() {
      if (!widgets || !paymentMethodRef.current || !agreementRef.current) return;

      try {
        // 결제 UI 렌더링
        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);

        setIsReady(true);
      } catch (error) {
        console.error("[v0] 결제 위젯 렌더링 오류:", error);
      }
    }

    renderWidgets();
  }, [widgets]);

  const handlePayment = async () => {
    if (!widgets || !isReady) {
      alert("결제 위젯을 불러오는 중입니다. 잠시만 기다려주세요.");
      return;
    }

    setIsProcessing(true);

    const bookingNumber = generateBookingNumber();
    const orderId = `${draftId}-${Date.now()}`;

    // searchParams에 결제 정보 추가
    const params = new URLSearchParams(searchParams);
    params.set("bookingNumber", bookingNumber);
    params.set("orderId", orderId);

    // 현재 origin 가져오기
    const origin = window.location.origin;
    const successUrl = `${origin}/reserve/payment/success?${params.toString()}`;
    const failUrl = `${origin}/reserve/payment/fail?orderId=${orderId}`;

    try {
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl,
        failUrl,
        customerEmail: customerEmail || undefined,
        customerName: customerName || undefined,
        customerMobilePhone: customerPhone ? customerPhone.replace(/-/g, "") : undefined,
      });
      // requestPayment가 성공적으로 완료되면 (사용자가 결제창에서 취소하지 않은 경우)
      // 토스페이먼츠가 자동으로 successUrl로 리다이렉트함
    } catch (error: unknown) {
      // 사용자가 결제를 취소한 경우
      const err = error as { code?: string; message?: string };
      if (err.code === "USER_CANCEL") {
        // 사용자 취소 - 조용히 처리
        setIsProcessing(false);
        return;
      }

      // 기타 오류
      console.error("[v0] 결제 요청 오류:", error);
      alert(err.message || "결제 요청 중 오류가 발생했습니다.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 결제 위젯 로딩 상태 */}
      {!isReady && (
        <div className="flex h-64 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5">
          <div className="text-center">
            <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
            <p className="text-sm text-foreground/60">결제 수단을 불러오는 중...</p>
          </div>
        </div>
      )}

      {/* 결제 수단 UI */}
      <div
        ref={paymentMethodRef}
        id="payment-method"
        className={!isReady ? "hidden" : ""}
      />

      {/* 이용약관 UI */}
      <div
        ref={agreementRef}
        id="agreement"
        className={!isReady ? "hidden" : ""}
      />

      {/* 취소 및 환불 안내 */}
      <section className="rounded-lg border border-foreground/10 bg-white p-4">
        <h3 className="mb-2 font-medium text-foreground">취소 및 환불 안내</h3>
        <ul className="space-y-1 text-sm text-foreground/60">
          <li>체크인 7일 전까지: 전액 환불</li>
          <li>체크인 3~6일 전: 50% 환불</li>
          <li>체크인 2일 전 이후: 환불 불가</li>
        </ul>
      </section>

      {/* 결제 버튼 */}
      <Button
        onClick={handlePayment}
        disabled={!isReady || isProcessing}
        className="h-14 w-full cursor-pointer bg-foreground text-base font-medium text-background hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing
          ? "결제 처리 중..."
          : `${new Intl.NumberFormat("ko-KR").format(totalAmount)}원 결제하기`
        }
      </Button>
    </div>
  );
}
