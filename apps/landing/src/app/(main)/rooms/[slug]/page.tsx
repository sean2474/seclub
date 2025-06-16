import { RoomDetail } from "@/assets/room-modal"
import { roomData } from "@/const/room-data"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  return <RoomDetail selectedRoom={roomData.find(room => room.slug === slug) || roomData[0]} />
}