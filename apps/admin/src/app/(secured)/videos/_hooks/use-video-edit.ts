"use client"

import { useState } from "react"
import { extractYouTubeId } from "@/lib/client/video"
import type { VideoItem } from "./use-videos"

export function useVideoEdit(save: (id: string, title: string, url: string) => Promise<boolean>) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)

  const start = (item: VideoItem) => {
    setEditingId(item.id)
    setTitle(item.title)
    setUrl(
      item.youtubeId.startsWith("http")
        ? item.youtubeId
        : `https://www.youtube.com/watch?v=${item.youtubeId}`,
    )
    setError(null)
  }

  const cancel = () => {
    setEditingId(null)
    setTitle("")
    setUrl("")
    setError(null)
  }

  const commit = async () => {
    if (!editingId) return
    if (!title.trim()) {
      setError("제목을 입력해주세요.")
      return
    }
    if (!url.trim() && !extractYouTubeId(url)) {
      setError("유효한 YouTube URL을 입력하거나 직접 영상 ID를 입력해주세요.")
      return
    }
    const ok = await save(editingId, title, url)
    if (ok) cancel()
  }

  return {
    editingId,
    title,
    url,
    error,
    setTitle: (value: string) => setTitle(value),
    setUrl: (value: string) => {
      setUrl(value)
      if (error) setError(null)
    },
    start,
    cancel,
    commit,
  }
}
