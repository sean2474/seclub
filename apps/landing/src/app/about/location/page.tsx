import { ScrollReveal } from "@/components/base/scroll-reveal";
import { NaverMap } from "@/components/ui/naver-map";
import { generateMetadata } from "@/utils/metadata-generator";

export const metadata = generateMetadata("SE클럽 | 위치", "SE클럽의 위치 및 오시는 길 안내");

export default function LocationPage() {
  return (
    <main>
      <section className="h-svh flex w-dvw flex-col lg:flex-row bg-beige">
        <div className="w-full p-5 md:p-0 lg:w-1/2 h-1/2 md:h-full center">
          <div>
            <ScrollReveal side="left" className="text-3xl md:text-5xl font-serif">Location</ScrollReveal>
            <ScrollReveal side="left" delay="100ms" className="mt-12 text-xl md:text-3xl font-light border-b border-black pb-2 mb-2">SECLUB</ScrollReveal> 
            <ScrollReveal side="left" delay="200ms" className="grid grid-cols-2 gap-y-2 md:gap-y-1">
                <p>주소</p> <p className="justify-self-end text-end">충청남도 태안군 이원면 내리 503</p>
                <p>전화번호</p> <p className="justify-self-end text-end">010-9703-1711 / 010-4668-1704</p>
                <p>체크인/아웃</p> <p className="justify-self-end text-end">15:00 ~ 11:00</p>
              </ScrollReveal>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-1/2 md:h-full mt-5 md:mt-0">
            <NaverMap />
          </div>
        </section>
    </main>
  );
}