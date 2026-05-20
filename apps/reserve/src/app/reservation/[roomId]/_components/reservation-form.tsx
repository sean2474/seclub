"use client"

import { useState, useMemo } from "react"
import { differenceInDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { type RoomType, formatPrice } from "@/lib/room-data"
import { DatePicker } from "./date-picker"
import { GuestCounter } from "./guest-counter"

interface ReservationFormProps {
  room: RoomType
}

export function ReservationForm({ room }: ReservationFormProps) {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [adults, setAdults] = useState(room.baseGuests)
  const [children, setChildren] = useState(0)
  const [pets, setPets] = useState(0)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [requests, setRequests] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const nights = useMemo(() => {
    if (checkIn && checkOut) {
      return differenceInDays(checkOut, checkIn)
    }
    return 0
  }, [checkIn, checkOut])

  const totalPrice = useMemo(() => {
    if (nights <= 0) return 0

    let price = room.price * nights

    const extraGuests = Math.max(0, adults + children - room.baseGuests)
    if (extraGuests > 0 && room.extraPersonFee) {
      price += room.extraPersonFee * extraGuests * nights
    }

    if (pets > 0 && room.petFee) {
      price += room.petFee * pets * nights
    }

    return price
  }, [nights, adults, children, pets, room])

  const handleCheckInChange = (date: Date | undefined) => {
    setCheckIn(date)
    if (date && checkOut && checkOut <= date) {
      setCheckOut(undefined)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!checkIn || !checkOut) {
      alert("체크인/체크아웃 날짜를 선택해주세요.")
      return
    }

    if (!name || !phone) {
      alert("예약자 정보를 입력해주세요.")
      return
    }

    if (!agreedToTerms) {
      alert("이용약관에 동의해주세요.")
      return
    }

    alert(`예약이 완료되었습니다.\n\n객실: ${room.name}\n숙박 기간: ${nights}박\n총 금액: ${formatPrice(totalPrice)}원`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6">
      <div>
        <h3 className="text-lg font-medium text-foreground">날짜 선택</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <DatePicker
            label="체크인"
            date={checkIn}
            onDateChange={handleCheckInChange}
            placeholder="체크인 날짜"
          />
          <DatePicker
            label="체크아웃"
            date={checkOut}
            onDateChange={setCheckOut}
            minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : undefined}
            placeholder="체크아웃 날짜"
          />
        </div>
        {nights > 0 && (
          <p className="mt-2 text-sm text-foreground/60">
            {nights}박 숙박
          </p>
        )}
      </div>

      <div className="border-t border-foreground/10 pt-6">
        <h3 className="text-lg font-medium text-foreground">인원 선택</h3>
        <div className="mt-4 divide-y divide-foreground/10">
          <GuestCounter
            label="성인"
            description="만 13세 이상"
            value={adults}
            min={1}
            max={room.maxGuests}
            onChange={setAdults}
          />
          <GuestCounter
            label="아동"
            description="만 12세 이하"
            value={children}
            min={0}
            max={Math.max(0, room.maxGuests - adults)}
            onChange={setChildren}
          />
          {room.petAllowed && room.maxPets && (
            <GuestCounter
              label="반려견"
              description={`최대 ${room.maxPets}마리 (1마리당 ${formatPrice(room.petFee || 0)}원/박)`}
              value={pets}
              min={0}
              max={room.maxPets}
              onChange={setPets}
            />
          )}
        </div>
      </div>

      <div className="border-t border-foreground/10 pt-6">
        <h3 className="text-lg font-medium text-foreground">예약자 정보</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              이름 <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="mt-1.5 h-12 border-foreground/20"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium text-foreground">
              연락처 <span className="text-red-500">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className="mt-1.5 h-12 border-foreground/20"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="mt-1.5 h-12 border-foreground/20"
            />
          </div>
          <div>
            <label htmlFor="requests" className="text-sm font-medium text-foreground">
              요청사항
            </label>
            <Textarea
              id="requests"
              value={requests}
              onChange={(e) => setRequests(e.target.value)}
              placeholder="요청사항을 입력해주세요"
              className="mt-1.5 min-h-24 border-foreground/20 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-foreground/10 pt-6">
        <h3 className="text-lg font-medium text-foreground">결제 정보</h3>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/60">객실 요금 ({nights}박)</span>
            <span className="text-foreground">{formatPrice(room.price * nights)}원</span>
          </div>
          {adults + children > room.baseGuests && room.extraPersonFee && (
            <div className="flex justify-between">
              <span className="text-foreground/60">
                추가 인원 ({adults + children - room.baseGuests}명)
              </span>
              <span className="text-foreground">
                {formatPrice(room.extraPersonFee * (adults + children - room.baseGuests) * nights)}원
              </span>
            </div>
          )}
          {pets > 0 && room.petFee && (
            <div className="flex justify-between">
              <span className="text-foreground/60">반려견 ({pets}마리)</span>
              <span className="text-foreground">{formatPrice(room.petFee * pets * nights)}원</span>
            </div>
          )}
          <div className="flex justify-between border-t border-foreground/10 pt-2 text-base font-medium">
            <span className="text-foreground">총 결제 금액</span>
            <span className="text-foreground">{formatPrice(totalPrice)}원</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
        />
        <label htmlFor="terms" className="text-sm text-foreground/80 leading-relaxed">
          <span className="underline underline-offset-2">이용약관</span> 및{" "}
          <span className="underline underline-offset-2">개인정보 처리방침</span>에 동의합니다.
        </label>
      </div>

      <Button
        type="submit"
        className="h-14 w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={!checkIn || !checkOut || !agreedToTerms}
      >
        {totalPrice > 0 ? `${formatPrice(totalPrice)}원 결제하기` : "예약하기"}
      </Button>
    </form>
  )
}
