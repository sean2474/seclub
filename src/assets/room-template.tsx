import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageSlider } from "@/components/ui/image-slider";
import { RoomFeatures } from "@/components/ui/room-features";
import { MainImageSlider } from "@/components/ui/main-image-slider";

import { RoomInfo } from "@/types";
import { roomData } from "@/const/room-data";
import { ScrollReveal } from "@/components/base/scroll-reveal";

export const RoomTemplate = ({ roomInfo }: { roomInfo: RoomInfo }) => {
  if (!roomInfo) {
    return <div>Room not found</div>;
  }

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
            <div className="relative w-full h-80 md:h-[700px] max-w-4xl mx-auto">
              <MainImageSlider images={roomInfo.mainImages} />
            </div>
          </div>
        </section>
        <section className="bg-beige center py-12 md:py-32 w-full text-black relative">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 w-full">
            <ScrollReveal side="left" className="center order-1 md:order-1">
              <div className="center flex-col md:absolute md:top-1/2 md:-translate-y-1/2 md:left-1/4 md:-translate-x-1/2">
                <h3 className="text-3xl md:text-5xl font-serif">Amenities</h3>
                <h4 className="text-xl md:text-2xl mt-2">SECLUB</h4>
              </div>
            </ScrollReveal>
            <ScrollReveal side="right" className="px-5 mt-10 md:mt-0 order-2 md:order-2">
              <ImageSlider slides={roomInfo.amenities} />
            </ScrollReveal>
          </div>
        </section>
        <section className="bg-background py-4 md:py-16">
          <RoomFeatures features={roomInfo.features} />
          <ScrollReveal side="left" className="center mt-2 md:mt-10">
            <Button variant={"primary"} size={"xl"} className="text-white">예약하기</Button>
          </ScrollReveal>
        </section>
        <section>
          <div className="bg-background w-full pt-6 md:pt-0 center">
            <div className="max-w-4xl pb-16 mx-4 w-full border-b border-gray-400/50">
              <h3 className="font-medium">
                추가 정보
              </h3>
              <ol className="border border-gray-400/50 p-5 mt-5 space-y-4 list-decimal pl-10 text-wrap">
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
                  <Card
                    {...room}
                    className="w-90 flex-shrink-0"
                    key={room.slug}
                  />
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
  );
};
