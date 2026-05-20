"use client";

import { TossPaymentWidget } from "./toss-payment-widget";

interface PaymentMethodsProps {
  draftId: string;
  searchParams: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderName: string;
}

export function PaymentMethods({
  draftId,
  searchParams,
  totalAmount,
  customerName,
  customerEmail,
  customerPhone,
  orderName,
}: PaymentMethodsProps) {
  return (
    <TossPaymentWidget
      draftId={draftId}
      searchParams={searchParams}
      totalAmount={totalAmount}
      customerName={customerName}
      customerEmail={customerEmail}
      customerPhone={customerPhone}
      orderName={orderName}
    />
  );
}
