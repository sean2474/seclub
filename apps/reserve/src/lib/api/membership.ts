import type { MembershipTier, MembershipInfo, PointHistory } from "@/types/membership";
import { TIER_INFO } from "@/types/membership";

// 목업 포인트 내역
const mockPointHistory: PointHistory[] = [
  {
    id: "pt-001",
    type: "earn",
    amount: 10890,
    balance: 15000,
    description: "해수풀빌라 예약 적립 (1%)",
    reservationId: "res-001",
    createdAt: "2026-03-14T10:30:00.000Z",
    expiresAt: "2027-03-14T23:59:59.000Z",
  },
  {
    id: "pt-002",
    type: "use",
    amount: -5000,
    balance: 4110,
    description: "예약 결제 시 포인트 사용",
    reservationId: "res-002",
    createdAt: "2026-02-28T14:00:00.000Z",
  },
  {
    id: "pt-003",
    type: "earn",
    amount: 1320,
    balance: 9110,
    description: "S사이트 예약 적립 (1%)",
    reservationId: "res-002",
    createdAt: "2026-02-28T14:00:00.000Z",
    expiresAt: "2027-02-28T23:59:59.000Z",
  },
  {
    id: "pt-004",
    type: "earn",
    amount: 3300,
    balance: 7790,
    description: "콘도 스탠다드 예약 적립 (1%)",
    reservationId: "res-003",
    createdAt: "2026-03-10T09:00:00.000Z",
    expiresAt: "2027-03-10T23:59:59.000Z",
  },
  {
    id: "pt-005",
    type: "expire",
    amount: -1000,
    balance: 4490,
    description: "포인트 유효기간 만료",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "pt-006",
    type: "earn",
    amount: 5000,
    balance: 5490,
    description: "신규 가입 축하 포인트",
    createdAt: "2025-12-15T10:00:00.000Z",
    expiresAt: "2026-06-15T23:59:59.000Z",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 멤버십 정보 조회
 */
export async function getMembershipInfo(userId: string): Promise<MembershipInfo> {
  await delay(300);
  
  const tier: MembershipTier = "GOLD";
  const points = 15000;
  const totalEarned = 25510;
  const totalUsed = 5000;
  
  // 다음 등급까지 필요 포인트 계산
  const tiers: MembershipTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
  const currentIndex = tiers.indexOf(tier);
  const nextTier = currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  const pointsToNextTier = nextTier ? TIER_INFO[nextTier].minPoints - totalEarned : 0;
  
  return {
    tier,
    points,
    pointsToNextTier: Math.max(0, pointsToNextTier),
    nextTier,
    totalEarnedPoints: totalEarned,
    totalUsedPoints: totalUsed,
    tierBenefits: TIER_INFO[tier].benefits,
    expiringPoints: 5000,
    expiringDate: "2026-06-15",
  };
}

/**
 * 포인트 내역 조회
 */
export async function getPointHistory(
  userId: string,
  options?: { limit?: number; type?: "earn" | "use" | "expire" }
): Promise<PointHistory[]> {
  await delay(200);
  
  let history = [...mockPointHistory];
  
  if (options?.type) {
    history = history.filter((h) => h.type === options.type);
  }
  
  history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  if (options?.limit) {
    history = history.slice(0, options.limit);
  }
  
  return history;
}

/**
 * 포인트 사용
 */
export async function usePoints(
  userId: string,
  amount: number,
  reservationId: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  await delay(300);
  
  const membershipInfo = await getMembershipInfo(userId);
  
  if (amount > membershipInfo.points) {
    return { success: false, error: "포인트가 부족합니다." };
  }
  
  // 실제로는 DB 업데이트
  return { success: true, newBalance: membershipInfo.points - amount };
}

/**
 * 등급 정보 조회
 */
export function getTierInfo(tier: MembershipTier) {
  return TIER_INFO[tier];
}
