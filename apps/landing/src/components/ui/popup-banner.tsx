"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import type { PopupData } from "@/lib/popups"

interface PopupBannerProps {
  popups: PopupData[]
}

function getTodayKey(popupId: string): string {
  const today = new Date().toISOString().split("T")[0]
  return `popup_dismissed_${popupId}_${today}`
}

export function PopupBanner({ popups }: PopupBannerProps) {
  const [currentPopup, setCurrentPopup] = useState<PopupData | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isOpening, setIsOpening] = useState(true)

  useEffect(() => {
    const popup = popups.find((p) => {
      try {
        return !localStorage.getItem(getTodayKey(p.id))
      } catch {
        return true
      }
    })

    if (popup) {
      setCurrentPopup(popup)
      const timer = setTimeout(() => {
        setIsVisible(true)
        // 열림 애니메이션 트리거
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setIsOpening(false))
        })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [popups])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsVisible(false)
      setCurrentPopup(null)
      setIsClosing(false)
      setIsOpening(true)
    }, 300)
  }

  const handleDismissToday = () => {
    if (currentPopup) {
      try {
        localStorage.setItem(getTodayKey(currentPopup.id), "1")
      } catch {
        // localStorage 사용 불가 시 무시
      }
    }
    handleClose()
  }

  const handleLinkClick = () => {
    if (currentPopup?.link_url) {
      window.open(currentPopup.link_url, "_blank", "noopener,noreferrer")
    }
  }

  if (!currentPopup || !isVisible) return null

  const hasLink = !!currentPopup.link_url
  const hasImage = !!currentPopup.image_url
  const animState = isClosing
    ? "opacity-0 scale-95 translate-y-2"
    : isOpening
      ? "opacity-0 scale-95 translate-y-2"
      : "opacity-100 scale-100 translate-y-0"

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : isOpening ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 백드롭 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* 팝업 카드 */}
      <div
        className={`relative max-w-sm w-full bg-white shadow-2xl transition-all duration-300 ease-out ${animState}`}
        style={{ borderRadius: "2px" }}
      >
        {/* 이미지 영역 */}
        {hasImage && (
          <div
            className={hasLink ? "cursor-pointer" : ""}
            onClick={hasLink ? handleLinkClick : undefined}
          >
            <img
              src={currentPopup.image_url!}
              alt={currentPopup.title}
              className="w-full aspect-[4/3] object-cover"
            />
          </div>
        )}

        {/* 텍스트 영역 */}
        <div className={hasImage ? "px-6 py-5" : "px-6 pt-8 pb-6"}>
          <h3
            className={`text-lg font-medium tracking-tight text-gray-900 ${
              hasLink ? "cursor-pointer hover:text-gray-600 transition-colors" : ""
            }`}
            style={{ fontFamily: "serif" }}
            onClick={hasLink ? handleLinkClick : undefined}
          >
            {currentPopup.title}
          </h3>
          {currentPopup.content && (
            <p className="mt-2.5 text-sm text-gray-500 leading-relaxed">
              {currentPopup.content}
            </p>
          )}
          {/* 링크 CTA 버튼 */}
          {hasLink && (
            <button
              className="mt-4 inline-flex items-center gap-1 text-sm text-gray-900 font-medium tracking-tight hover:text-gray-600 transition-colors"
              onClick={handleLinkClick}
            >
              자세히 보기 <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex border-t border-gray-100 text-sm">
          <button
            className="flex-1 py-3.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50/50 transition-colors tracking-tight"
            onClick={handleDismissToday}
          >
            오늘 하루 보지 않기
          </button>
          <button
            className="flex-1 py-3.5 border-l border-gray-100 text-gray-900 font-medium hover:bg-gray-50/50 transition-colors tracking-tight"
            onClick={handleClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}
