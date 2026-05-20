"use client"

import { useEffect, useRef, useState } from "react"
import { extractYouTubeId } from "@/lib/client/video"

const DEBOUNCE_MS = 350

/**
 * Debounced YouTube URL validator. Extracts the video ID from the URL, then
 * calls oEmbed to confirm the video exists. Cancels in-flight requests with
 * AbortController when the URL changes again before the previous check
 * resolves, preventing race conditions on stale input.
 */
export function useYouTubePreview(url: string) {
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const trimmed = url.trim()
    if (!trimmed) {
      setPreviewVideoId(null)
      setChecking(false)
      setError(null)
      return
    }

    const videoId = extractYouTubeId(trimmed)
    if (!videoId) {
      setPreviewVideoId(null)
      setChecking(false)
      setError(null)
      return
    }

    setChecking(true)
    setError(null)
    setPreviewVideoId(null)

    const handle = setTimeout(() => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { signal: controller.signal },
      )
        .then((res) => {
          if (controller.signal.aborted) return
          if (res.status === 200) {
            setPreviewVideoId(videoId)
            setError(null)
          } else {
            setPreviewVideoId(null)
            setError("존재하지 않는 YouTube 영상입니다.")
          }
          setChecking(false)
        })
        .catch((err) => {
          if ((err as { name?: string }).name === "AbortError") return
          setPreviewVideoId(null)
          setChecking(false)
        })
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(handle)
      abortRef.current?.abort()
    }
  }, [url])

  return { previewVideoId, checking, error, clearError: () => setError(null) }
}
