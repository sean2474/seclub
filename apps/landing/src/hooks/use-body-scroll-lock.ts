"use client"

import { useEffect } from "react"

/**
 * Lock the document body scroll while `locked` is true.
 * Restores the previous `overflow` value on unmount.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}
