import { NaverMap } from "@/components/ui/naver-map";
import { generateMetadata } from "@/utils/metadata-generator";

export const metadata = generateMetadata("SE Club | 위치", "SE Club의 위치 및 오시는 길 안내");

export default function LocationPage() {
  return (
    <main className="mt-[var(--header-height-expanded)]">
      <section className="flex min-h-[calc(100svh-var(--header-height-expanded))] w-full flex-col bg-beige lg:flex-row">
        <div className="w-full px-5 py-12 lg:w-1/2 center">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif">Location</h1>
            <h2 className="mt-12 text-xl md:text-3xl font-light border-b border-black pb-2 mb-2">SE Club</h2>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 md:gap-y-1">
                <p>주소</p> <p className="justify-self-end text-end">충청남도 태안군 이원면 내리 503</p>
                <p>전화번호</p> <p className="justify-self-end text-end">010-9703-1711 / 010-4668-1704</p>
                <p>체크인/아웃</p> <p className="justify-self-end text-end whitespace-nowrap">숙박시설 15:00 / 11:00 <br /> (반려견) 캠핑장 14:00 / 12:00</p>
              </div>
            </div>
          </div>
          <div className="w-full p-5 lg:w-1/2 lg:self-center">
            <details className="rounded-lg border border-black/20 bg-background">
              <summary className="cursor-pointer p-5 text-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-2">네이버 지도 보기</summary>
              <div className="h-[60svh] min-h-80 max-h-[600px] w-full">
                <NaverMap />
              </div>
            </details>
          </div>
        </section>
    </main>
  );
}
