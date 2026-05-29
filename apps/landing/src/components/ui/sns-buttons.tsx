"use client"

import Link from "next/link"
import type { IconType } from "react-icons"
import {
  SiKakaotalk,
  SiNaver,
  SiYoutube,
  SiInstagram,
  SiTiktok,
  SiPinterest,
} from "react-icons/si"
import { Globe } from "lucide-react"
import { DotToXIcon } from "@/components/icon/dot-to-x"
import type { SnsLink } from "@/lib/sns-links"

type IconStyle = { Icon: IconType; bg: string; fg: string }

// platform 키 → 브랜드 글리프 + 공식 브랜드 컬러.
// DB 의 platform 값과 일치해야 한다. 매핑이 없으면 중립 폴백을 쓴다.
const PLATFORM_ICONS: Record<string, IconStyle> = {
  kakaotalk: { Icon: SiKakaotalk, bg: "#FEE500", fg: "#000000" },
  naver_reserve: { Icon: SiNaver, bg: "#03C75A", fg: "#ffffff" },
  naver_map: { Icon: SiNaver, bg: "#03C75A", fg: "#ffffff" },
  naver_cafe: { Icon: SiNaver, bg: "#03C75A", fg: "#ffffff" },
  naver_blog: { Icon: SiNaver, bg: "#03C75A", fg: "#ffffff" },
  youtube: { Icon: SiYoutube, bg: "#FF0000", fg: "#ffffff" },
  instagram: {
    Icon: SiInstagram,
    bg: "linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)",
    fg: "#ffffff",
  },
  tiktok: { Icon: SiTiktok, bg: "#000000", fg: "#ffffff" },
  pinterest: { Icon: SiPinterest, bg: "#E60023", fg: "#ffffff" },
}

const FALLBACK_ICON: IconStyle = { Icon: Globe, bg: "#6b7280", fg: "#ffffff" }

// 토글(56px)과 아이콘들의 세로 간격. ChatbotWidget 의 liftPx 계산과 맞춰야 한다.
export const SNS_ITEM_GAP = 58

export function SnsButtons({
  links,
  open,
  onOpenChange,
}: {
  links: SnsLink[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (links.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <div className="relative h-12 w-12">
        {links.map((sns, idx) => {
          const { Icon, bg, fg } = PLATFORM_ICONS[sns.platform] ?? FALLBACK_ICON
          return (
            <Link
              key={sns.id}
              href={sns.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={sns.label}
              title={sns.label}
              className={`
                absolute left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center
                rounded-full shadow-md
                transition-all duration-300
                hover:scale-110
                ${open ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0"}
              `}
              style={{
                background: bg,
                bottom: open ? `${(idx + 1) * SNS_ITEM_GAP}px` : "6px",
              }}
            >
              <Icon size={20} color={fg} />
            </Link>
          )
        })}

        {/* 토글 버튼 (코너 고정) */}
        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-label={open ? "SNS 메뉴 닫기" : "SNS 메뉴 열기"}
          aria-expanded={open}
          className="absolute bottom-0 left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)] transition-transform duration-200"
        >
          <DotToXIcon size={0.8} open={open} />
        </button>
      </div>
    </div>
  )
}
