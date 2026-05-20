// 예약 진행 상황 타입
export interface BookingProgress {
  accommodationType: "room" | "site";
  accommodationId: string;
  selectedNumber: string;
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
  pets: number;
  vehicleCount: number;
  updatedAt: number;
}

const COOKIE_NAME = "seclub_booking_progress";
const COOKIE_EXPIRY_DAYS = 7;

// 쿠키 설정
export function setBookingProgress(progress: BookingProgress): void {
  if (typeof document === "undefined") return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  
  const value = encodeURIComponent(JSON.stringify(progress));
  document.cookie = `${COOKIE_NAME}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// 쿠키 읽기
export function getBookingProgress(): BookingProgress | null {
  if (typeof document === "undefined") return null;
  
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === COOKIE_NAME && value) {
      try {
        return JSON.parse(decodeURIComponent(value)) as BookingProgress;
      } catch {
        return null;
      }
    }
  }
  return null;
}

// 쿠키 삭제
export function clearBookingProgress(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}
