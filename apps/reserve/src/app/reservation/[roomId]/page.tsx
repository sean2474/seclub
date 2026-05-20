import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { getRoomById } from "@/lib/room-data"
import { RoomInfo } from "./_components/room-info"
import { ReservationForm } from "./_components/reservation-form"

interface ReservationPageProps {
  params: Promise<{ roomId: string }>
}

export async function generateMetadata({ params }: ReservationPageProps) {
  const { roomId } = await params
  const room = getRoomById(roomId)

  if (!room) {
    return { title: "객실을 찾을 수 없습니다" }
  }

  return {
    title: `${room.name} 예약 | SE CLUB`,
    description: `${room.name} - ${room.roomConfig}`,
  }
}

export default async function ReservationPage({ params }: ReservationPageProps) {
  const { roomId } = await params
  const room = getRoomById(roomId)

  if (!room) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[var(--header-height)]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-foreground/60">
              <li>
                <a href="/" className="hover:text-foreground">홈</a>
              </li>
              <li>/</li>
              <li>
                <a href="/" className="hover:text-foreground">객실</a>
              </li>
              <li>/</li>
              <li className="text-foreground">{room.name}</li>
            </ol>
          </nav>

          <h1 className="mb-8 text-2xl font-medium text-foreground">
            객실 예약
          </h1>

          <div className="grid gap-8 lg:grid-cols-2">
            <RoomInfo room={room} />
            <ReservationForm room={room} />
          </div>
        </div>
      </main>
    </>
  )
}
