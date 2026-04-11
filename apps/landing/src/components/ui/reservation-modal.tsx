"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { X, ChevronRight } from "lucide-react"
import { track } from "@vercel/analytics"
import { CAMPING_URL, VILLA_URL } from "@/const/urls"

const options = [
  {
    type: "camping" as const,
    title: "캠핑장",
    subtitle: "태안둘레길캠핑장",
    image: "/images/site/hero.jpg",
    url: CAMPING_URL,
  },
  {
    type: "villa" as const,
    title: "풀빌라 & 펜션",
    subtitle: "SE Club 풀빌라 & 펜션",
    image: "/images/room/pool-villa/main-1.jpg",
    url: VILLA_URL,
  },
]

interface ReservationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReservationModal({ open, onOpenChange }: ReservationModalProps) {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      document.body.style.overflow = "hidden"
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    } else {
      setVisible(false)
      document.body.style.overflow = ""
      const timer = setTimeout(() => setMounted(false), 500)
      return () => clearTimeout(timer)
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  const handleClose = () => onOpenChange(false)

  const handleClick = (type: "camping" | "villa", url: string) => {
    track(`reservation_modal_${type}`, { location: "reservation_modal", page: window.location.pathname })
    window.open(url, "_blank")
    handleClose()
  }

  if (!mounted) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity duration-500 ease-out"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white w-full max-w-[520px] pointer-events-auto transition-all duration-500 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-1 text-foreground/60 hover:text-foreground transition-opacity duration-300 cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
            <span className="sr-only">Close</span>
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-5">
            <p className="text-xs tracking-[0.2em] uppercase text-foreground/40 font-light">Reservation</p>
            <h2 className="text-xl font-light mt-1 tracking-wide">예약하기</h2>
          </div>

          {/* Divider */}
          <div className="mx-8 h-px bg-foreground/10" />

          {/* Options */}
          <div className="p-8 pt-6 flex flex-col gap-4">
            {options.map((opt) => (
              <button
                key={opt.type}
                onClick={() => handleClick(opt.type, opt.url)}
                className="group relative overflow-hidden w-full aspect-[2.4/1] cursor-pointer"
              >
                {/* Image */}
                <Image
                  src={opt.image}
                  alt={opt.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 520px) 100vw, 520px"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/80" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <p className="text-white text-lg font-light tracking-wide">{opt.title}</p>
                    <p className="text-white/60 text-xs font-light mt-0.5">{opt.subtitle}</p>
                  </div>
                  <ChevronRight
                    strokeWidth={1}
                    className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
