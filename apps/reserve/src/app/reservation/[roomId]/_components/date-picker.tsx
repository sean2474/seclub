"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  label: string
  date: Date | undefined
  onDateChange: (date: Date | undefined) => void
  minDate?: Date
  placeholder?: string
}

export function DatePicker({
  label,
  date,
  onDateChange,
  minDate,
  placeholder = "날짜 선택",
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-12 border-foreground/20",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? format(date, "yyyy년 MM월 dd일 (EEE)", { locale: ko }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              onDateChange(newDate)
              setOpen(false)
            }}
            disabled={(date) => {
              if (minDate) {
                return date < minDate
              }
              return date < new Date(new Date().setHours(0, 0, 0, 0))
            }}
            locale={ko}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
