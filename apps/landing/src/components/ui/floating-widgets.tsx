"use client"

import { useState } from "react"
import { ChatbotWidget } from "./chatbot-widget"
import { SnsButtons, SNS_ITEM_GAP } from "./sns-buttons"
import type { SnsLink } from "@/lib/sns-links"

// SNS 토글이 bottom-20(80px)에 고정. 펼쳤을 때 챗봇 FAB/말풍선을 그 위로 올림.
// 챗봇 FAB: bottom-20(80px) 고정. SNS 토글: bottom-5(20px).
// SNS 열림 시 최상단 아이템 = 20 + n*58 + 44(h-11) px. 챗봇이 그 위에 있으려면:
// 80 + liftPx > 20 + n*58 + 44  →  liftPx = n*SNS_ITEM_GAP (≈ 16px 여유)
const calcLiftPx = (links: SnsLink[], open: boolean) =>
  open ? links.length * SNS_ITEM_GAP : 0

export function FloatingWidgets({ links }: { links: SnsLink[] }) {
  const [snsOpen, setSnsOpen] = useState(false)

  return (
    <>
      <ChatbotWidget liftPx={calcLiftPx(links, snsOpen)} />
      <SnsButtons links={links} open={snsOpen} onOpenChange={setSnsOpen} />
    </>
  )
}
