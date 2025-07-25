import HeroImage from "@/assets/hero-image";
import { ScrollReveal } from "@/components/base/scroll-reveal";
import { Button } from "@/components/ui/button";
import { ImageSlider } from "@/components/ui/image-slider";
import { NaverMap } from "@/components/ui/naver-map";
import { roomData } from "@/const/room-data";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="fixed top-0 h-svh w-full overflow-x-hidden text-background" suppressHydrationWarning>
        <HeroImage images={[
          '/images/landing/hero-2.jpeg',
          '/images/landing/hero-5.jpg',
          '/images/landing/hero-4.jpeg',
          '/images/landing/hero-1.jpeg',
          '/images/landing/hero-3.jpeg',
        ]} />
        <div className="absolute z-20 inset-0 bg-black/30 flex flex-col items-start md:items-start md:pl-24 lg:pl-48 justify-center text-start p-4">
          <ScrollReveal side="top" type="p" className="mb-1 md:mb-2 ml-1.5 font-medium">
            당신만의 힐링
          </ScrollReveal>
          <ScrollReveal side="top" type="h1" className="mb-4 md:mb-6 font-medium">
            <span className="font-thin">SE클럽에서 누리는</span><br />
            완벽한 휴식
          </ScrollReveal>
          <ScrollReveal side="bottom" className="ml-1">
            <Link href={"https://m.thankqcamping.com/resv/view.hbb?cseq=1537&path=RP"} target="_blank" className="border border-background pl-4 pr-1.5 py-2 text-sm md:pl-5 md:pr-2.5 md:py-3 bg-background text-foreground hover:text-background hover:bg-transparent hover:font-medium transition-all duration-300 md:text-md flex items-center gap-2 rounded-xs">
              지금 예약하기 <ChevronRight strokeWidth={1} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
      <main className="flex flex-col min-h-screen overflow-x-hidden translate-y-[100svh] mb-[100svh]" suppressHydrationWarning>
        {/* 소개 섹션 */}
        <section className="py-16 md:py-32 w-full center bg-background relative">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 items-center max-w-4xl mx-4">
            <ScrollReveal side="top" type="h2" className="font-medium text-center md:hidden">
              당신만을 위한 특별한 공간
            </ScrollReveal>
            <div className="order-2 md:order-1 text-center md:text-left">
              <ScrollReveal side="top" type="h2" className="font-medium hidden md:block">
                당신만을 위한 특별한 공간
              </ScrollReveal>
              <ScrollReveal side="left" delay="100ms" type="p" className="mt-6">
                33,000평의 드넓은 부지 위에 자리한 SE 클럽은 외부인의 출입이 제한된 전용 해변과 눈부신 백사장을 갖춘 프라이빗한 공간입니다.
              </ScrollReveal>
              <ScrollReveal side="left" delay="200ms" type="p" className="">
                타인의 시선을 걱정하지 않고, 오직 당신만의 속도로 휴식을 만끽할 수 있습니다.
              </ScrollReveal>
              <ScrollReveal side="left" delay="300ms" type="p">
                가족, 연인, 친구와 함께라면 더욱 특별해지는 곳. 편안함과 여유, 그리고 따뜻한 추억이 머무는 공간입니다.
              </ScrollReveal>
            </div>
            <div className="order-1 md:order-2 mt-6 md:mt-0">
              <ScrollReveal side="right">
                <div className="relative aspect-square overflow-hidden mx-auto max-w-[200px] md:max-w-5xl">
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
        <section className="bg-green-900 center py-12 md:py-32 w-full text-white relative">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 w-full">
            <ScrollReveal side="left" className="px-5 mt-10 md:mt-0 order-2 md:order-1">
              <ImageSlider slides={[{
                img: "/images/wellness/walk/hero.jpg",
                title: "산책로",
                description: "아름다운 숲길과 해안길 코스",
                href: "/wellness/walk"
              }, {
                img: "/images/wellness/swimming-pool/hero.jpg",
                title: "수영장",
                description: "바다 내음 가득 전용 야외 풀장",
                href: "/wellness/swimming-pool"
              }, {
                img: "/images/wellness/photo-spot/hero.jpg",
                title: "포토스팟",
                description: "환상적인 바다 전망 포토존",
                href: "/wellness/photo-spot"
              }, {
                img: "/images/wellness/nature-experience/hero.jpg",
                title: "자연 체험 프로그램",
                description: "생태 관찰 및 자연 체험",
                href: "/wellness/nature-experience"
              }, {
                img: "/images/wellness/facility/hero.jpg",
                title: "부대시설",
                description: "카페·라운지 등 편의 시설",
                href: "/wellness/facility"
              }, {
                img: "/images/wellness/special-activity/hero.jpg",
                title: "조각공원",
                description: "예술과 자연이 어우러진 조각공원",
                href: "/wellness/special-activity"
              }]} />
            </ScrollReveal>
            <ScrollReveal side="right" className="center order-1 md:order-2">
              <div className="center flex-col md:absolute md:top-1/2 md:-translate-y-1/2 md:left-3/4 md:-translate-x-1/2">
                <h3 className="text-3xl md:text-5xl font-serif">Wellness</h3>
                <h4 className="mt-2">SECLUB</h4>
              </div>
            </ScrollReveal>
          </div>
        </section>
        <section className="text-black center px-4 pt-12 md:pt-32 bg-background">
          <div className="w-full max-w-4xl divide-y pb-10 md:pb-20">
            <ScrollReveal side="left" type="h2" className="font-serif font-bold pb-10">Stay & Lodge</ScrollReveal>
            <div className="divide-y">
              <ScrollReveal side="left" delay="0ms" revealHeight="10%" className="relative">
                <Link className="group" href={`/rooms/${roomData[0].slug}`}>
                  <div className="relative w-full h-24 md:h-32">
                    <Image src={roomData[0].image} alt={roomData[0].title} fill className="object-cover group-hover:opacity-100 group-active:opacity-100 opacity-1 transition-all duration-300" />
                  </div>
                  <div className="absolute w-full h-full top-0 left-0 flex justify-between items-center group-hover:text-white group-active:text-white p-4 md:p-10">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-2xl">{roomData[0].title}</h3>
                      <p className="text-sm group-hover:text-base group-active:text-base">{roomData[0].description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      자세히보기 <ChevronRight strokeWidth={1} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
              <ScrollReveal side="left" delay="0ms" revealHeight="10%" className="relative">
                <Link className="group" href={`/rooms/${roomData[1].slug}`}>
                  <div className="relative w-full h-24 md:h-32">
                    <Image src={roomData[1].image} alt={roomData[1].title} fill className="object-cover group-hover:opacity-100 group-active:opacity-100 opacity-1 transition-all duration-300" />
                  </div>
                  <div className="absolute w-full h-full top-0 left-0 flex justify-between items-center group-hover:text-white group-active:text-white p-4 md:p-10">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-2xl">{roomData[1].title}</h3>
                      <p className="text-sm group-hover:text-base group-active:text-base">{roomData[1].description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      자세히보기 <ChevronRight strokeWidth={1} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
              <ScrollReveal side="left" delay="0ms" revealHeight="10%" className="relative">
                <Link className="group" href={`/rooms/${roomData[1].items[1].href}`}>
                  <div className="relative w-full h-24 md:h-32">
                    <Image src={roomData[1].image} alt={roomData[1].items[1].title} fill className="object-cover group-hover:opacity-100 group-active:opacity-100 opacity-1 transition-all duration-300" />
                  </div>
                  <div className="absolute w-full h-full top-0 left-0 flex justify-between items-center group-hover:text-white group-active:text-white p-4 md:p-10">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-2xl">{roomData[1].items[1].title}</h3>
                      <p className="text-sm group-hover:text-base group-active:text-base">{roomData[1].description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      자세히보기 <ChevronRight strokeWidth={1} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
              <ScrollReveal side="left" delay="0ms" revealHeight="10%" className="relative">
                <Link className="group" href={`/rooms/${roomData[2].slug}`}>
                  <div className="relative w-full h-24 md:h-32">
                    <Image src={roomData[2].image} alt={roomData[2].title} fill className="object-cover group-hover:opacity-100 group-active:opacity-100 opacity-1 transition-all duration-300" />
                  </div>
                  <div className="absolute w-full h-full top-0 left-0 flex justify-between items-center group-hover:text-white group-active:text-white p-4 md:p-10">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-2xl">{roomData[2].title}</h3>
                      <p className="text-sm group-hover:text-base group-active:text-base">{roomData[2].description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      자세히보기 <ChevronRight strokeWidth={1} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
              <ScrollReveal side="left" delay="0ms" revealHeight="10%" className="relative">
                <Link className="group" href={`/rooms/${roomData[3].slug}`}>
                  <div className="relative w-full h-24 md:h-32">
                    <Image src={roomData[3].image} alt={roomData[3].title} fill className="object-cover group-hover:opacity-100 group-active:opacity-100 opacity-1 transition-all duration-300" />
                  </div>
                  <div className="absolute w-full h-full top-0 left-0 flex justify-between items-center group-hover:text-white group-active:text-white p-4 md:p-10">
                    <div>
                      <h3 className="text-xl font-semibold group-hover:text-2xl">{roomData[3].title}</h3>
                      <p className="text-sm group-hover:text-base group-active:text-base">{roomData[3].description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      자세히보기 <ChevronRight strokeWidth={1} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>
        <section className="md:h-[65svh] flex w-dvw flex-col lg:flex-row bg-beige">
          <div className="w-full p-5 md:p-0 lg:w-1/2 h-full center">
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
          <div className="w-full lg:w-1/2 h-96 md:h-full mt-5 md:mt-0">
            <NaverMap />
          </div>
        </section>
      </main>
    </div>
  );
}
