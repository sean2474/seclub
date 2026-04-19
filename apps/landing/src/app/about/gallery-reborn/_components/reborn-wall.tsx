"use client"

import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { GalleryRebornItem } from "@/types/gallery-reborn"
import { RebornPiece } from "./reborn-piece"
import { Lightbox } from "./lightbox"

interface RebornWallProps {
  items: GalleryRebornItem[]
}

/**
 * 작품 인덱스별 그리드 colSpan + aspect 패턴.
 * 7장 기준 큐레이션된 에디토리얼 레이아웃 — 단조로운 2열 그리드 회피.
 * 가로(full-width) 와 세로(tall) 를 교차하여 리듬감.
 */
type PieceLayout = {
  colSpanClass: string
  span: 1 | 2
  aspect: string
}

const PIECE_LAYOUT: PieceLayout[] = [
  { colSpanClass: "col-span-2", span: 2, aspect: "aspect-[16/9]" },   // 0: 가로 와이드 feature
  { colSpanClass: "col-span-1", span: 1, aspect: "aspect-[3/4]" },    // 1: 세로
  { colSpanClass: "col-span-1", span: 1, aspect: "aspect-[4/5]" },    // 2: 세로 약간
  { colSpanClass: "col-span-2", span: 2, aspect: "aspect-[5/3]" },    // 3: 가로 (quote 인용)
  { colSpanClass: "col-span-1", span: 1, aspect: "aspect-[1/1]" },    // 4: 정사각
  { colSpanClass: "col-span-1", span: 1, aspect: "aspect-[3/4]" },    // 5: 세로
  { colSpanClass: "col-span-2", span: 2, aspect: "aspect-[21/9]" },   // 6: 파노라마 피날레
]

function layoutFor(index: number): PieceLayout {
  return PIECE_LAYOUT[index % PIECE_LAYOUT.length]
}

export function RebornWall({ items }: RebornWallProps) {
  const [active, setActive] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)

  const onOpen = useCallback((i: number) => setActive(i), [])
  const onClose = useCallback(() => setActive(null), [])
  const onPrev = useCallback(
    () => setActive((a) => (a === null ? null : (a - 1 + items.length) % items.length)),
    [items.length]
  )
  const onNext = useCallback(
    () => setActive((a) => (a === null ? null : (a + 1) % items.length)),
    [items.length]
  )

  // 데스크탑 전용: 커서를 따라다니는 부드러운 라이트 스포트. 사진을 "비추는" 관람자 시선.
  // reduced-motion 선호 사용자에게는 비활성화 (접근성).
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(pointer: coarse)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = spotlightRef.current
    const container = containerRef.current
    if (!el || !container) return

    let rafId = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      targetX = e.clientX - rect.left
      targetY = e.clientY - rect.top
    }
    const tick = () => {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      el.style.transform = `translate3d(${currentX - 340}px, ${currentY - 340}px, 0)`
      rafId = requestAnimationFrame(tick)
    }
    container.addEventListener("mousemove", handleMove)
    rafId = requestAnimationFrame(tick)
    return () => {
      container.removeEventListener("mousemove", handleMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative bg-[#0b0b0c] text-white overflow-hidden">
      {/* 커서 스포트라이트 (데스크탑 전용) */}
      <div
        ref={spotlightRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-[680px] w-[680px] rounded-full hidden md:block z-[2]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255, 236, 208, 0.22) 0%, rgba(255,236,208,0.08) 45%, transparent 72%)",
          mixBlendMode: "screen",
          willChange: "transform",
          transform: "translate3d(-1000px, -1000px, 0)",
        }}
      />

      {/* 필름 그레인 오버레이 — 업사이클링 공방의 거친 질감. reduced-motion 시 정적. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/images/noise.webp')] bg-repeat opacity-[0.07] mix-blend-overlay z-[1] motion-safe:animate-[grain_1.6s_steps(4)_infinite]"
      />

      {/* 헤더와 다크 섹션 사이 부드러운 전환 */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

      <section
        className="relative mx-auto w-full max-w-[1600px] px-5 md:px-12 lg:px-20"
        style={{ paddingTop: "clamp(8rem, 16vh, 14rem)", paddingBottom: "clamp(6rem, 12vh, 10rem)" }}
      >
        <Intro total={items.length} />

        <div className="mt-20 md:mt-32 grid grid-cols-2 gap-6 md:gap-x-10 md:gap-y-16 relative z-[2]">
          {items.map((item, i) => {
            const { colSpanClass, span, aspect } = layoutFor(i)
            if (item.layout_type === "quote") {
              return (
                <div key={item.id} className="col-span-2">
                  <QuoteFeature item={item} index={i} onOpen={onOpen} />
                </div>
              )
            }
            return (
              <div key={item.id} className={colSpanClass}>
                <RebornPiece
                  item={item}
                  index={i}
                  onOpen={onOpen}
                  span={span}
                  aspectClass={aspect}
                />
              </div>
            )
          })}
        </div>

        <Outro />
      </section>

      <AnimatePresence>
        {active !== null && (
          <Lightbox
            item={items[active]}
            index={active}
            total={items.length}
            onClose={onClose}
            onPrev={onPrev}
            onNext={onNext}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function Intro({ total }: { total: number }) {
  return (
    <header className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-mono text-[11px] tracking-[0.4em] uppercase text-white/45"
        >
          Gallery of Upcycling · {String(total).padStart(2, "0")} works
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12 }}
          className="mt-4 font-black-han-sans text-5xl md:text-7xl leading-none"
        >
          환생 갤러리
        </motion.h1>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.24 }}
        className="font-pretendard max-w-sm text-sm md:text-base leading-relaxed text-white/65"
      >
        해변에서 주워 올린 조각들이 흩어진 채로 머무르지 않도록.
        바람과 소금이 남긴 결을 읽고, 다시 한 번 제 모양을 찾도록 거드는
        업사이클링 전시입니다.
      </motion.p>
    </header>
  )
}

