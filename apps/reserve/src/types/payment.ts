export interface Payment {
  id: string;
  reservationId: string;
  bookingNumber: string;
  accommodationName: string;
  type: "payment" | "refund";
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed" | "cancelled";
  paidAt: string;
  refundedAt?: string;
  cardInfo?: {
    issuer: string;
    number: string; // 마스킹된 번호
  };
}

export interface PaymentStats {
  totalPaid: number;
  totalRefunded: number;
  pendingRefund: number;
}
