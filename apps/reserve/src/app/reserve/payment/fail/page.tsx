import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FailPageProps {
  searchParams: Promise<{
    code?: string;
    message?: string;
    orderId?: string;
  }>;
}

export default async function PaymentFailPage({ searchParams }: FailPageProps) {
  const query = await searchParams;
  
  const errorCode = query.code || "UNKNOWN_ERROR";
  const errorMessage = query.message || "알 수 없는 오류가 발생했습니다.";

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="border-b border-foreground/10 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-lg font-light tracking-[0.3em] text-foreground">SE</span>
            <span className="text-[9px] font-light tracking-[0.15em] text-foreground -mt-1">CLUB</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-16">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-100">
            <XCircle className="size-10 text-red-500" />
          </div>

          {/* Error Message */}
          <h1 className="mb-2 text-2xl font-semibold text-foreground">
            결제에 실패했습니다
          </h1>
          <p className="mb-8 text-foreground/60">
            {errorMessage}
          </p>

          {/* Error Details */}
          <div className="mb-8 rounded-lg border border-foreground/10 bg-foreground/5 p-4 text-left">
            <p className="text-sm text-foreground/60">
              <span className="font-medium">오류 코드:</span> {errorCode}
            </p>
            {query.orderId && (
              <p className="mt-1 text-sm text-foreground/60">
                <span className="font-medium">주문 ID:</span> {query.orderId}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              asChild
              className="h-12 bg-foreground px-8 text-background hover:bg-foreground/90"
            >
              <Link href="/reserve">
                다시 예약하기
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 px-8"
            >
              <Link href="/">
                홈으로 돌아가기
              </Link>
            </Button>
          </div>

          {/* Help */}
          <p className="mt-8 text-sm text-foreground/60">
            문제가 지속되면{" "}
            <Link href="/contact" className="text-foreground underline">
              고객센터
            </Link>
            로 문의해주세요.
          </p>
        </div>
      </main>
    </div>
  );
}
