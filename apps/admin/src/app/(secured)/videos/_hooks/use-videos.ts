"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "@seclub/ui/use-toast"
import {
  addVideo,
  deleteVideo,
  extractYouTubeId,
  fetchVideos,
  getLastVideoOrder,
  updateVideo,
  updateVideoOrder,
  Video,
} from "@/lib/client/video"

export interface VideoItem {
  id: string
  youtubeId: string
  title: string
  created_at: string
  order: number
}

function toItem(video: Video): VideoItem {
  return {
    id: video.id,
    youtubeId: video.link,
    title: video.title,
    created_at: video.created_at,
    order: video.order,
  }
}

export function useVideos() {
  const [items, setItems] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchVideos()
      .then(({ videos, error }) => {
        if (!active) return
        if (error) {
          toast({ title: "비디오 로드 실패", description: error.message, variant: "destructive" })
          return
        }
        setItems(videos.map(toItem).sort((a, b) => a.order - b.order))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const add = useCallback(async (title: string, url: string) => {
    const { order: lastOrder } = await getLastVideoOrder()
    const { video, error } = await addVideo({ title, link: url, order: lastOrder + 1 })
    if (error) {
      toast({ title: "영상 추가 실패", description: error.message, variant: "destructive" })
      return false
    }
    if (video) {
      setItems((prev) => [...prev, toItem(video)].sort((a, b) => a.order - b.order))
      toast({ title: "영상 추가 완료", description: "YouTube 영상이 목록에 추가되었습니다." })
    }
    return true
  }, [])

  const remove = useCallback(async (id: string) => {
    const { success, error } = await deleteVideo(id)
    if (error) {
      toast({ title: "삭제 실패", description: error.message, variant: "destructive" })
      return false
    }
    if (success) {
      setItems((prev) => prev.filter((item) => item.id !== id))
      toast({ title: "삭제 완료", description: "영상이 삭제되었습니다." })
    }
    return success
  }, [])

  const removeMany = useCallback(async (ids: string[]) => {
    const results = await Promise.all(ids.map((id) => deleteVideo(id)))
    if (results.some((r) => r.error)) {
      toast({
        title: "일부 삭제 실패",
        description: "일부 영상을 삭제하는 중 문제가 발생했습니다.",
        variant: "destructive",
      })
      return false
    }
    setItems((prev) => prev.filter((item) => !ids.includes(item.id)))
    toast({ title: "일괄 삭제 완료", description: `${ids.length}개 영상이 삭제되었습니다.` })
    return true
  }, [])

  const save = useCallback(async (id: string, title: string, url: string) => {
    const youtubeId = extractYouTubeId(url)
    const { video, error } = await updateVideo(id, { title, link: youtubeId || url })
    if (error) {
      toast({ title: "업데이트 실패", description: error.message, variant: "destructive" })
      return false
    }
    if (video) {
      setItems((prev) => prev.map((item) => (item.id === id ? toItem(video) : item)))
      toast({ title: "영상 업데이트 완료", description: "영상 정보가 성공적으로 업데이트되었습니다." })
    }
    return true
  }, [])

  const move = useCallback(
    async (id: string, direction: "up" | "down") => {
      const currentIndex = items.findIndex((item) => item.id === id)
      if (currentIndex === -1) return
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= items.length) return

      const next = [...items]
      const current = { ...next[currentIndex] }
      const target = { ...next[newIndex] }
      const tmp = current.order
      current.order = target.order
      target.order = tmp
      next[currentIndex] = target
      next[newIndex] = current
      setItems(next)

      const { error } = await updateVideoOrder([
        { id: current.id, order: current.order },
        { id: target.id, order: target.order },
      ])
      if (error) {
        toast({ title: "순서 변경 실패", description: error.message, variant: "destructive" })
        setItems(items)
      }
    },
    [items],
  )

  return { items, loading, add, remove, removeMany, save, move }
}
