// 예약 데이터 타입 정의
export interface BookingDraft {
  id: string;
  roomId: string;
  checkIn: Date | null;
  checkOut: Date | null;
  adults: number;
  children: number;
  pets: number;
  siteNumber: string;
  vehicleCount: number;
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    arrivalTime: string;
    specialRequests: string;
  };
  agreements?: {
    cancellationPolicy: boolean;
    terms: boolean;
  };
  paymentMethod?: string;
  totalAmount?: number;
}

export interface CompletedBooking extends BookingDraft {
  bookingNumber: string;
  paidAt: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// 세금/수수료 비율
export const TAX_RATE = 0.1;

// 유틸리티 함수
export function generateDraftId(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function generateBookingNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SE${year}${month}${day}-${random}`;
}

export function calculateNights(checkIn: Date | null, checkOut: Date | null): number {
  if (!checkIn || !checkOut) return 0;
  const diffTime = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
