import { galleryRebornMock } from "@/const/gallery-reborn-mock"
import { generateMetadata as makeMetadata } from "@/utils/metadata-generator"
import { RebornWall } from "./_components/reborn-wall"

export const metadata = makeMetadata(
  "SE Club | 환생 갤러리",
  "SE Club 업사이클링 체험 갤러리 — 해변에서 주운 것들이 작품이 되는 이야기."
)

export default function GalleryRebornPage() {
  const items = [...galleryRebornMock].sort((a, b) => a.display_order - b.display_order)

  if (items.length === 0) {
    return (
      <section
        className="flex items-center justify-center bg-[#0b0b0c] text-white/55"
        style={{ minHeight: "calc(100svh - var(--header-height))" }}
      >
        <p className="font-mono text-xs tracking-[0.4em] uppercase">Coming Soon</p>
      </section>
    )
  }

  return <RebornWall items={items} />
}
