"use client"

import { useEffect } from "react"
import { createClient } from "@seclub/supabase/client"

export const NoticeViewCounter = ({ noticeId }: { noticeId: string }) => {
  useEffect(() => {
    const viewedKey = `viewed_notice_${noticeId}`
    if (sessionStorage.getItem(viewedKey)) return

    const supabase = createClient()
    supabase
      .rpc("increment_notice_view_count", { p_notice_id: noticeId })
      .then(({ error }) => error && console.error(error))
    sessionStorage.setItem(viewedKey, "1")
  }, [noticeId])

  return <div className="hidden" />
}