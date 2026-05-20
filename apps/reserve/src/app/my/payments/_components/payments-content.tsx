"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CreditCard, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/mock-auth";
import { getMyPayments, getPaymentStats, type Payment } from "@/lib/api";
import { RequireAuth } from "../../_components/require-auth";

function getStatusInfo(status: Payment["status"], type: "payment" | "refund") {
  if (type === "payment") {
    switch (status) {
      case "completed":
        return { label: "결제 완료", icon: CheckCircle, className: "text-green-600" };
      case "pending":
        return { label: "결제 대기", icon: Clock, className: "text-yellow-600" };
      case "failed":
        return { label: "결제 실패", icon: XCircle, className: "text-red-600" };
      default:
        return { label: "결제", icon: CreditCard, className: "text-foreground/60" };
    }
  } else {
    switch (status) {
      case "completed":
        return { label: "환불 완료", icon: CheckCircle, className: "text-green-600" };
      case "pending":
        return { label: "환불 진행 중", icon: Clock, className: "text-orange-600" };
      default:
        return { label: "환불", icon: ArrowDownLeft, className: "text-foreground/60" };
    }
  }
}

export function PaymentsContent() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<{ totalPaid: number; totalRefunded: number; pendingRefund: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        getMyPayments(user.id),
        getPaymentStats(user.id),
      ])
        .then(([paymentsData, statsData]) => {
          setPayments(paymentsData);
          setStats(statsData);
        })
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const pendingRefunds = payments.filter((p) => p.type === "refund" && p.status === "pending");

  return (
    <RequireAuth title="결제/환불 내역">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">결제/환불 내역</h1>
          <p className="mt-2 text-foreground/60">
            결제 및 환불 내역을 확인할 수 있습니다.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-foreground/30" />
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-foreground/10 bg-white p-4">
                <div className="flex items-center gap-2 text-foreground/60">
                  <ArrowUpRight className="size-4" />
                  <span className="text-sm">총 결제</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  {(stats?.totalPaid ?? 0).toLocaleString()}원
                </p>
              </div>
              
              <div className="rounded-lg border border-foreground/10 bg-white p-4">
                <div className="flex items-center gap-2 text-foreground/60">
                  <ArrowDownLeft className="size-4" />
                  <span className="text-sm">총 환불</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  {(stats?.totalRefunded ?? 0).toLocaleString()}원
                </p>
              </div>
              
              <div className="rounded-lg border border-foreground/10 bg-white p-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock className="size-4" />
                  <span className="text-sm">환불 대기</span>
                </div>
                <p className="mt-2 text-xl font-semibold text-foreground">
                  {pendingRefunds.length}건
                </p>
              </div>
            </div>

            {/* Pending Refunds Alert */}
            {pendingRefunds.length > 0 && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <h3 className="flex items-center gap-2 font-medium text-orange-800">
                  <Clock className="size-4" />
                  환불 진행 중
                </h3>
                <p className="mt-1 text-sm text-orange-700">
                  {pendingRefunds.length}건의 환불이 처리 중입니다. 환불은 결제 수단에 따라 3~5영업일 소요될 수 있습니다.
                </p>
              </div>
            )}

            {/* Payment Records */}
            <section>
              <h2 className="mb-4 text-lg font-medium text-foreground">전체 내역</h2>
              
              {payments.length === 0 ? (
                <div className="rounded-lg border border-foreground/10 bg-white p-8 text-center">
                  <p className="text-foreground/60">결제 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((record) => {
                    const statusInfo = getStatusInfo(record.status, record.type);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <Link
                        key={record.id}
                        href={`/my/reservations/${record.reservationId}`}
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-foreground/10 bg-white p-4 transition-colors hover:border-foreground/20"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex size-10 items-center justify-center rounded-full ${
                            record.type === "payment" ? "bg-green-100" : "bg-orange-100"
                          }`}>
                            {record.type === "payment" ? (
                              <ArrowUpRight className="size-5 text-green-600" />
                            ) : (
                              <ArrowDownLeft className="size-5 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{record.accommodationName}</p>
                            <p className="text-sm text-foreground/60">{record.bookingNumber}</p>
                            <div className="mt-1 flex items-center gap-1">
                              <StatusIcon className={`size-3 ${statusInfo.className}`} />
                              <span className={`text-xs ${statusInfo.className}`}>{statusInfo.label}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${record.type === "payment" ? "text-foreground" : "text-orange-600"}`}>
                            {record.type === "payment" ? "-" : "+"}{record.amount.toLocaleString()}원
                          </p>
                          <p className="text-xs text-foreground/60">
                            {format(new Date(record.paidAt), "M월 d일 HH:mm", { locale: ko })}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </RequireAuth>
  );
}
