import Image from "next/image";
import { roomData } from "@/const/room-data";
import { Card } from "@/components/ui/card";
import ScrollReveal from "@/components/base/scroll-reveal";

export default function RoomsPage() {
  return (
    <main>
      <section className="relative h-svh w-full">
        <Image src={"/images/room/hero.jpg"} sizes="100vw" alt={"SE클럽 객실 전경"} fill className="object-cover" />
        <div className="z-10 absolute w-full h-full top-0 left-0 bg-black/30" />
        <div className="z-10 absolute top-1/2 left-1/2 md:left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-background whitespace-nowrap">
          <ScrollReveal side="top" type="h1"> SE클럽 객실 </ScrollReveal>
          <ScrollReveal side="bottom" type="p" className="text-xl md:text-2xl mt-4"> 아름다운 경관과 함께하는 힐링 </ScrollReveal>
        </div>
      </section>
      
      <section className="py-16 px-4">
        <ScrollReveal side="top" type="h2" className="text-3xl font-bold text-center mb-12 font-serif">Overview</ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 mx-auto w-full max-w-5xl p-1 md:p-4">
          {roomData.map((room, idx) => (
            <ScrollReveal side="left" delay={`${idx * 100}ms`} key={room.slug} revealHeight="10%">
              <Card {...room} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}