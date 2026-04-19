"use client"

import { AnimatePresence, motion } from "motion/react"
import { useCallback, useState } from "react"
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

  return (
    <div className="relative bg-[#0b0b0c] text-white">
      {/* 헤더와 다크 섹션 사이 부드러운 전환 */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent z-10" />

      <section
        className="relative mx-auto w-full max-w-[1600px] px-5 md:px-12 lg:px-20"
        style={{ paddingTop: "clamp(8rem, 16vh, 14rem)", paddingBottom: "clamp(6rem, 12vh, 10rem)" }}
      >
        <Intro total={items.length} />

        <div className="mt-20 md:mt-32 grid grid-cols-2 gap-6 md:gap-x-10 md:gap-y-16">
          {items.map((item, i) => {
            const { colSpanClass, span, aspect } = layoutFor(i)
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
