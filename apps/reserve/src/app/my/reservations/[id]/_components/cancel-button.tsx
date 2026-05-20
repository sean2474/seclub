"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CancelButtonProps {
  reservationId: string;
  bookingNumber: string;
  refundRate: number;
  expectedRefund: number;
}

export function CancelButton({
  reservationId,
  bookingNumber,
  refundRate,
  expectedRefund,
}: CancelButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    
    // 실제로는 API 호출
    // await fetch(`/api/reservations/${reservationId}/cancel`, { method: "POST" });
    
    // 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    router.push("/my/reservations?cancelled=true");
    router.refresh();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="flex-1 cursor-pointer rounded-lg border border-red-200 bg-red-50 py-3 text-center text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          예약 취소
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>예약을 취소하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>예약번호 <span className="font-medium">{bookingNumber}</span></p>
              
              {refundRate > 0 ? (
                <div className="rounded-lg bg-foreground/5 p-3">
                  <p className="text-sm">
                    환불 예정 금액: <span className="font-medium text-foreground">{expectedRefund.toLocaleString()}원</span>
                    <span className="ml-1 text-foreground/60">({refundRate}%)</span>
                  </p>
                  <p className="mt-1 text-xs text-foreground/60">
                    환불은 결제 수단에 따라 3~5영업일 소요될 수 있습니다.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-sm text-red-700">
                    당일 취소는 환불이 불가능합니다.
                  </p>
                </div>
              )}

              <p className="text-sm text-foreground/60">
                취소 후에는 되돌릴 수 없습니다.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>돌아가기</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isLoading ? "처리 중..." : "예약 취소하기"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
