"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import type { GalleryRebornItem } from "@/types/gallery-reborn"

interface RebornPieceProps {
  item: GalleryRebornItem
  index: number
  onOpen: (index: number) => void
  /** 그리드에서 차지하는 col 수 — Next/image sizes 반영 */
  span?: 1 | 2
  /** 카드 aspect 비율 */
  aspectClass?: string
}

/**
 * 업사이클링 작품 카드.
 * - 스크롤 진입 시 grayscale→color + clip-path 커튼 reveal (죽은 사물이 되살아남)
 * - 초기 상태도 이미지가 visible (desaturated) — 첫 카드 빈 blur 버그 방지
 * - 호버: 3D perspective tilt + View 배지
 * - 카드 하단: 작품 번호 · 제목 · 참여자 · 재료 태그
 */
export function RebornPiece({
  item,
  index,
  onOpen,
  span = 1,
  aspectClass = "aspect-[4/5]",
}: RebornPieceProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const clipVariant = REVEAL_VARIANTS[index % REVEAL_VARIANTS.length]
  const sizes = span === 2
    ? "(max-width: 768px) 100vw, 95vw"
    : "(max-width: 768px) 100vw, 48vw"

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -8, y: px * 12 })
  }

  const onMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      aria-label={`${item.title ?? `작품 ${index + 1}`}${item.participant ? ` · ${item.participant}` : ""}`}
      className="group relative block w-full cursor-pointer text-left"
      style={{ perspective: 1400 }}
    >
      <motion.div
        className={`relative w-full overflow-hidden bg-[#141414] ${aspectClass}`}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 원본 이미지 — 마운트 시 stagger 로 clip 풀리고 grayscale→color 전이 (환생) */}
        <motion.div
          className="absolute inset-0"
          initial={{
            clipPath: clipVariant.initial,
            filter: "grayscale(100%) brightness(0.55) contrast(0.95)",
          }}
          animate={{
            clipPath: "inset(0% 0% 0% 0%)",
            filter: "grayscale(0%) brightness(1) contrast(1)",
          }}
          transition={{
            clipPath: {
              duration: 1.8,
              // 6번째 카드까지만 stagger, 이후는 같은 타이밍에 reveal (스케일 대응)
              delay: 0.25 + 0.5 * Math.min(index, 5),
              ease: [0.22, 0.88, 0.24, 1],
            },
            filter: {
              duration: 3.2,
              delay: 0.7 + 0.5 * Math.min(index, 5),
              ease: "easeOut",
            },
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

        {/* initial 흐린 프리뷰 — 이미지 로드 전에 실루엣 비슷한 느낌 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(0,0,0,0.55)_100%)] mix-blend-multiply"
        />

        {/* hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />

        {/* hover 시 확대 안내 배지 */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/90 bg-black/60 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20">
            View
          </span>
        </div>
      </motion.div>

      {/* 캡션 블록: 번호 · 제목 · 참여자 · 재료 */}
      <div className="mt-4 md:mt-5 flex items-start gap-3">
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/40 pt-1 shrink-0">
          N° {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          {item.title && (
            <h3 className="font-pretendard text-sm md:text-base font-medium text-white/90 leading-snug">
              {item.title}
            </h3>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            {item.participant && (
              <span className="font-pretendard text-[11px] md:text-xs text-white/55">
                {item.participant}
              </span>
            )}
            {item.workshop_date && (
              <>
                <span className="text-white/20 text-[10px]">·</span>
                <span className="font-mono text-[10px] text-white/40">
                  {item.workshop_date}
                </span>
              </>
            )}
          </div>
          {item.materials && item.materials.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.materials.slice(0, 3).map((m) => (
                <span
                  key={m}
                  className="font-pretendard text-[10px] text-white/50 border border-white/15 rounded-full px-2 py-0.5"
                >
                  {m}
                </span>
              ))}
            </div>
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
  { name: "vertical-pinch", initial: "inset(0% 42% 0% 42%)" },
  { name: "horizontal-pinch", initial: "inset(42% 0% 42% 0%)" },
]
