import { RoomDetail } from "@/assets/room-detail"
import { RoomType } from "@/types"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  return <RoomDetail roomType={slug as RoomType} />
}