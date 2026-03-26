import Image from "next/image";
import { RoomsLinkCard } from "@/components/ui/rooms-link-card";
import { ScrollReveal } from "@/components/base/scroll-reveal";
import { getRoomCards } from "@/lib/rooms";
import { generateMetadata } from "@/utils/metadata-generator";
import { ScrollNudge } from "@/components/ui/scroll-nudge";

export const metadata = generateMetadata("SE Club | 객실", "아름다운 경관과 함께하는 힐링");

export default async function RoomsPage() {
  const roomData = await getRoomCards();
  return (
    <main>
      <section className="fixed top-0 h-svh w-full overflow-x-hidden">
        <Image src={"/images/room/hero.jpg"} sizes="100vw" alt={"SE Club 객실 전경"} fill className="object-cover" />
        <div className="z-10 absolute w-full h-full top-0 left-0 bg-black/30" />
        <div className="z-10 absolute top-1/2 left-1/2 md:left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-background whitespace-nowrap">
          <ScrollReveal side="top" type="h1"> SE Club 객실 </ScrollReveal>
          <ScrollReveal side="bottom" type="p" className="text-xl md:text-2xl mt-4"> 아름다운 경관과 함께하는 힐링 </ScrollReveal>
        </div>
        <ScrollNudge />
      </section>
      
      <section className="py-4 md:py-16 px-4 translate-y-[100svh] mb-[100svh] bg-background" suppressHydrationWarning>
        <ScrollReveal side="right" type="h2" className="text-3xl md:text-4xl font-medium text-center mt-8 mb-4 font-serif">Overview</ScrollReveal>
        <ScrollReveal side="left" type="div" className="text-md md:text-lg font-medium text-center pb-4 md:pb-12 mb-4 md:mb-12 border-b max-w-7xl mx-auto text-foreground/80">전 객실에서 오선뷰를 감상할 수 있으며, 전용 야외발코니에서 프라이빗 <span className="text-green-900 font-semibold">요리를 즐길 수 있습니다</span></ScrollReveal>
        <div className="flex flex-col max-w-7xl mx-auto divide-y divide-foreground/30 gap-4 md:gap-8">
          {roomData.map((room, idx) => (
            <ScrollReveal side="left" delay={`${idx * 100}ms`} key={room.slug} revealHeight="10%">
              <RoomsLinkCard {...room} />
              <div className="h-0 md:h-8" />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}