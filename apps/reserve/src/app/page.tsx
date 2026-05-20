import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { rooms } from "@/lib/room-data"

export default function RoomsPage() {
  return (
    <>
      <Header />
      <main className="pt-[var(--header-height)]">
        <section className="py-16 text-center">
          <h1 className="text-3xl font-light tracking-wide text-foreground">
            Overview
          </h1>
          <p className="mt-4 text-foreground/70">
            전 객실에서 오션뷰를 감상할 수 있으며, 전용 야외발코니에서 프라이빗{" "}
            <span className="text-green-700 underline underline-offset-4">
              요리를 즐길 수 있습니다
            </span>
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20">
          <div className="space-y-8">
            {rooms.map((room) => (
              <article
                key={room.id}
                className="flex flex-col gap-6 border-b border-foreground/10 pb-8 md:flex-row md:gap-8"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden md:w-80 shrink-0">
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between py-2">
                  <div>
                    <p className="text-sm text-foreground/60">{room.category}</p>
                    <h2 className="mt-1 flex items-center gap-1 text-xl font-medium text-foreground">
                      {room.name}
                      <ChevronRight className="size-5" />
                    </h2>

                    <dl className="mt-4 space-y-1.5 text-sm">
                      <div className="flex gap-2">
                        <dt className="text-foreground/60">방 구성</dt>
                        <dd className="text-foreground">{room.roomConfig}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-foreground/60">침대 개수</dt>
                        <dd className="text-foreground">{room.bedCount}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-foreground/60">인원</dt>
                        <dd className="text-foreground">
                          {room.capacity} ({room.maxCapacity})
                        </dd>
                      </div>
                      {room.petAllowed && (
                        <div className="flex gap-2">
                          <dt className="text-foreground/60">반려동물 동반</dt>
                          <dd className="text-foreground">{room.petLimit} (소형 10kg 미만)</dd>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <dt className="text-foreground/60">체크인/아웃</dt>
                        <dd className="text-foreground">{room.checkIn} / {room.checkOut}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Link
                      href={`/reserve?room=${room.id}`}
                      className="border border-foreground/30 px-6 py-2 text-sm text-foreground transition-colors hover:bg-foreground hover:text-background"
                    >
                      예약하기
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
