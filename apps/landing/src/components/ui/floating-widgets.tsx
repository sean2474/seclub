"use client"

import { useState } from "react"
import { ChatbotWidget } from "./chatbot-widget"
import { SnsButtons, SNS_ITEM_GAP } from "./sns-buttons"
import type { SnsLink } from "@/lib/sns-links"

// SNS 토글이 bottom-20(80px)에 고정. 펼쳤을 때 챗봇 FAB/말풍선을 그 위로 올림.
const calcLiftPx = (links: SnsLink[], open: boolean) =>
  open ? links.length * SNS_ITEM_GAP + 80 : 60

export function FloatingWidgets({ links }: { links: SnsLink[] }) {
  const [snsOpen, setSnsOpen] = useState(false)

  return (
    <>
      <ChatbotWidget liftPx={calcLiftPx(links, snsOpen)} />
      <SnsButtons links={links} open={snsOpen} onOpenChange={setSnsOpen} />
    </>
  )
}