function Outro() {
  return (
    <div className="mt-24 md:mt-40 flex flex-col items-center gap-6 text-center">
      <div className="h-px w-12 bg-white/25" />
      <p className="font-pretendard text-sm md:text-base text-white/55 max-w-md leading-relaxed">
        흩어졌던 것들이 다시 모여 작품이 됩니다.<br />
        바다는 매번 다른 얼굴로 돌아옵니다.
      </p>
      <span className="font-mono text-[10px] tracking-[0.45em] uppercase text-white/30">
        Born Again · 2026
      </span>
    </div>
  )
}

/**
 * layout_type='quote' 작품: 작은 이미지 + 큰 pull-quote 로 전시 사이 호흡/리듬.
 * 어드민이 "이 작품은 전시의 숨골로 두자" 라고 지정한 카드.
 */
function QuoteFeature({
  item,
  index,
  onOpen,
}: {
  item: GalleryRebornItem
  index: number
  onOpen: (i: number) => void
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={item.title ?? `환생 갤러리 작품 ${index + 1}`}
      className="group relative grid w-full grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 text-left cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.15 + 0.5 * index, ease: [0.22, 0.88, 0.24, 1] }}
    >
      <div className="md:col-span-4 md:col-start-1">
        <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden md:max-w-none">
          <motion.div
            className="absolute inset-0"
            initial={{ clipPath: "inset(50% 0%)", filter: "grayscale(100%) brightness(0.55)" }}
            animate={{ clipPath: "inset(0% 0%)", filter: "grayscale(0%) brightness(1)" }}
            transition={{
              clipPath: { duration: 1.8, delay: 0.3 + 0.5 * index, ease: [0.22, 0.88, 0.24, 1] },
              filter: { duration: 3.2, delay: 0.7 + 0.5 * index },
            }}
          >
            <Image
              src={item.image_path}
              alt={item.title ?? `환생 갤러리 작품 ${index + 1}`}
              fill
              sizes="(max-width: 768px) 60vw, 30vw"
              quality={90}
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
      <div className="md:col-span-7 md:col-start-6 flex flex-col justify-center gap-6 relative">
        <span className="absolute -top-6 -left-2 md:-top-10 md:-left-4 font-pretendard text-[120px] md:text-[200px] leading-none text-white/5 select-none">
          &ldquo;
        </span>
        <blockquote className="font-pretendard text-xl md:text-3xl lg:text-4xl leading-snug font-light text-white/90">
          {item.description}
        </blockquote>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-white/40">
            N° {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-pretendard text-sm text-white/50">{item.title}</span>
          {item.participant && (
            <>
              <span className="text-white/20">·</span>
              <span className="font-pretendard text-xs text-white/45">{item.participant}</span>
            </>
          )}
          {item.workshop_date && (
            <>
              <span className="text-white/20">·</span>
              <span className="font-mono text-[10px] text-white/40">{item.workshop_date}</span>
            </>
          )}
        </div>
      </div>
    </motion.button>
  )
}
