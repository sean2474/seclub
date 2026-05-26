"use client"

import { useEffect, useRef, useState } from "react"

interface UseSliderOptions {
  count: number
  autoPlay?: boolean
  autoPlayInterval?: number
  /** Minimum horizontal swipe distance (px) to trigger prev/next. */
  swipeThreshold?: number
}

/**
 * Shared slider state for image/content carousels. Handles index, prev/next,
 * swipe gestures, and optional auto-advance. Safely no-ops when `count <= 0`.
 */
export function useSlider({
  count,
  autoPlay = false,
  autoPlayInterval = 5000,
  swipeThreshold = 50,
}: UseSliderOptions) {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number | null>(null)

  const safeCount = Math.max(0, count)

  // Clamp index when slide count changes
  useEffect(() => {
    if (safeCount === 0 && current !== 0) setCurrent(0)
    else if (current >= safeCount && safeCount > 0) setCurrent(0)
  }, [safeCount, current])

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!isPlaying || safeCount <= 1) return
    timeoutRef.current = setTimeout(
      () => setCurrent((prev) => (prev + 1) % safeCount),
      autoPlayInterval,
    )
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [current, isPlaying, autoPlayInterval, safeCount])

  const prev = () => {
    if (safeCount === 0) return
    setCurrent((p) => (p - 1 + safeCount) % safeCount)
  }
  const next = () => {
    if (safeCount === 0) return
    setCurrent((p) => (p + 1) % safeCount)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0]?.clientX ?? touchStartX.current
    const diff = touchStartX.current - touchEndX
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) next()
      else prev()
    }
    touchStartX.current = null
  }

  return {
    current,
    setCurrent,
    isPlaying,
    setIsPlaying,
    togglePlaying: () => setIsPlaying((v) => !v),
    prev,
    next,
    onTouchStart,
    onTouchEnd,
  }
}
