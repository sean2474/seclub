"use client"

import { useCallback } from "react"
import { toast } from "@seclub/ui/use-toast"
import { createPopup, deletePopup, getPopups, updatePopup, uploadPopupImage } from "@/lib/action/popup"
import type { Popup } from "@/types/popup"

type PopupFormData = {
  title: string
  content: string
  imageBase64: string | null
  imageContentType: string | null
  existingImageUrl: string | null
  link_url: string
  active: boolean
  priority: number
  start_date: string
  end_date: string
}

function toBaseFields(form: PopupFormData) {
  return {
    title: form.title,
    content: form.content || null,
    link_url: form.link_url || null,
    active: form.active,
    priority: form.priority,
    start_date: form.start_date || null,
    end_date: form.end_date || null,
  }
}

export function usePopupMutations(
  popups: Popup[],
  setPopups: React.Dispatch<React.SetStateAction<Popup[]>>,
) {
  const refresh = useCallback(async () => {
    const { data } = await getPopups()
    if (data) setPopups(data)
  }, [setPopups])

  const toggleActive = useCallback(
    async (popup: Popup) => {
      const newActive = !popup.active
      setPopups(popups.map((p) => (p.id === popup.id ? { ...p, active: newActive } : p)))

      const { success, error } = await updatePopup(popup.id, { active: newActive })
      if (success) {
        toast({
          title: newActive ? "팝업 활성화" : "팝업 비활성화",
          description: `"${popup.title}" 팝업이 ${newActive ? "활성화" : "비활성화"}되었습니다.`,
        })
      } else {
        setPopups(popups.map((p) => (p.id === popup.id ? { ...p, active: popup.active } : p)))
        toast({
          title: "상태 변경 실패",
          description: error || "상태 변경 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    },
    [popups, setPopups],
  )

  const save = useCallback(
    async (form: PopupFormData, existing: Popup | null) => {
      toast({
        title: "처리 중...",
        description: existing ? "팝업을 수정하는 중입니다." : "팝업을 등록하는 중입니다.",
      })
      const baseData = toBaseFields(form)

      try {
        if (existing) {
          let imageUrl: string | null = form.existingImageUrl
          if (form.imageBase64 && form.imageContentType) {
            const up = await uploadPopupImage(existing.id, form.imageBase64, form.imageContentType)
            if (!up.success) {
              toast({
                title: "이미지 업로드 실패",
                description: up.error || "이미지 업로드 중 오류가 발생했습니다.",
                variant: "destructive",
              })
              return
            }
            imageUrl = up.data
          }
          const { success, error } = await updatePopup(existing.id, { ...baseData, image_url: imageUrl })
          if (success) {
            await refresh()
            toast({ title: "수정 완료", description: "팝업이 성공적으로 수정되었습니다." })
          } else {
            toast({
              title: "수정 실패",
              description: error || "팝업 수정 중 오류가 발생했습니다.",
              variant: "destructive",
            })
          }
          return
        }

        // new popup
        const { success, data: created, error } = await createPopup({ ...baseData, image_url: null })
        if (!success || !created) {
          toast({
            title: "등록 실패",
            description: error || "팝업 등록 중 오류가 발생했습니다.",
            variant: "destructive",
          })
          return
        }
        if (form.imageBase64 && form.imageContentType) {
          const up = await uploadPopupImage(created.id, form.imageBase64, form.imageContentType)
          if (up.success && up.data) {
            await updatePopup(created.id, { image_url: up.data })
          } else {
            toast({
              title: "이미지 업로드 실패",
              description: up.error || "팝업은 등록됐지만 이미지 업로드에 실패했습니다.",
              variant: "destructive",
            })
          }
        }
        await refresh()
        toast({ title: "등록 완료", description: "새로운 팝업이 등록되었습니다." })
      } catch (err) {
        console.error("Popup save error:", err)
        toast({
          title: "오류 발생",
          description: "작업 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    },
    [refresh],
  )

  const remove = useCallback(
    async (id: string) => {
      toast({ title: "삭제 중...", description: "팝업을 삭제하는 중입니다." })
      try {
        const { success, error } = await deletePopup(id)
        if (success) {
          await refresh()
          toast({ title: "삭제 완료", description: "팝업이 삭제되었습니다." })
        } else {
          toast({
            title: "삭제 실패",
            description: error || "팝업 삭제 중 오류가 발생했습니다.",
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Popup deletion error:", err)
        toast({ title: "오류 발생", description: "삭제 중 오류가 발생했습니다.", variant: "destructive" })
      }
    },
    [refresh],
  )

  return { toggleActive, save, remove }
}
