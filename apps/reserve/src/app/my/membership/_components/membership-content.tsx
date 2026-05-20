"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Award, Star, Gift, TrendingUp, ChevronRight, Clock, Loader2 } from "lucide-react";
import { RequireAuth } from "../../_components/require-auth";
import { useAuth } from "@/lib/mock-auth";
import { getMembershipInfo, getPointHistory } from "@/lib/api";
import { TIER_INFO, type MembershipInfo, type PointHistory } from "@/types";

const tierColors: Record<string, string> = {
  BRONZE: "bg-amber-100 text-amber-800",
  SILVER: "bg-gray-200 text-gray-800",
  GOLD: "bg-yellow-100 text-yellow-800",
  PLATINUM: "bg-purple-100 text-purple-800",
};

const tierKorean: Record<string, string> = {
  BRONZE: "브론즈",
  SILVER: "실버",
  GOLD: "골드",
  PLATINUM: "플래티넘",
};

export function MembershipContent() {
  const { user } = useAuth();
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        getMembershipInfo(user.id),
        getPointHistory(user.id, { limit: 5 }),
      ])
        .then(([membershipData, historyData]) => {
          setMembership(membershipData);
          setPointHistory(historyData);
        })
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  if (isLoading) {
    return (
      <RequireAuth title="멤버십/포인트">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-8 animate-spin text-foreground/30" />
        </div>
      </RequireAuth>
    );
  }

  if (!membership) {
    return (
      <RequireAuth title="멤버십/포인트">
        <div className="rounded-lg border border-foreground/10 bg-white p-8 text-center">
          <p className="text-foreground/60">멤버십 정보를 불러올 수 없습니다.</p>
        </div>
      </RequireAuth>
    );
  }

  const currentTierInfo = TIER_INFO[membership.tier];
  const nextTierInfo = membership.nextTier ? TIER_INFO[membership.nextTier] : null;
  const progress = nextTierInfo
    ? Math.min(100, ((membership.totalEarnedPoints - currentTierInfo.minPoints) / (nextTierInfo.minPoints - currentTierInfo.minPoints)) * 100)
    : 100;

  return (
    <RequireAuth title="멤버십/포인트">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">멤버십/포인트</h1>
          <p className="mt-2 text-foreground/60">
            멤버십 등급과 포인트를 확인하세요.
          </p>
        </div>

        {/* Membership Card */}
        <div className="overflow-hidden rounded-lg border border-foreground/10 bg-gradient-to-br from-foreground to-foreground/80">
          <div className="p-6 text-background">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-background/60">멤버십 등급</p>
                <p className="mt-1 text-2xl font-bold">{tierKorean[membership.tier]}</p>
              </div>
              <Award className="size-10 text-background/20" />
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-background/60">보유 포인트</p>
              <p className="text-3xl font-bold">{membership.points.toLocaleString()}P</p>
            </div>

            {nextTierInfo && (
              <div className="mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-background/60">{tierKorean[membership.nextTier!]}까지</span>
                  <span className="text-background/80">{membership.pointsToNextTier.toLocaleString()}P</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-background/20">
                  <div
                    className="h-full rounded-full bg-background transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expiring Points Warning */}
        {membership.expiringPoints > 0 && membership.expiringDate && (
          <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <Clock className="size-5 shrink-0 text-orange-600" />
            <div>
              <p className="font-medium text-orange-800">
                {membership.expiringPoints.toLocaleString()}P가 {membership.expiringDate}에 소멸 예정입니다.
              </p>
              <p className="text-sm text-orange-700">포인트 사용을 권장드립니다.</p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-foreground/10 bg-white p-4">
            <div className="flex items-center gap-2 text-foreground/60">
              <TrendingUp className="size-4" />
              <span className="text-sm">총 적립</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-foreground">
              {membership.totalEarnedPoints.toLocaleString()}P
            </p>
          </div>
          
          <div className="rounded-lg border border-foreground/10 bg-white p-4">
            <div className="flex items-center gap-2 text-foreground/60">
              <Gift className="size-4" />
              <span className="text-sm">총 사용</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-foreground">
              {membership.totalUsedPoints.toLocaleString()}P
            </p>
          </div>
          
          <div className="rounded-lg border border-foreground/10 bg-white p-4">
            <div className="flex items-center gap-2 text-foreground/60">
              <Star className="size-4" />
              <span className="text-sm">적립률</span>
            </div>
            <p className="mt-2 text-xl font-semibold text-foreground">
              {currentTierInfo.discount > 0 ? `${currentTierInfo.discount}% 할인` : "1% 적립"}
            </p>
          </div>
        </div>

        {/* Benefits */}
        <section className="rounded-lg border border-foreground/10 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Star className="size-5" />
            {tierKorean[membership.tier]} 혜택
          </h2>
          <ul className="mt-4 space-y-2">
            {membership.tierBenefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-foreground/80">
                <div className="size-1.5 rounded-full bg-primary" />
                {benefit}
              </li>
            ))}
          </ul>
        </section>

        {/* Membership Tiers */}
        <section>
          <h2 className="mb-4 text-lg font-medium text-foreground">등급 안내</h2>
          <div className="space-y-3">
            {(Object.keys(TIER_INFO) as Array<keyof typeof TIER_INFO>).map((tierKey) => {
              const tier = TIER_INFO[tierKey];
              return (
                <div
                  key={tierKey}
                  className={`rounded-lg border p-4 ${
                    tierKey === membership.tier 
                      ? "border-primary bg-primary/5" 
                      : "border-foreground/10 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tierColors[tierKey]}`}>
                        {tierKorean[tierKey]}
                      </span>
                      {tierKey === membership.tier && (
                        <span className="text-xs text-primary">현재 등급</span>
                      )}
                    </div>
                    <span className="text-sm text-foreground/60">
                      {tier.minPoints.toLocaleString()}P 이상
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/70">
                    {tier.benefits.join(" · ")}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Point History */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-foreground">포인트 내역</h2>
            <Link
              href="/my/membership/history"
              className="flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
            >
              전체보기
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-2">
            {pointHistory.length === 0 ? (
              <div className="rounded-lg border border-foreground/10 bg-white p-4 text-center">
                <p className="text-foreground/60">포인트 내역이 없습니다.</p>
              </div>
            ) : (
              pointHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-foreground/10 bg-white p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.description}</p>
                    <p className="text-xs text-foreground/60">
                      {new Date(item.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <span className={`font-medium ${
                    item.type === "earn" ? "text-green-600" : 
                    item.type === "expire" ? "text-gray-500" : "text-red-600"
                  }`}>
                    {item.amount > 0 ? "+" : ""}{item.amount.toLocaleString()}P
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </RequireAuth>
  );
}
