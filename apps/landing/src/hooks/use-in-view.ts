"use client"

import { type RefObject, useEffect, useState } from "react"
import { ScrollObserverManager } from "@/utils/scroll-observer"

/**
 * Returns `true` after the referenced element first intersects the viewport.
 * Uses the shared ScrollObserverManager when available, falling back to a
 * dedicated IntersectionObserver. Stays `true` once triggered (one-shot).
 */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  options: IntersectionObserverInit = { rootMargin: "100px", threshold: 0 },
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onIntersect = () => setInView(true)

    try {
      const manager = ScrollObserverManager.getInstance()
      manager.observe(el, onIntersect, options)
      return () => manager.unobserve(el)
    } catch (err) {
      console.error("ScrollObserverManager unavailable, using direct observer:", err)
      const observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      }, options)
      observer.observe(el)
      return () => observer.disconnect()
    }
  }, [ref, options])

  return inView
}
