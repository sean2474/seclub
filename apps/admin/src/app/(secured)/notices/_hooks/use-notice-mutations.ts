"use client"

import { useCallback } from "react"
import { toast } from "@seclub/ui/use-toast"
import {
  createNotice,
  deleteNotice,
  getNotices,
  updateNotice,
} from "@/lib/action/notice"
import type { Notice } from "@/types/notices"

type NoticeFormData = {
  id: string
  title: string
  content: string
  active: boolean
  category: string
  pinned: boolean
}

export function useNoticeMutations(
  notices: Notice[],
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>,
) {
  const refresh = useCallback(async () => {
    const { data } = await getNotices()
    if (data) setNotices(data)
  }, [setNotices])

  const save = useCallback(
    async (form: NoticeFormData, existing: Notice | null) => {
      toast({
        title: "처리 중...",
        description: existing ? "공지사항을 수정하는 중입니다." : "공지사항을 등록하는 중입니다.",
      })
      try {
        const mutator = existing
          ? () => updateNotice(existing.id, form)
          : () => createNotice(form)
        const { success, error } = await mutator()
        if (success) {
          await refresh()
          toast({
            title: existing ? "✅ 수정 완료" : "✅ 작성 완료",
            description: existing
              ? "공지사항이 성공적으로 수정되었습니다."
              : "새로운 공지사항이 등록되었습니다.",
          })
          return true
        }
        toast({
          title: existing ? "❌ 수정 실패" : "❌ 등록 실패",
          description:
            error || `공지사항 ${existing ? "수정" : "등록"} 중 오류가 발생했습니다.`,
          variant: "destructive",
        })
        return false
      } catch (err) {
        console.error("Notice save error:", err)
        toast({
          title: "❌ 오류 발생",
          description: "작업 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        })
        return false
      }
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: string) => {
      toast({ title: "삭제 중...", description: "공지사항을 삭제하는 중입니다." })
      try {
        const { success, error } = await deleteNotice(id)
        if (success) {
          await refresh()
          toast({ title: "🗑️ 삭제 완료", description: "공지사항이 삭제되었습니다." })
          return true
        }
        toast({
          title: "❌ 삭제 실패",
          description: error || "공지사항 삭제 중 오류가 발생했습니다.",
          variant: "destructive",
        })
        return false
      } catch (err) {
        console.error("Notice deletion error:", err)
        toast({
          title: "❌ 오류 발생",
          description: "삭제 중 오류가 발생했습니다.",
          variant: "destructive",
        })
        return false
      }
    },
    [refresh],
  )

  const toggleStatus = useCallback(
    async (id: string, currentStatus: boolean) => {
      const newStatus = !currentStatus
      setNotices(notices.map((n) => (n.id === id ? { ...n, active: newStatus } : n)))
      const { success, error } = await updateNotice(id, { active: newStatus })
      if (!success) {
        setNotices(notices.map((n) => (n.id === id ? { ...n, active: currentStatus } : n)))
        toast({
          title: "❌ 상태 변경 실패",
          description: error || "상태를 변경하지 못했습니다.",
          variant: "destructive",
        })
        return
      }
      toast({
        title: "✅ 상태 변경",
        description: `공지가 ${newStatus ? "게시 중" : "비게시"} 상태로 변경되었습니다.`,
      })
    },
    [notices, setNotices],
  )

  return { save, remove, toggleStatus }
}
