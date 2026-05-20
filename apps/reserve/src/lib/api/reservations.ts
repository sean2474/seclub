import type { Reservation, ReservationStatus } from "@/types/reservation";

// 목업 데이터 - 실제로는 DB에서 가져옴
const mockReservations: Reservation[] = [
  {
    id: "res-001",
    bookingNumber: "SE260314-ABC1",
    status: "confirmed",
    accommodationType: "room",
    accommodationId: "ocean-pool-villa",
    accommodationName: "해수풀빌라",
    siteNumber: "101",
    checkIn: "2026-03-20T00:00:00.000Z",
    checkOut: "2026-03-22T00:00:00.000Z",
    nights: 2,
    adults: 4,
    children: 0,
    pets: 0,
    vehicleCount: 1,
    guestName: "박서준",
    guestEmail: "sean24740@gmail.com",
    guestPhone: "010-1234-5678",
    basePrice: 990000,
    extraFees: 0,
    totalAmount: 1089000,
    paidAmount: 1089000,
    refundedAmount: 0,
    paymentMethod: "카드",
    paymentKey: "test_payment_key_001",
    paidAt: "2026-03-14T10:30:00.000Z",
    arrivalTime: "15:00",
    createdAt: "2026-03-14T10:30:00.000Z",
    updatedAt: "2026-03-14T10:30:00.000Z",
  },
  {
    id: "res-002",
    bookingNumber: "SE260312-XYZ2",
    status: "completed",
    accommodationType: "site",
    accommodationId: "s-site",
    accommodationName: "S사이트 (잔디)",
    siteNumber: "S3",
    checkIn: "2026-03-01T00:00:00.000Z",
    checkOut: "2026-03-03T00:00:00.000Z",
    nights: 2,
    adults: 2,
    children: 2,
    pets: 1,
    vehicleCount: 1,
    guestName: "박서준",
    guestEmail: "sean24740@gmail.com",
    guestPhone: "010-1234-5678",
    basePrice: 100000,
    extraFees: 20000,
    totalAmount: 132000,
    paidAmount: 132000,
    refundedAmount: 0,
    paymentMethod: "카드",
    paidAt: "2026-02-28T14:00:00.000Z",
    createdAt: "2026-02-28T14:00:00.000Z",
    updatedAt: "2026-03-03T12:00:00.000Z",
  },
  {
    id: "res-003",
    bookingNumber: "SE260310-DEF3",
    status: "cancelled",
    accommodationType: "room",
    accommodationId: "condo-standard",
    accommodationName: "콘도 스탠다드",
    siteNumber: "201",
    checkIn: "2026-03-15T00:00:00.000Z",
    checkOut: "2026-03-17T00:00:00.000Z",
    nights: 2,
    adults: 2,
    children: 0,
    pets: 0,
    vehicleCount: 0,
    guestName: "박서준",
    guestEmail: "sean24740@gmail.com",
    guestPhone: "010-1234-5678",
    basePrice: 300000,
    extraFees: 0,
    totalAmount: 330000,
    paidAmount: 330000,
    refundedAmount: 330000,
    paymentMethod: "카드",
    paidAt: "2026-03-10T09:00:00.000Z",
    cancelledAt: "2026-03-11T15:30:00.000Z",
    refundedAt: "2026-03-12T10:00:00.000Z",
    createdAt: "2026-03-10T09:00:00.000Z",
    updatedAt: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "res-004",
    bookingNumber: "SE260315-GHI4",
    status: "refund_pending",
    accommodationType: "room",
    accommodationId: "camping-house",
    accommodationName: "캠핑하우스",
    siteNumber: "캠핑하우스2",
    checkIn: "2026-03-25T00:00:00.000Z",
    checkOut: "2026-03-27T00:00:00.000Z",
    nights: 2,
    adults: 4,
    children: 2,
    pets: 0,
    vehicleCount: 1,
    guestName: "박서준",
    guestEmail: "sean24740@gmail.com",
    guestPhone: "010-1234-5678",
    basePrice: 240000,
    extraFees: 40000,
    totalAmount: 308000,
    paidAmount: 308000,
    refundedAmount: 0,
    paymentMethod: "카드",
    paidAt: "2026-03-15T11:00:00.000Z",
    cancelledAt: "2026-03-18T14:00:00.000Z",
    createdAt: "2026-03-15T11:00:00.000Z",
    updatedAt: "2026-03-18T14:00:00.000Z",
  },
  {
    id: "res-005",
    bookingNumber: "SE260320-JKL5",
    status: "confirmed",
    accommodationType: "site",
    accommodationId: "m-site",
    accommodationName: "M사이트 (데크)",
    siteNumber: "M7",
    checkIn: "2026-04-01T00:00:00.000Z",
    checkOut: "2026-04-04T00:00:00.000Z",
    nights: 3,
    adults: 2,
    children: 1,
    pets: 0,
    vehicleCount: 1,
    guestName: "박서준",
    guestEmail: "sean24740@gmail.com",
    guestPhone: "010-1234-5678",
    basePrice: 210000,
    extraFees: 15000,
    totalAmount: 247500,
    paidAmount: 247500,
    refundedAmount: 0,
    paymentMethod: "카카오페이",
    paidAt: "2026-03-20T16:45:00.000Z",
    arrivalTime: "16:00",
    createdAt: "2026-03-20T16:45:00.000Z",
    updatedAt: "2026-03-20T16:45:00.000Z",
  },
];

