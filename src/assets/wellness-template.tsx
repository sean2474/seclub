import { ScrollReveal } from "@/components/base/scroll-reveal";
import { Button } from "@/components/ui/button";
import { LinkCard } from "@/components/ui/link-card";
import { MainImageSlider } from "@/components/ui/main-image-slider";
import { wellnessData } from "@/const/wellness-data";
import { WellnessPageData } from "@/types";
import { BuildingLibraryIcon, ClockIcon } from "@heroicons/react/24/outline";
import { MapIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

export const WellnessTemplate = ({ wellnessPageData, slug }: { wellnessPageData: WellnessPageData, slug: string }) => {
  return (
    <main className="mt-[var(--header-height-expanded)] pt-10 md:pt-20">
      <section className="center flex-col px-4 w-full mx-auto">
        <ScrollReveal side="left" type="h2" className="font-medium text-3xl md:text-5xl text-center">{wellnessPageData.header.title}</ScrollReveal>
        <ScrollReveal side="right" type="p" className="mt-4 text-center">{wellnessPageData.header.subtitle}</ScrollReveal>
        <div className="mt-8 p-2 md:p-4 w-full bg-beige/20 max-w-4xl text-sm md:text-base">
          <div className="grid grid-cols-1 md:grid-cols-3 w-full divide-y md:divide-y-0 md:divide-x">
            <ScrollReveal side="left" delay="100ms" className="flex items-center gap-4 p-2 md:p-4">
              <BuildingLibraryIcon className="w-8 h-8 md:w-12 md:h-12" strokeWidth={0.5} />
              <div>
                <div>타입</div>
                <strong>{wellnessPageData.header.type}</strong>
              </div>
            </ScrollReveal>
            <ScrollReveal side="left" delay="200ms" className="flex items-center gap-4 p-2 md:p-4">
              <MapIcon className="w-8 h-8 md:w-12 md:h-12" strokeWidth={0.5} />
              <div>
                <div>위치</div>
                <strong>{wellnessPageData.header.location}</strong>
              </div>
            </ScrollReveal>
            <ScrollReveal side="left" delay="300ms" className="flex items-center gap-4 p-2 md:p-4">
              <ClockIcon className="w-8 h-8 md:w-12 md:h-12" strokeWidth={0.5} />
              <div className="flex flex-col justify-center">
                <div>운영시간</div>
                <strong>{wellnessPageData.header.hours}</strong>
              </div>
            </ScrollReveal>
        </div>
        </div>
      </section>
      <section className="bg-background center w-full relative pb-4 md:pb-10 pt-5">
        <div className="absolute h-60 md:h-[550px] bottom-0 w-full bg-beige" />
        <div className="w-full p-3.5">
          <ScrollReveal side="left" delay="400ms" className="relative w-full h-80 md:h-[700px] max-w-4xl mx-auto">
            <Image src={wellnessPageData.header.image} alt={wellnessPageData.header.title} fill className="object-cover" />
          </ScrollReveal>
        </div>
      </section>
      <section>
        <div className="bg-background w-full pt-6 md:pt-0 center">
          <div className="max-w-4xl mx-4 w-full mt-5 md:mt-15">
            <ScrollReveal side="left" type="h3" className="font-medium">
              {slug === "walk" ? "코스 정보" : "추가 정보"}
            </ScrollReveal>
            <ol className="border border-gray-400/50 p-5 mt-5 space-y-4 list-disc pl-10 text-wrap font-light">
              {wellnessPageData.contents.map((content, idx) => (
                <ScrollReveal side="right" type="li" delay={`${idx * 100}ms`} key={idx} className="space-y-1"> {content} </ScrollReveal>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <section className="border-b border-gray-400/50 h-[500px] m-auto center mt-10 md:mt-15">
        <div className="w-full flex gap-5 md:gap-20 h-full mx-4 max-w-4xl flex-col md:flex-row">
          <ScrollReveal side="left" type="h3" className="font-medium">
            갤러리
          </ScrollReveal>
          <MainImageSlider images={wellnessPageData.images} color="black" />
        </div>
      </section>
      <section className="bg-background py-12 px-4 center">
        <div className="max-w-4xl mx-4 w-full">
          <h3 className="font-medium">웰니스 더보기</h3>

          {/* 모바일: 가로 스크롤 / 데스크탑: 3열 그리드 */}
          <div className="mt-10 flex space-x-5 overflow-x-auto md:gap-5">
            {wellnessData
              .filter((wellness) => wellness.slug !== slug)
              .map((wellness) => (
                <LinkCard
                  {...wellness}
                  className="w-72 sm:w-100 flex-shrink-0"
                  key={wellness.slug}
                />
              ))}
          </div>
          <div className="center pt-10">
            <Link href="/wellness">
              <Button variant="outline" size="xl">
                목록
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
