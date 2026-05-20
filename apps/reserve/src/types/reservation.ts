import type { AccommodationType } from "./index";

export type ReservationStatus = 
  | "confirmed"    // 예약 확정
  | "pending"      // 결제 대기
  | "cancelled"    // 취소됨
  | "completed"    // 이용 완료
  | "refund_pending" // 환불 진행 중
  | "refunded";    // 환불 완료

export type Reservation = {
  id: string;
  bookingNumber: string;
  status: ReservationStatus;
  
  // 숙박 정보
  accommodationType: AccommodationType;
  accommodationId: string;
  accommodationName: string;
  siteNumber: string;
  
  // 일정
  checkIn: string; // ISO date string
  checkOut: string;
  nights: number;
  
  // 인원
  adults: number;
  children: number;
  pets: number;
  vehicleCount: number;
  
  // 예약자 정보
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  
  // 금액
  basePrice: number;
  extraFees: number;
  totalAmount: number;
  paidAmount: number;
  refundedAmount: number;
  
  // 결제 정보
  paymentMethod: string;
  paymentKey?: string;
  paidAt?: string;
  
  // 요청사항
  specialRequests?: string;
  arrivalTime?: string;
  
  // 타임스탬프
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  refundedAt?: string;
};

export type RefundPolicy = {
  daysBeforeCheckIn: number;
  refundRate: number; // 0-100
  description: string;
};

export const REFUND_POLICIES: RefundPolicy[] = [
  { daysBeforeCheckIn: 7, refundRate: 100, description: "체크인 7일 전: 전액 환불" },
  { daysBeforeCheckIn: 5, refundRate: 70, description: "체크인 5~6일 전: 70% 환불" },
  { daysBeforeCheckIn: 3, refundRate: 50, description: "체크인 3~4일 전: 50% 환불" },
  { daysBeforeCheckIn: 1, refundRate: 30, description: "체크인 1~2일 전: 30% 환불" },
  { daysBeforeCheckIn: 0, refundRate: 0, description: "당일 취소: 환불 불가" },
];

export function getRefundRate(checkInDate: Date): number {
  const now = new Date();
  const diffTime = checkInDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  for (const policy of REFUND_POLICIES) {
    if (diffDays >= policy.daysBeforeCheckIn) {
      return policy.refundRate;
    }
  }
  return 0;
}

export function getStatusLabel(status: ReservationStatus): string {
  const labels: Record<ReservationStatus, string> = {
    confirmed: "예약 확정",
    pending: "결제 대기",
    cancelled: "취소됨",
    completed: "이용 완료",
    refund_pending: "환불 진행 중",
    refunded: "환불 완료",
  };
  return labels[status];
}

export function getStatusColor(status: ReservationStatus): string {
  const colors: Record<ReservationStatus, string> = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-gray-100 text-gray-800",
    refund_pending: "bg-orange-100 text-orange-800",
    refunded: "bg-gray-100 text-gray-600",
  };
  return colors[status];
}
