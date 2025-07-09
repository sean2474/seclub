import HeroImage from "@/assets/hero-image";
import ScrollReveal from "@/components/base/scroll-reveal";
import { Button } from "@/components/ui/button";
import { ImageSlider } from "@/components/ui/image-slider";
import { NaverMap } from "@/components/ui/naver-map";
import { roomData } from "@/const/room-data";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen overflow-x-hidden">
      {/* 히어로 섹션 */}
      <section className="relative h-svh w-full text-background">
        <HeroImage images={[
          '/images/landing/hero-1.jpeg',
          '/images/landing/hero-2.jpeg',
          '/images/landing/hero-3.jpeg',
          '/images/landing/hero-4.jpeg',
          '/images/landing/hero-5.jpeg',
        ]} />
        <div className="z-10 absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />

        <div className="absolute inset-0 bg-black/40 flex flex-col items-start md:items-start md:pl-24 lg:pl-48 justify-center text-start p-4 leading-8">
          <ScrollReveal side="top" type="h1" className="mb-8 md:mb-4 font-medium">
            {/* 당신만의 힐링, 자연 속에서 */}
            <span className="font-thin">프라이빗 비치만이 <br />선사하는 </span>
            완벽한 휴식
          </ScrollReveal>
          <ScrollReveal side="bottom" className="ml-1">
            <Button size={"lg"}>
              <Link href="/reservation" className="">
                지금 예약하기
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* 소개 섹션 */}
      <section className="py-32 w-full center px-48">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <ScrollReveal side="top" type="h2" className="mb-6 font-medium">
              당신만을 위한 특별한 공간
            </ScrollReveal>
            <ScrollReveal side="left" delay="100ms" type="p">
              33,000평의 드넓은 부지 위에 자리한 SE 클럽은 외부인의 출입이 제한된 전용 해변과 눈부신 백사장을 갖춘 프라이빗한 공간입니다.
            </ScrollReveal>
            <ScrollReveal side="left" delay="200ms" type="p" className="mb-4">
              타인의 시선을 걱정하지 않고, 오직 당신만의 속도로 휴식을 만끽할 수 있습니다.
            </ScrollReveal>
            <ScrollReveal side="left" delay="300ms" type="p">
              가족, 연인, 친구와 함께라면 더욱 특별해지는 곳. 편안함과 여유, 그리고 따뜻한 추억이 머무는 공간입니다.
            </ScrollReveal>
          </div>
          <div className="order-1 md:order-2">
            <ScrollReveal side="right">
              <div className="relative aspect-square overflow-hidden">
                <Image 
                  src="/images/landing/section-1.jpg" 
                  alt="SE클럽 전경" 
                  fill 
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <section className="bg-green-900 center py-32 grid grid-cols-2 relative text-white mb-32">
        <div className="pl-48">
          <ScrollReveal side="left">
            <ImageSlider slides={[{
              img: "/images/wellness/walk.jpg",
              title: "산책로",
              description: "아름다운 숲길과 해안길 코스",
              href: "/wellness/walk"
            }, {
              img: "/images/wellness/swimming-pool.jpg",
              title: "수영장",
              description: "바다 내음 가득 전용 야외 풀장",
              href: "/wellness/swimming-pool"
            }, {
              img: "/images/wellness/photo-spot.jpg",
              title: "포토스팟",
              description: "환상적인 바다 전망 포토존",
              href: "/wellness/photo-spot"
            }, {
              img: "/images/wellness/nature-experience.jpg",
              title: "자연 체험 프로그램",
              description: "생태 관찰 및 자연 체험",
              href: "/wellness/nature-experience"
            }, {
              img: "/images/wellness/facility.jpg",
              title: "부대시설",
              description: "카페·라운지 등 편의 시설",
              href: "/wellness/facility"
            }, {
              img: "/images/wellness/special-activity.jpg",
              title: "조각공원",
              description: "예술과 자연이 어우러진 조각공원",
              href: "/wellness/special-activity"
            }]} />
          </ScrollReveal>
        </div>
        <ScrollReveal side="right" className="center flex-col">
          <h3 className="text-5xl font-serif">Wellness</h3>
          <h4 className="text-2xl mt-2">SECLUB</h4>
        </ScrollReveal>
      </section>
      <section className="px-48 text-black divide-y pb-20">
        <ScrollReveal side="left" type="h2" className="font-serif font-bold pb-10">Stay & Lodge</ScrollReveal>
        <div className="divide-y">
          {roomData.map((item, idx) => (
            <ScrollReveal side="left" delay={`${idx * 100}ms`} key={idx} className="relative">
              <Link className="group" href={`/rooms/${item.slug}`}>
                <div className="relative w-full h-32">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:opacity-100 opacity-1 transition-all duration-300" />
                </div>
                <div className="absolute w-full h-full top-0 left-0 flex justify-between items-center group-hover:text-white p-10">
                  <div className="">
                    <h3 className="text-xl font-semibold group-hover:text-2xl">{item.title}</h3>
                    <p className="text-sm group-hover:text-base">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    자세히보기 <ChevronRight strokeWidth={1} />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>
      <section className="h-[65svh] flex w-dvw flex-col lg:flex-row bg-beige">
        <div className="w-full lg:w-1/2 h-full center">
          <div>
            <ScrollReveal side="left" className="text-5xl font-serif">Location</ScrollReveal>
            <ScrollReveal side="left" delay="100ms" className="mt-12 text-3xl font-light border-b border-black pb-2 mb-2">SECLUB</ScrollReveal> 
            <ScrollReveal side="left" delay="200ms" className="grid grid-cols-2 gap-y-1">
              <p>주소</p> <p className="justify-self-end">충청남도 태안군 이원면 내리 503</p>
              <p>전화번호</p> <p className="justify-self-end">010-9703-1711 / 010-4668-1704</p>
              <p>체크인/아웃</p> <p className="justify-self-end">15:00 ~ 11:00</p>
            </ScrollReveal>
          </div>
        </div>
        <div className="w-full lg:w-1/2 h-full">
          <NaverMap />
        </div>
      </section>
    </main>
  );
}
