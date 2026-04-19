"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import type { GalleryRebornItem } from "@/types/gallery-reborn"

interface LightboxProps {
  item: GalleryRebornItem
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function Lightbox({ item, index, total, onClose, onPrev, onNext }: LightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") onNext()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "Tab") {
        // Focus trap: Tab 키가 다이얼로그 밖으로 빠져나가지 않도록
        const focusables = document.querySelectorAll<HTMLElement>(
          '[data-lightbox-focus="true"]'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeBtnRef.current?.focus()
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose, onNext, onPrev])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title ?? `작품 ${index + 1}`} 확대 보기`}
    >
      <div className="pointer-events-none relative flex h-full w-full flex-col items-center justify-center p-6 md:p-14">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          aria-label="닫기"
          ref={closeBtnRef}
          data-lightbox-focus="true"
          className="pointer-events-auto absolute top-5 right-5 md:top-8 md:right-8 font-mono text-xs tracking-[0.25em] text-white/70 hover:text-white transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/80 focus-visible:outline-offset-4"
        >
          CLOSE
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          aria-label="이전 작품"
          data-lightbox-focus="true"
          className="pointer-events-auto absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-4 text-white/40 hover:text-white transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/80"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label="다음 작품"
          data-lightbox-focus="true"
          className="pointer-events-auto absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-4 text-white/40 hover:text-white transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/80"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div
          className="pointer-events-auto relative h-[62vh] md:h-[68vh] w-full max-w-[1200px]"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={item.image_path}
            alt={item.title ?? `환생 갤러리 작품 ${index + 1}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        <div
          className="pointer-events-auto mt-5 md:mt-7 flex max-w-2xl flex-col items-center gap-2 text-center px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-mono text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-white/45">
            {String(index + 1).padStart(2, "0")}
            <span className="mx-3 text-white/25">/</span>
            {String(total).padStart(2, "0")}
          </p>
          {item.title && (
            <h2 className="font-pretendard text-lg md:text-xl font-medium text-white/90">
              {item.title}
            </h2>
          )}
          {item.description && (
            <p className="font-pretendard text-xs md:text-sm text-white/60 leading-relaxed">
              {item.description}
            </p>
          )}
          {item.caption_en && (
            <p className="mt-1 font-mono text-[10px] italic text-white/35">
              {item.caption_en}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