// 네트워크 지연 시뮬레이션
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 사용자의 모든 예약 목록 조회
 */
export async function getMyReservations(userId: string): Promise<Reservation[]> {
  await delay(300);
  // 실제로는 userId로 필터링
  return mockReservations;
}

/**
 * 예약 상세 조회 (ID)
 */
export async function getReservationById(id: string): Promise<Reservation | null> {
  await delay(200);
  return mockReservations.find((r) => r.id === id) || null;
}

/**
 * 예약 상세 조회 (예약번호)
 */
export async function getReservationByBookingNumber(bookingNumber: string): Promise<Reservation | null> {
  await delay(200);
  return mockReservations.find((r) => r.bookingNumber === bookingNumber) || null;
}

/**
 * 비회원 예약 조회 (예약번호 + 이메일 or 전화번호)
 */
export async function lookupReservation(
  bookingNumber: string,
  identifier: string
): Promise<{ success: boolean; reservation?: Reservation; error?: string }> {
  await delay(500);
  
  const reservation = mockReservations.find((r) => r.bookingNumber === bookingNumber);
  
  if (!reservation) {
    return { success: false, error: "예약을 찾을 수 없습니다." };
  }
  
  // 이메일 또는 전화번호 확인
  const normalizedIdentifier = identifier.replace(/-/g, "");
  const normalizedPhone = reservation.guestPhone.replace(/-/g, "");
  
  if (
    reservation.guestEmail.toLowerCase() !== identifier.toLowerCase() &&
    normalizedPhone !== normalizedIdentifier
  ) {
    return { success: false, error: "예약 정보가 일치하지 않습니다." };
  }
  
  return { success: true, reservation };
}

/**
 * 예약 취소 요청
 */
export async function cancelReservation(
  reservationId: string,
  reason?: string
): Promise<{ success: boolean; refundAmount?: number; error?: string }> {
  await delay(500);
  
  const reservation = mockReservations.find((r) => r.id === reservationId);
  
  if (!reservation) {
    return { success: false, error: "예약을 찾을 수 없습니다." };
  }
  
  if (reservation.status !== "confirmed") {
    return { success: false, error: "취소할 수 없는 상태입니다." };
  }
  
  // 환불 금액 계산 (체크인까지 남은 일수에 따라)
  const checkInDate = new Date(reservation.checkIn);
  const today = new Date();
  const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  let refundRate = 0;
  if (daysUntilCheckIn > 7) {
    refundRate = 1.0; // 100% 환불
  } else if (daysUntilCheckIn > 3) {
    refundRate = 0.5; // 50% 환불
  } else {
    refundRate = 0; // 환불 불가
  }
  
  const refundAmount = Math.round(reservation.paidAmount * refundRate);
  
  // 실제로는 DB 업데이트
  reservation.status = refundRate > 0 ? "refund_pending" : "cancelled";
  reservation.cancelledAt = new Date().toISOString();
  reservation.updatedAt = new Date().toISOString();
  
  return { 
    success: true, 
    refundAmount,
  };
}

/**
 * 예약 상태별 개수 조회
 */
export async function getReservationCounts(userId: string): Promise<Record<ReservationStatus, number>> {
  await delay(100);
  
  const counts: Record<ReservationStatus, number> = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    refund_pending: 0,
    refunded: 0,
    completed: 0,
    no_show: 0,
  };
  
  mockReservations.forEach((r) => {
    counts[r.status]++;
  });
  
  return counts;
}

/**
 * 다가오는 예약 조회
 */
export async function getUpcomingReservations(userId: string, limit = 3): Promise<Reservation[]> {
  await delay(200);
  
  const today = new Date();
  return mockReservations
    .filter((r) => r.status === "confirmed" && new Date(r.checkIn) >= today)
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
    .slice(0, limit);
}

/**
 * 최근 예약 조회
 */
export async function getRecentReservations(userId: string, limit = 5): Promise<Reservation[]> {
  await delay(200);
  
  return mockReservations
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
