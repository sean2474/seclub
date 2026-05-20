export type MembershipTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export interface MembershipInfo {
  tier: MembershipTier;
  points: number;
  pointsToNextTier: number;
  nextTier: MembershipTier | null;
  totalEarnedPoints: number;
  totalUsedPoints: number;
  tierBenefits: string[];
  expiringPoints: number;
  expiringDate: string | null;
}

export interface PointHistory {
  id: string;
  type: "earn" | "use" | "expire";
  amount: number;
  balance: number;
  description: string;
  reservationId?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface TierConfig {
  name: string;
  minPoints: number;
  discount: number;
  benefits: string[];
}

// 등급별 정보
export const TIER_INFO: Record<MembershipTier, TierConfig> = {
  BRONZE: {
    name: "브론즈",
    minPoints: 0,
    discount: 0,
    benefits: ["기본 멤버십 혜택", "생일 축하 쿠폰"],
  },
  SILVER: {
    name: "실버",
    minPoints: 10000,
    discount: 3,
    benefits: ["3% 추가 할인", "얼리체크인 우선 배정", "생일 축하 쿠폰"],
  },
  GOLD: {
    name: "골드",
    minPoints: 30000,
    discount: 5,
    benefits: ["5% 추가 할인", "얼리체크인/레이트체크아웃", "객실 업그레이드", "웰컴 기프트", "생일 축하 쿠폰"],
  },
  PLATINUM: {
    name: "플래티넘",
    minPoints: 100000,
    discount: 10,
    benefits: ["10% 추가 할인", "무료 얼리체크인/레이트체크아웃", "객실 업그레이드 우선 배정", "프리미엄 웰컴 기프트", "전용 컨시어지", "연간 무료 숙박 1회", "생일 축하 쿠폰"],
  },
};
