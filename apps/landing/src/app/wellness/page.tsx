import Image from "next/image";
import { WellnessLinkCard } from "@/components/ui/wellness-link-card";
import { ScrollReveal } from "@/components/base/scroll-reveal";
import { wellnessData } from "@/const/wellness-detail";

export default function Page() {
  return (
    <main>
      <section className="fixed -z-10 top-0 h-svh w-full overflow-x-hidden">
        <Image src={"/images/wellness/hero.jpg"} sizes="100vw" alt={"SE클럽 객실 전경"} fill className="object-cover" />
        <div className="z-10 absolute w-full h-full top-0 left-0 bg-black/30" />
        <div className="z-10 absolute top-1/2 left-1/2 md:left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-background whitespace-nowrap">
          <ScrollReveal side="top" type="h1"> SE클럽 웰니스 </ScrollReveal>
          <ScrollReveal side="bottom" type="p" className="text-xl md:text-2xl mt-4"> 아름다운 경관과 함께하는 힐링 </ScrollReveal>
        </div>
      </section>
      
      <section className="py-4 md:py-16 px-4 translate-y-[100svh] mb-[100svh] bg-background" suppressHydrationWarning>
        <ScrollReveal side="right" type="h2" className="text-3xl md:text-4xl font-medium text-center mt-8 mb-4 font-serif">Overview</ScrollReveal>
        <ScrollReveal side="left" type="div" className="text-md md:text-lg font-medium text-center pb-4 md:pb-12 mb-4 md:mb-12 border-b max-w-7xl mx-auto text-foreground/80">탁 트인 자연 속에서 몸과 마음이 모두 쉬어가는 힐링의 시간을 누려보세요</ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 mx-auto w-full max-w-5xl">
          {wellnessData.map((wellness, idx) => (
            <ScrollReveal side="left" delay={`${idx * 100}ms`} key={wellness.slug} revealHeight="10%">
              <WellnessLinkCard {...wellness} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}