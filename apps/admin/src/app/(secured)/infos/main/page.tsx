"use client"

import { Suspense } from "react"
import { HeroTextSection } from "./hero-text-section"
import { NoticesBadgeSection } from "./notices-badge-section"
import { PopupSection } from "./popup-section"

export default function MainPageManagement() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold">메인페이지 관리</h1>
      <Suspense fallback={<div>로딩 중...</div>}>
        <HeroTextSection />
      </Suspense>
      <Suspense fallback={<div>로딩 중...</div>}>
        <NoticesBadgeSection />
      </Suspense>
      <Suspense fallback={<div>로딩 중...</div>}>
        <PopupSection />
      </Suspense>
    </div>
  )
}
