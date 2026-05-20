import { redirect } from "next/navigation";
import { getRoomById } from "@/lib/room-data";
import { getSiteById } from "@/lib/site-data";
import { TAX_RATE, calculateNights } from "@/lib/booking-store";
import type { AccommodationType } from "@/types";

interface SuccessPageProps {
  searchParams: Promise<{
    paymentType?: string;
    orderId?: string | string[]; // URL에서 중복되면 배열로 올 수 있음
    paymentKey?: string;
    amount?: string;
    bookingNumber?: string;
    type?: AccommodationType;
    id?: string;
    checkIn?: string;
    checkOut?: string;
    adults?: string;
    children?: string;
    pets?: string;
    siteNumber?: string;
    vehicleCount?: string;
    total?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }>;
}

// 서버에서 금액 재계산 (보안)
function calculateServerAmount(
  type: AccommodationType,
  id: string,
  checkIn: string,
  checkOut: string,
  adults: number,
  children: number,
  pets: number
): number | null {
  const accommodation = type === "site" ? getSiteById(id) : getRoomById(id);
  if (!accommodation) return null;

  const nights = calculateNights(new Date(checkIn), new Date(checkOut));
  if (nights <= 0) return null;

  const basePrice = accommodation.price * nights;
  const extraGuests = Math.max(0, adults + children - accommodation.baseGuests);
  const extraGuestFee = (accommodation.extraPersonFee ?? 0) * extraGuests * nights;
  const petFee = (accommodation.petFee ?? 0) * pets * nights;

  const subtotal = basePrice + extraGuestFee + petFee;
  const taxes = Math.round(subtotal * TAX_RATE);
  return subtotal + taxes;
}

export default async function PaymentSuccessPage({ searchParams }: SuccessPageProps) {
  const query = await searchParams;
  
  // orderId가 배열로 올 수 있으므로 첫 번째 값만 사용
  const paymentKey = query.paymentKey;
  const rawOrderId = query.orderId;
  const orderId = Array.isArray(rawOrderId) ? rawOrderId[0] : rawOrderId;
  const amount = query.amount;
  const bookingNumber = query.bookingNumber;

  if (!paymentKey || !orderId || !amount) {
    redirect("/reserve?error=invalid_payment");
  }

  // 서버에서 금액 재계산하여 검증
  const serverAmount = calculateServerAmount(
    query.type || "room",
    query.id || "",
    query.checkIn || "",
    query.checkOut || "",
    parseInt(query.adults || "2", 10),
    parseInt(query.children || "0", 10),
    parseInt(query.pets || "0", 10)
  );

  const clientAmount = parseInt(amount, 10);

  // 금액 검증 - serverAmount가 null이면 클라이언트 금액 사용 (테스트 환경)
  const finalAmount = serverAmount !== null ? serverAmount : clientAmount;

  // 결제 승인 API 호출
  // 테스트 환경: 결제위젯 전용 테스트 시크릿 키 사용 (클라이언트 키와 쌍으로 매칭)
  // 프로덕션: TOSS_SECRET_KEY 환경 변수 사용
  const isTestMode = !process.env.TOSS_SECRET_KEY || process.env.TOSS_SECRET_KEY.startsWith("test_");
  const secretKey = isTestMode 
    ? "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6"  // 결제위젯 전용 테스트 시크릿 키
    : process.env.TOSS_SECRET_KEY;
  const basicToken = Buffer.from(`${secretKey}:`).toString("base64");

  let redirectUrl = "";
  let shouldRedirectToFail = false;
  let failParams = "";

  const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount: finalAmount,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    shouldRedirectToFail = true;
    failParams = `code=${errorData.code}&message=${encodeURIComponent(errorData.message)}&orderId=${orderId}`;
  } else {
    const paymentData = await response.json();

    // 결제 성공 - complete 페이지로 리다이렉트
    const params = new URLSearchParams();
    params.set("type", query.type || "room");
    params.set("id", query.id || "");
    params.set("checkIn", query.checkIn || "");
    params.set("checkOut", query.checkOut || "");
    params.set("adults", query.adults || "2");
    params.set("children", query.children || "0");
    params.set("pets", query.pets || "0");
    params.set("siteNumber", query.siteNumber || "");
    params.set("vehicleCount", query.vehicleCount || "0");
    params.set("total", amount);
    params.set("firstName", query.firstName || "");
    params.set("lastName", query.lastName || "");
    params.set("email", query.email || "");
    params.set("phone", query.phone || "");
    params.set("bookingNumber", bookingNumber || orderId);
    params.set("paymentMethod", paymentData.method || "card");
    params.set("paidAt", paymentData.approvedAt || new Date().toISOString());
    params.set("paymentKey", paymentKey);

    redirectUrl = `/reserve/complete/${bookingNumber || orderId}?${params.toString()}`;
  }

  if (shouldRedirectToFail) {
    redirect(`/reserve/payment/fail?${failParams}`);
  }

  redirect(redirectUrl);
}
