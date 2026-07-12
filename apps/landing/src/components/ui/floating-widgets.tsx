"use client"

import { useState } from "react"
import { ChatbotWidget } from "./chatbot-widget"
import { SnsButtons, SNS_ITEM_GAP } from "./sns-buttons"
import type { SnsLink } from "@/lib/sns-links"

const calcLiftPx = (links: SnsLink[], open: boolean) =>
  open ? links.length * SNS_ITEM_GAP + 56 : 0

export function FloatingWidgets({ links }: { links: SnsLink[] }) {
  const [snsOpen, setSnsOpen] = useState(false)

  return (
    <>
      <ChatbotWidget liftPx={calcLiftPx(links, snsOpen)} />
      <SnsButtons links={links} open={snsOpen} onOpenChange={setSnsOpen} />
    </>
  )
}
