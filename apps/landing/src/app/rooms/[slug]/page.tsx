import { RoomTemplate } from "@/assets/room-template"
import { roomDetailData } from "@/const/room-detail"
import { RoomType } from "@/types"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    return {
        title: `SE클럽 | ${roomDetailData[slug as RoomType].name}`,
        description: roomDetailData[slug as RoomType].subtitle,
    }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <RoomTemplate roomInfo={roomDetailData[slug as RoomType]} />
}