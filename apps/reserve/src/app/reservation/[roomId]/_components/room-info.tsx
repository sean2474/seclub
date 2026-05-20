import Image from "next/image"
import { PawPrint, Bed, Users, Clock } from "lucide-react"
import { type RoomType, formatPrice } from "@/lib/room-data"

interface RoomInfoProps {
  room: RoomType
}

export function RoomInfo({ room }: RoomInfoProps) {
  return (
    <div className="overflow-hidden bg-white">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="p-6">
        <p className="text-sm text-foreground/60">{room.category}</p>
        <h2 className="mt-1 text-2xl font-semibold text-foreground">
          {room.name}
        </h2>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <dt className="w-24 text-foreground/60">방 구성</dt>
            <dd className="text-foreground">{room.roomConfig}</dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="w-24 text-foreground/60">침대 개수</dt>
            <dd className="flex items-center gap-1.5 text-foreground">
              <Bed className="size-4" />
              {room.bedCount}
            </dd>
          </div>
          <div className="flex items-center gap-3">
            <dt className="w-24 text-foreground/60">인원</dt>
            <dd className="flex items-center gap-1.5 text-foreground">
              <Users className="size-4" />
              {room.capacity} ({room.maxCapacity})
            </dd>
          </div>
          {room.petAllowed && (
            <div className="flex items-center gap-3">
              <dt className="w-24 text-foreground/60">반려견</dt>
              <dd className="flex items-center gap-1.5 text-primary">
                <PawPrint className="size-4" />
                동반 가능 ({room.petLimit})
              </dd>
            </div>
          )}
          <div className="flex items-center gap-3">
            <dt className="w-24 text-foreground/60">체크인/아웃</dt>
            <dd className="flex items-center gap-1.5 text-foreground">
              <Clock className="size-4" />
              {room.checkIn} / {room.checkOut}
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-foreground/10 pt-6">
          <div className="flex items-baseline justify-between">
            <span className="text-foreground/60">1박 기준 요금</span>
            <span className="text-2xl font-semibold text-foreground">
              {formatPrice(room.price)}
              <span className="text-base font-normal">원</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
