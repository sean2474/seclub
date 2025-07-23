import Image from "next/image";
import { wellnessData } from "@/const/wellness-data";
import { Card } from "@/components/ui/card";
import { ScrollReveal } from "@/components/base/scroll-reveal";

export default function Page() {
  return (
    <main>
      <section className="fixed -z-10 top-0 h-svh w-full overflow-x-hidden">
        <Image src={"/images/wellness/hero.jpg"} sizes="100vw" alt={"SE클럽 객실 전경"} fill className="object-cover" />
        <div className="z-10 absolute top-1/2 left-1/2 md:left-24 transform -translate-x-1/2 md:translate-x-0 -translate-y-1/2 text-background whitespace-nowrap">
          <ScrollReveal side="top" type="h1" className="font-medium"> SE클럽 웰니스 </ScrollReveal>
          <ScrollReveal side="bottom" type="p" className="text-xl md:text-2xl mt-4"> 아름다운 경관과 함께하는 힐링 </ScrollReveal>
        </div>
      </section>
      
      <section className="py-16 px-4 mt-[100svh] bg-background">
        <ScrollReveal side="top" type="h2" className="text-2xl md:text-4xl font-medium text-center mb-12 font-serif">Overview</ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 mx-auto w-full max-w-7xl p-1 md:p-4">
          {wellnessData.map((wellness, idx) => (
            <ScrollReveal side="left" delay={`${idx * 100}ms`} key={wellness.slug} revealHeight="10%">
              <Card {...wellness} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}