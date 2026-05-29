"use client"

import { useState } from "react"
// 챗봇은 iframe cross-site 쿠키(SameSite=lax) 문제로 세션이 안 잡혀 무한 로딩.
// vendor(off2on) 가 same-site 서브도메인 서빙 또는 SameSite=None;Partitioned 적용해
// "작동 확인"될 때까지 비활성화. 재활성화 시 ChatbotWidget 을 다시 렌더하고,
// SNS 위로 띄우는 liftPx 로직은 이 파일 git 히스토리 참고.
// import { ChatbotWidget } from "./chatbot-widget"
import { SnsButtons } from "./sns-buttons"
import type { SnsLink } from "@/lib/sns-links"

// 우측 하단 코너 플로팅 위젯. 현재는 SNS 버튼만 노출 (챗봇 비활성).
export function FloatingWidgets({ links }: { links: SnsLink[] }) {
  const [snsOpen, setSnsOpen] = useState(false)

  return (
    <>
      {/* <ChatbotWidget liftPx={...} />  // 챗봇 작동 확인 후 재활성화 */}
      <SnsButtons links={links} open={snsOpen} onOpenChange={setSnsOpen} />
    </>
  )
}
