import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";

import { Button } from "@seclub/ui/button";
import { ImageSlider } from "@/components/ui/image-slider";
import { RoomFeatures } from "@/components/ui/room-features";
import { MainImageSlider } from "@/components/ui/main-image-slider";

import { getRoomBySlug, getRoomCards } from "@/lib/room-infos"
import { notFound } from "next/navigation"
import { ScrollReveal } from "@/components/base/scroll-reveal";
import { LinkEventTracker } from "@seclub/ui/link-event-tracker";
import { VILLA_URL } from "@/const/urls";

const PREMIUM_VILLA_INQUIRY_PHONE = "010-9703-1711";

export const revalidate = 3600

export async function generateStaticParams() {
  const rooms = await getRoomCards()
  return rooms.map((room) => ({ slug: room.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const room = await getRoomBySlug(slug)
  
  if (!room) {
    return { title: "SE Club | 객실 정보" }
  }
  
  return {
    title: `SE Club | ${room.name}`,
    description: room.subtitle,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [roomInfo, roomData] = await Promise.all([
    getRoomBySlug(slug),
    getRoomCards()
  ])

  if (!roomInfo) {
    notFound()
  }

  const isPremiumVilla = roomInfo.slug === "premium-villa"
  const features = isPremiumVilla
    ? [
        ...roomInfo.features,
        { icon: Phone, label: "별도문의", value: PREMIUM_VILLA_INQUIRY_PHONE },
      ]
    : roomInfo.features

  return (
    <>
      {/* Hero Section */}
      <section className="fixed -z-10 top-0 h-svh w-full overflow-x-hidden">
        <Image
          src={roomInfo.heroImage}
          alt={`${roomInfo.title} Hero Image`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <ScrollReveal side="left" className="text-white font-mono font-light text-xl">
            {roomInfo.subtitle}
          </ScrollReveal>
          <ScrollReveal side="right">
            {typeof roomInfo.title === 'string' ? (
              <h1 className="text-white font-mono font-light text-5xl md:text-7xl mt-2 md:mt-4">
                {roomInfo.title}
              </h1>
            ) : (
              roomInfo.title
            )}
          </ScrollReveal>
        </div>
      </section>
      <main className="mx-auto overflow-x-hidden">
        <section className="space-y-8 pt-8 md:pt-16 center relative mt-[95svh] bg-background">
          <div className="text-start md:text-end space-y-4 flex flex-col md:flex-row justify-between items-start md:items-center max-w-6xl p-5">
            <ScrollReveal side="left" type="h2" className="text-3xl md:text-5xl font-serif">Overview</ScrollReveal>
            <ScrollReveal side="right" className="text-md md:text-xl">
              {roomInfo.overview}
            </ScrollReveal>
          </div>
        </section>
        <section className="bg-background center w-full relative pb-0 md:pb-10 pt-5">
          <div className="absolute h-60 md:h-[550px] bottom-0 w-full bg-green-900" />
          <div className="w-full max-w-6xl p-3.5">
            <div className="relative w-full h-80 sm:h-[600px] md:h-[700px] max-w-4xl mx-auto">
              <MainImageSlider images={roomInfo.mainImages} />
            </div>
          </div>
        </section>
        <section className="bg-beige center py-12 md:py-32 w-full text-black relative">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 w-full">
            <ScrollReveal side="left" className="center order-1 md:order-1">
              <div className="center flex-col md:absolute md:top-1/2 md:-translate-y-1/2 md:left-1/4 md:-translate-x-1/2">
                <h3 className="text-3xl md:text-5xl font-serif">Amenities</h3>
                <h4 className="text-xl md:text-2xl mt-2">SE Club</h4>
              </div>
            </ScrollReveal>
            <ScrollReveal side="right" className="px-5 mt-10 md:mt-0 order-2 md:order-2">
              <ImageSlider slides={roomInfo.amenities} />
            </ScrollReveal>
          </div>
        </section>
        <section className="bg-background py-4 md:py-16">
          <RoomFeatures features={features} />
          <ScrollReveal side="left" className="center mt-2 md:mt-10">
            {isPremiumVilla ? (
              <LinkEventTracker
                eventName={`reservation_room_detail_${roomInfo.slug}`}
                location={`room_${roomInfo.slug}_reservation_btn`}
                href={`tel:${PREMIUM_VILLA_INQUIRY_PHONE}`}
              >
                <Button variant={"primary"} size={"xl"} className="text-white">별도문의</Button>
              </LinkEventTracker>
            ) : (
              <LinkEventTracker
                eventName={`reservation_room_detail_${roomInfo.slug}`}
                location={`room_${roomInfo.slug}_reservation_btn`}
                href={VILLA_URL}
                target="_blank"
              >
                <Button variant={"primary"} size={"xl"} className="text-white">예약하기</Button>
              </LinkEventTracker>
            )}
          </ScrollReveal>
        </section>
        <section>
          <div className="bg-background w-full pt-6 md:pt-0 center">
            <div className="max-w-4xl pb-16 mx-4 w-full border-b border-gray-400/50">
              <h3 className="font-medium">
                추가 정보
              </h3>
              <ol className="border border-gray-400/50 p-5 mt-5 space-y-4 list-decimal pl-10 text-wrap break-all">
                {roomInfo.additionalInfo.map((section, idx) => (
                  <li key={idx} className="space-y-2">
                    <div className="font-medium">{section.title}</div>
                    <ul className="space-y-1">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
        <section className="bg-background py-12 px-4 center">
          <div className="max-w-4xl mx-4 w-full">
            <h3 className="font-medium">다른 객실 추천</h3>

            {/* 모바일: 가로 스크롤 / 데스크탑: 3열 그리드 */}
            <div className="mt-10 flex space-x-5 overflow-x-auto md:gap-5">
              {roomData
                .filter((room) => room.slug !== roomInfo.slug)
                .map((room) => (
                  <Link href={`/rooms/${room.slug}`} key={room.slug}>
                    <div className="relative aspect-video w-72 overflow-hidden group">
                      <Image src={room.images[0]} fill className="object-cover group-hover:scale-110 transition-all duration-300" alt={room.slug} />
                    </div>
                    <div className="p-2">
                      <div className="text-xs">{room.subtitle}</div>
                      <div>{room.title}</div>
                    </div>
                  </Link>
                ))}
            </div>
            <div className="center pt-10">
              <Link href="/rooms">
                <Button variant="outline" size="xl">
                  객실 목록
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}