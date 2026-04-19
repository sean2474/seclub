"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import type { GalleryRebornItem } from "@/types/gallery-reborn"

interface RebornPieceProps {
  item: GalleryRebornItem
  index: number
  onOpen: (index: number) => void
  /** 그리드에서 차지하는 col 수. Next/image sizes 속성에 반영됨 */
  span?: 1 | 2
}

/**
 * 업사이클링/환생 은유를 담은 작품 카드.
 * - 등장: clip-path 커튼 wipe + grayscale → color (죽은 사물 → 되살아남)
 * - 호버: 3D perspective tilt, 사진에 숨결
 */
export function RebornPiece({ item, index, onOpen, span = 1 }: RebornPieceProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const clipDirection = REVEAL_VARIANTS[index % REVEAL_VARIANTS.length]
  const sizes = span === 2
    ? "(max-width: 768px) 100vw, 90vw"
    : "(max-width: 768px) 100vw, 45vw"

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -4, y: px * 6 })
  }

  const onMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-label={item.title ?? `환생 갤러리 작품 ${index + 1}`}
      className="group relative block w-full cursor-pointer"
      style={{ perspective: 1200 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.08 * index }}
    >
      <motion.div
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#141414]"
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 원본 이미지 — 초기 desaturated & clipped, 등장 시 컬러/커튼 풀림 */}
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: clipDirection.initial, filter: "grayscale(100%) brightness(0.65)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)", filter: "grayscale(0%) brightness(1)" }}
          transition={{
            clipPath: { duration: 1.4, delay: 0.12 + 0.16 * index, ease: [0.22, 0.88, 0.24, 1] },
            filter: { duration: 1.8, delay: 0.35 + 0.16 * index, ease: "easeOut" },
          }}
        >
          <Image
            src={item.image_path}
            alt={item.title ?? `환생 갤러리 작품 ${index + 1}`}
            fill
            sizes={sizes}
            quality={90}
            className="object-cover"
            priority={index < 3}
          />
        </motion.div>

        {/* 아주 옅은 grain/vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_55%,_rgba(0,0,0,0.4)_100%)] mix-blend-multiply" />

        {/* hover 상태 overlay */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

        {/* hover 시 드러나는 확대 아이콘 */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/90 bg-black/55 backdrop-blur-sm px-4 py-2 rounded-full">
            View
          </span>
        </div>
      </motion.div>

      {/* 캡션: 번호 · 한글 제목 · 영문 부제 */}
      <div className="mt-4 md:mt-5 flex items-baseline gap-3 text-left">
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/40 shrink-0">
          N° {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          {item.title && (
            <h3 className="font-pretendard text-sm md:text-base font-medium text-white/85 truncate">
              {item.title}
            </h3>
          )}
          {item.caption_en && (
            <p className="mt-1 font-mono text-[10px] italic text-white/35 truncate">
              {item.caption_en}
            </p>
          )}
        </div>
      </div>
    </motion.button>
  )
}

type RevealVariant = { name: string; initial: string }
const REVEAL_VARIANTS: RevealVariant[] = [
  { name: "curtain-bottom", initial: "inset(100% 0% 0% 0%)" },
  { name: "curtain-right", initial: "inset(0% 100% 0% 0%)" },
  { name: "center-iris", initial: "inset(45% 45% 45% 45%)" },
  { name: "curtain-top", initial: "inset(0% 0% 100% 0%)" },
  { name: "curtain-left", initial: "inset(0% 0% 0% 100%)" },
  { name: "vertical-pinch", initial: "inset(0% 45% 0% 45%)" },
  { name: "horizontal-pinch", initial: "inset(45% 0% 45% 0%)" },
]
