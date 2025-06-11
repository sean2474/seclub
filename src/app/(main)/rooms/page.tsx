import HeroImage from "@/assets/hero-image";
import { FocusCards } from "@/components/ui/focus-cards";
import Image from "next/image";

export const metadata = {
  title: '객실 | SE클럽',
  description: 'SE클럽의 다양한 객실 정보와 가격을 소개합니다. 풀빌라, 자쿠지 단독주택, 호텔형 객실 등 다양한 선택지가 준비되어 있습니다.',
};

export default function RoomsPage() {
  return (
    <main>
      <section className="relative h-svh w-full">
        <Image src={"/images/room/hero.jpg"} alt={""} fill className="object-cover" />
        <div className="z-10 absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      </section>
      <section>
        <FocusCards cards={[
          {
            title: "해수 풀빌라",
            src: "/images/room/pool-villa.jpg",
          },
          {
            title: "오션 콘도",
            src: "/images/room/ocean-condo.jpg",
          },
          {
            title: "오션스파빌라",
            src: "/images/room/spa-villa.jpg",
          },
          {
            title: "선셋 캠핑 하우스",
            src: "/images/room/camping-house.jpg",
          },
        ]} />
      </section>
    </main>
  );
}