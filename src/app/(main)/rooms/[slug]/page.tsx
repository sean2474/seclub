import { RoomTemplate } from "@/assets/room-template"
import { ROOM_DETAIL_DATA } from "@/const/room-detail"
import { RoomType } from "@/types"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <RoomTemplate roomInfo={ROOM_DETAIL_DATA[slug as RoomType]} />
}