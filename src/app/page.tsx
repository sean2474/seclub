import HeroImage from "@/assets/hero-image";
import ScrollReveal from "@/components/base/scroll-reveal";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* 히어로 섹션 */}
      <section className="relative h-svh w-full text-background">
        <HeroImage images={[
          '/images/hero-1.jpeg',
          '/images/hero-2.jpeg',
          '/images/hero-3.jpeg',
          '/images/hero-4.jpeg',
          '/images/hero-5.jpeg',
        ]} />
        <div className="z-10 absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />

        <div className="absolute inset-0 bg-black/40 flex flex-col items-start md:items-start md:pl-24 lg:pl-48 justify-center text-start p-4 leading-5">
          <ScrollReveal side="top" type="h1" className="mb-8 md:mb-4">
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
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <ScrollReveal side="top" type="h2" className="mb-6">
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
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image 
                  src="https://placehold.co/800x800/png" 
                  alt="SE클럽 전경" 
                  fill 
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 객실 및 간략 소개 */}
      <section className="bg-white relative pt-[60px]">
        <div className="absolute -top-[60px] left-0 w-full h-30 z-10 bg-gradient-to-t from-white to-background" />
        <div className="container mx-auto px-4 mb-12">
          <ScrollReveal side="left" type="h2" className="text-center">
            숙박시설
          </ScrollReveal>
        </div>
        
        {/* 풀빌라 */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <ScrollReveal side="left">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image 
                      src="https://placehold.co/800x450/png" 
                      alt="풀빌라" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </ScrollReveal>
              </div>
              <div className="order-2">
                <ScrollReveal side="right" type="h2" className="text-3xl mb-4">
                  풀빌라
                </ScrollReveal>
                <ScrollReveal side="right" delay="100ms" type="p" className="mb-6">
                  바다를 머금은 프라이빗 풀, <br />
                  온전히 나만의 힐링 공간
                </ScrollReveal>
                <ScrollReveal side="right" delay="200ms">
                  <Button variant="outline" size="lg" className="mt-4">
                    자세히 보기
                  </Button>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
        
        {/* 자쿠지 하우스 */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <ScrollReveal side="left" type="h2" className="mb-2">
                  자쿠지 하우스
                </ScrollReveal>
                <ScrollReveal side="left" delay="100ms" type="p" className="mb-2">
                  밤바다 속 로맨틱 스파, <br />
                  둘만의 기억을 새기다
                </ScrollReveal>
                <ScrollReveal side="left" delay="200ms">
                  <Button variant="outline" size="lg" className="mt-4">
                    자세히 보기
                  </Button>
                </ScrollReveal>
              </div>
              <div className="order-1 md:order-2">
                <ScrollReveal side="right">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image 
                      src="https://placehold.co/800x400/png" 
                      alt="자쿠지 하우스" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
        
        {/* 호텔형 객실 */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-1">
                <ScrollReveal side="left">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image 
                      src="https://placehold.co/800x450/png" 
                      alt="호텔형 객실" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </ScrollReveal>
              </div>
              <div className="order-2">
                <ScrollReveal side="right" type="h2" className="mb-2">
                  호텔형 객실
                </ScrollReveal>
                <ScrollReveal side="right" delay="100ms" type="p" className="mb-2">
                  모던 오션뷰 스테이, <br />
                  발코니 너머 노을을 담다
                </ScrollReveal>
                <ScrollReveal side="right" delay="200ms">
                  <Button variant="outline" size="lg" className="mt-4">
                    자세히 보기
                  </Button>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
        
        {/* 캠핑하우스 */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <ScrollReveal side="left" type="h2" className="mb-2">
                  캠핑하우스
                </ScrollReveal>
                <ScrollReveal side="left" delay="100ms" type="p" className="mb-2">
                  캠핑의 자유로움과 <br />
                  하우스텔 안락함이 만났다
                </ScrollReveal>
                <ScrollReveal side="left" delay="200ms">
                  <Button variant="outline" size="lg" className="mt-4">
                    자세히 보기
                  </Button>
                </ScrollReveal>
              </div>
              <div className="order-1 md:order-2">
                <ScrollReveal side="right">
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image 
                      src="https://placehold.co/800x450/png" 
                      alt="캠핑하우스" 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
        
        {/* 태그 및 마무리 */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal side="bottom">
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">#프리미엄</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">#프라이빗</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">#오션뷰</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">#노을뷰</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">#전용해변</span>
              </div>
              <p className="text-gray-700 mb-8">반려견 동반 객실 완비 · 공용 수영장·자쿠지 사용 가능</p>
              <p className="italic text-secondary">&#34;다가오는 바다빛 노을, SE클럽에서 멈춰버린 시간을 경험하세요.&#34;</p>
            </ScrollReveal>
          </div>
        </section>
      </section>
      
      {/* 고객 후기/리뷰 */}
      
      {/* 프로모션/이벤트 안내 */}

      {/* 객실 및 캠핑 더보기 */}
      <section className="py-16 bg-muted/50 relative mt-[60px] pt-[60px]">
        <div className="absolute -top-[60px] left-0 w-full h-30 z-10 bg-gradient-to-b from-white to-background" />
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">객실 및 캠핑장</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group overflow-hidden rounded-lg">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src="https://placehold.co/600x400/png"
                  alt="객실 미리보기"
                  fill
                  className="object-cover transition-transform group-hover:scale-105 duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">편안한 객실</h3>
                <p className="mb-4">풀빌라부터 호텔형 객실까지 다양한 선택지</p>
                <Link href="/rooms" className="inline-flex items-center text-sm font-medium">
                  더 알아보기
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src="https://placehold.co/600x400/png"
                  alt="캠핑장 미리보기"
                  fill
                  className="object-cover transition-transform group-hover:scale-105 duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold mb-2">자연 속 캠핑</h3>
                <p className="mb-4">바다가 보이는 아늑한 캠핑장</p>
                <a href="/camping" className="inline-flex items-center text-sm font-medium">
                  더 알아보기
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1 h-4 w-4">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
