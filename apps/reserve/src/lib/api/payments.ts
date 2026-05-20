import type { Payment, PaymentStats } from "@/types/payment";

// 목업 데이터
const mockPayments: Payment[] = [
  {
    id: "pay-001",
    reservationId: "res-001",
    bookingNumber: "SE260314-ABC1",
    accommodationName: "해수풀빌라 101호",
    type: "payment",
    amount: 1089000,
    method: "카드",
    status: "completed",
    paidAt: "2026-03-14T10:30:00.000Z",
    cardInfo: {
      issuer: "삼성카드",
      number: "****-****-****-1234",
    },
  },
  {
    id: "pay-002",
    reservationId: "res-002",
    bookingNumber: "SE260312-XYZ2",
    accommodationName: "S사이트 (잔디) S3번",
    type: "payment",
    amount: 132000,
    method: "카드",
    status: "completed",
    paidAt: "2026-02-28T14:00:00.000Z",
    cardInfo: {
      issuer: "신한카드",
      number: "****-****-****-5678",
    },
  },
  {
    id: "pay-003",
    reservationId: "res-003",
    bookingNumber: "SE260310-DEF3",
    accommodationName: "콘도 스탠다드 201호",
    type: "payment",
    amount: 330000,
    method: "카드",
    status: "completed",
    paidAt: "2026-03-10T09:00:00.000Z",
    cardInfo: {
      issuer: "현대카드",
      number: "****-****-****-9012",
    },
  },
  {
    id: "pay-004",
    reservationId: "res-003",
    bookingNumber: "SE260310-DEF3",
    accommodationName: "콘도 스탠다드 201호",
    type: "refund",
    amount: 330000,
    method: "카드",
    status: "completed",
    paidAt: "2026-03-10T09:00:00.000Z",
    refundedAt: "2026-03-12T10:00:00.000Z",
    cardInfo: {
      issuer: "현대카드",
      number: "****-****-****-9012",
    },
  },
  {
    id: "pay-005",
    reservationId: "res-004",
    bookingNumber: "SE260315-GHI4",
    accommodationName: "캠핑하우스 2호",
    type: "payment",
    amount: 308000,
    method: "카드",
    status: "completed",
    paidAt: "2026-03-15T11:00:00.000Z",
    cardInfo: {
      issuer: "KB국민카드",
      number: "****-****-****-3456",
    },
  },
  {
    id: "pay-006",
    reservationId: "res-004",
    bookingNumber: "SE260315-GHI4",
    accommodationName: "캠핑하우스 2호",
    type: "refund",
    amount: 154000,
    method: "카드",
    status: "pending",
    paidAt: "2026-03-15T11:00:00.000Z",
    cardInfo: {
      issuer: "KB국민카드",
      number: "****-****-****-3456",
    },
  },
  {
    id: "pay-007",
    reservationId: "res-005",
    bookingNumber: "SE260320-JKL5",
    accommodationName: "M사이트 (데크) M7번",
    type: "payment",
    amount: 247500,
    method: "카카오페이",
    status: "completed",
    paidAt: "2026-03-20T16:45:00.000Z",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 사용자의 결제/환불 내역 조회
 */
export async function getMyPayments(userId: string): Promise<Payment[]> {
  await delay(300);
  return mockPayments;
}

/**
 * 결제 상세 조회
 */
export async function getPaymentById(id: string): Promise<Payment | null> {
  await delay(200);
  return mockPayments.find((p) => p.id === id) || null;
}

/**
 * 예약별 결제 내역 조회
 */
export async function getPaymentsByReservationId(reservationId: string): Promise<Payment[]> {
  await delay(200);
  return mockPayments.filter((p) => p.reservationId === reservationId);
}

/**
 * 결제 통계
 */
export async function getPaymentStats(userId: string): Promise<PaymentStats> {
  await delay(100);
  
  const payments = mockPayments.filter((p) => p.type === "payment" && p.status === "completed");
  const refunds = mockPayments.filter((p) => p.type === "refund" && p.status === "completed");
  const pendingRefunds = mockPayments.filter((p) => p.type === "refund" && p.status === "pending");
  
  return {
    totalPaid: payments.reduce((sum, p) => sum + p.amount, 0),
    totalRefunded: refunds.reduce((sum, p) => sum + p.amount, 0),
    pendingRefund: pendingRefunds.reduce((sum, p) => sum + p.amount, 0),
  };
}
