import { RoomTemplate } from "@/assets/room-template"
import { roomDetailData } from "@/const/room-detail"
import { RoomType } from "@/types"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <RoomTemplate roomInfo={roomDetailData[slug as RoomType]} />
}