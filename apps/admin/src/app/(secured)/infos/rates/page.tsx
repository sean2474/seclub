"use client"

import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@seclub/ui/tabs"
import { RoomRatesSection } from "./room-rates-section"
import { LateCheckoutSection } from "./late-checkout-section"
import { DiscountSection } from "./discount-section"
import { RoomInfoSection } from "./room-info-section"

export default function RatesManagement() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">객실/요금 관리</h1>
      <Tabs defaultValue="rates">
        <TabsList>
          <TabsTrigger value="rates">숙박/캠핑 요금</TabsTrigger>
          <TabsTrigger value="late-checkout">레이트체크아웃</TabsTrigger>
          <TabsTrigger value="discounts">할인율</TabsTrigger>
          <TabsTrigger value="rooms">객실 정보</TabsTrigger>
        </TabsList>
        <TabsContent value="rates" className="mt-4">
          <Suspense fallback={<div>로딩 중...</div>}>
            <RoomRatesSection />
          </Suspense>
        </TabsContent>
        <TabsContent value="late-checkout" className="mt-4">
          <Suspense fallback={<div>로딩 중...</div>}>
            <LateCheckoutSection />
          </Suspense>
        </TabsContent>
        <TabsContent value="discounts" className="mt-4">
          <Suspense fallback={<div>로딩 중...</div>}>
            <DiscountSection />
          </Suspense>
        </TabsContent>
        <TabsContent value="rooms" className="mt-4">
          <Suspense fallback={<div>로딩 중...</div>}>
            <RoomInfoSection />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
