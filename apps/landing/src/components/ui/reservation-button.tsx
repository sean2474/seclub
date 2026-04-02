"use client"

import { useState } from "react"
import { ReservationModal } from "@/components/ui/reservation-modal"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReservationButtonProps {
  children: React.ReactNode
  className?: string
}

export function ReservationButton({ children, className }: ReservationButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(className)}
      >
        {children}
      </button>
      <ReservationModal open={open} onOpenChange={setOpen} />
    </>
  )
}
