"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GuestCounterProps {
  label: string
  description?: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

export function GuestCounter({
  label,
  description,
  value,
  min,
  max,
  onChange,
}: GuestCounterProps) {
  const decrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const increment = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <p className="text-xs text-foreground/60">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-full border-foreground/20"
          onClick={decrement}
          disabled={value <= min}
        >
          <Minus className="size-4" />
          <span className="sr-only">감소</span>
        </Button>
        <span className="w-8 text-center text-sm font-medium">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8 rounded-full border-foreground/20"
          onClick={increment}
          disabled={value >= max}
        >
          <Plus className="size-4" />
          <span className="sr-only">증가</span>
        </Button>
      </div>
    </div>
  )
}
