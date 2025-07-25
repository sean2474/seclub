import Image from "next/image"
import {
  ShieldCheck,
  Handshake,
  Lock,
  Leaf,
  HeartHandshake,
} from "lucide-react"
import { ScrollReveal } from "@/components/base/scroll-reveal";

export const metadata = {
  title: '소개 | SE클럽',
  description: 'SE클럽(태안둘레길캠핑장)의 역사와 시설, 주변 관광지 정보를 소개합니다.',
};

export default function AboutPage() {
  const coreValues = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "청결 (Cleanliness)",
      description: "업계 평균을 상회하는 위생·안전 기준을 스스로 세우고 지킵니다.",
      color: "blue-500",
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "신뢰 (Trust)",
      description: "투명한 정보와 일관된 서비스로 재방문 고객과의 신뢰 관계를 축적합니다.",
      color: "green-500",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "프라이버시 (Privacy)",
      description: "독립형 공간과 동선 관리로 ‘나만의 시간’을 보장합니다.",
      color: "gray-700",
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "지속 가능성 (Sustainability)",
      description: "지역 사회와 환경을 고려한 경영으로 함께 성장합니다.",
      color: "green-600",
    },
    {
      icon: <HeartHandshake className="w-6 h-6" />,
      title: "배려 (Hospitality)",
      description: "고객 유형·상황별 세심한 배려로 기대 이상의 만족을 제공합니다.",
      color: "red-500",
    },
  ];

  return (
    <div className="font-sans text-wrap overflow-hidden">
      {/* Hero Section */}
      <section className="fixed -z-10 top-0 h-svh w-full overflow-x-hidden text-white">
        <Image src="/images/about/hero.jpg" alt="태안 꾸지나무골 해안의 아름다운 일몰" fill className="absolute inset-0 z-0 object-cover" priority
        />
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center flex-col z-20 p-6 max-w-4xl mx-auto">
          <ScrollReveal type="p" side="top" className="text-xl md:text-2xl font-extralight text-gray-200 mb-4">SE Club Story</ScrollReveal>
          <ScrollReveal type="h1" side="bottom">
            사람과 자연의 가장 편안한 연결
          </ScrollReveal>
        </div>
      </section>

      <main className="w-full mt-[100svh] bg-background">
        {/* SE Club History */}
        <section className="pt-16 md:pt-32 pb-8 md:pb-16 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              <ScrollReveal type="h2" side="top" className="text-sm font-semibold uppercase tracking-wider mb-2 ml-1">Our History</ScrollReveal>
              <ScrollReveal type="h1" side="left" className="text-3xl md:text-4xl font-medium leading-snug mb-0 md:mb-6">
                SE클럽 여정
              </ScrollReveal>
              <ScrollReveal type="p" side="bottom" className="text-lg space-y-6 hidden md:block">
                태안 해안국립공원 꾸지나무골 해안에 자리 잡은 SE클럽은 처음에 자연 속 오토캠핑장으로 여러분께 문을
                열었습니다. 이후 풀빌라, 단독 주택형, 콘도, 캠핑하우스, 반려견 캠핑장 등 다양한 숙박 옵션을 순차
                도입하며 ‘복합 힐링클럽’으로 진화했습니다. 관광농원 오솔길, 조각공원, 전망대를 조성해 김영중·김석우·이필언 
                등 국내 유수 작가 작품을 전시하며 자연과 예술을 결합한 공간으로 자리매김했습니다
              </ScrollReveal>
            </div>
            <ScrollReveal side="right" className="relative h-96 md:h-[500px] overflow-hidden">
              <Image src="/images/about/1.jpg" alt="자연과 예술이 어우러진 조각공원" fill className="object-cover" />
            </ScrollReveal>
            <ScrollReveal type="p" side="bottom" className="text-lg space-y-6 block md:hidden">
              태안 해안국립공원 꾸지나무골 해안에 자리 잡은 SE클럽은 처음에 자연 속 오토캠핑장으로 여러분께 문을
              열었습니다. 이후 풀빌라, 단독 주택형, 콘도, 캠핑하우스, 반려견 캠핑장 등 다양한 숙박 옵션을 순차
              도입하며 ‘복합 힐링클럽’으로 진화했습니다. 관광농원 오솔길, 조각공원, 전망대를 조성해 김영중·김석우·이필언 
              등 국내 유수 작가 작품을 전시하며 자연과 예술을 결합한 공간으로 자리매김했습니다
            </ScrollReveal>
          </div>
        </section>

        {/* Strengths */}
        <section className="py-8 md:py-16 px-6 lg:px-8 bg-beige">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <ScrollReveal type="h2" side="top" className="text-sm font-semibold uppercase tracking-wider mb-2 md:mb-4">Why SE Club</ScrollReveal>
              <ScrollReveal type="h1" side="left" className="text-3xl md:text-4xl font-medium">오직 SE클럽에서만 가능한 경험</ScrollReveal>
            </div>
            <ScrollReveal side="right" className="relative w-full h-[300px] md:h-[500px] overflow-hidden mb-8">
              <Image src="/images/about/2.png" alt="SE클럽의 프라이빗 해변" fill className="object-cover" />
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-4 md:gap-12">
              <ScrollReveal side="left" className="text-left">
                <h3 className="text-xl font-semibold mb-1 md:mb-3">프라이빗 해변 & 오션뷰</h3>
                <p>
                  3만3천평의 전용 백사장에서 외부인 출입 걱정 없이, 어디서나 탁 트인 바다와 황홀한 낙조를 만끽할 수
                  있습니다.
                </p>
              </ScrollReveal>
              <ScrollReveal side="left" delay="100ms" className="text-left">
                <h3 className="text-xl font-semibold mb-1 md:mb-3">폭넓은 숙박 선택지</h3>
                <p>
                  풀빌라, 펜션, 캠핑하우스, 캠핑장(차박·카라반 포함), 반려견 캠핑장 등 취향에 따라 자유롭게 선택하세요.
                </p>
              </ScrollReveal>
              <ScrollReveal side="left" delay="200ms" className="text-left">
                <h3 className="text-xl font-semibold mb-1 md:mb-3">차별화된 문화·체험</h3>
                <p>
                  바다 생태체험, 갯바위낚시, 해루질부터 조각공원 관람까지, 자연과 예술이 어우러진 액티비티를 제공합니다.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Facilities */}
        <section className="py-8 md:py-16 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-16">
              <ScrollReveal side="top" type="h2" className="text-sm font-semibold uppercase tracking-wider mb-2 md:mb-4">
                Facilities & Services
              </ScrollReveal>
              <ScrollReveal side="bottom" type="h1" className="text-3xl md:text-4xl font-medium">완벽한 휴식을 위한 모든 것</ScrollReveal>
            </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <ScrollReveal side="right" className="relative h-[300px] md:h-[500px] overflow-hidden">
                <Image src="/images/about/3.jpg" alt="오션뷰 풀빌라" fill className="object-cover" />
              </ScrollReveal>
              <div className="grid grid-cols-1 gap-y-4 md:gap-y-10 text-lg">
                <ScrollReveal side="left" delay="100ms" className="text-left">
                  <h3 className="text-xl font-semibold mb-1 md:mb-3">휴양별장</h3>
                  <p>풀빌라형·단독 주택형 (스파·자쿠지), 오션 콘도 (기본형·확장형)</p>
                </ScrollReveal>
                <ScrollReveal side="left" delay="200ms" className="text-left">
                  <h3 className="text-xl font-semibold mb-1 md:mb-3">캠핑장</h3>
                  <p>차박·카라반 가능 사이트, 반려견 전용 캠핑 사이트</p>
                </ScrollReveal>
                <ScrollReveal side="left" delay="300ms" className="text-left">
                  <h3 className="text-xl font-semibold mb-1 md:mb-3">부대 시설 및 서비스</h3>
                  <p>공용 시설, 매점, 카페, 장비 대여, 개별 바베큐 존, 수영장, 산책로</p>
                </ScrollReveal>
                <ScrollReveal side="left" delay="400ms" className="text-left">
                  <h3 className="text-xl font-semibold mb-1 md:mb-3">체험 프로그램</h3>
                  <p>해루질, 갯벌/바다 생태체험, 낚시, 농원/조각공원 관람</p>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="pt-8 md:pt-16 pb-16 md:pb-32 px-6 lg:px-8 bg-beige">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-20">
              <ScrollReveal type="h2" side="top" className="text-sm font-semibold uppercase tracking-wider mb-2 md:mb-4">Our Philosophy</ScrollReveal>
              <ScrollReveal type="p" side="left" className="text-3xl md:text-4xl font-medium">우리가 약속하는 가치</ScrollReveal>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-20">
              <ScrollReveal side="left" className="border-l-4 border-gray-800 pl-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Mission</h3>
                <p className="text-xl font-medium">
                  “사람과 자연이 가장 편안하게 연결되는 휴식 경험을 만든다.”
                </p>
              </ScrollReveal>
              <ScrollReveal side="left" className="border-l-4 border-gray-800 pl-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">Vision</h3>
                <p className="text-xl font-medium">
                  “대한민국을 대표하는 프라이빗 휴양 브랜드로서, 지속 가능한 라이프스타일을 제안한다.”
                </p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2.5 md:gap-y-10">
              {coreValues.map((value, idx) => (
                <ScrollReveal side="left" delay={`${idx * 100}ms`} key={value.title}>
                  <div className="flex items-center text-center gap-2 mb-1 md:mb-2 h-10">
                    {value.icon}
                    <h4 className="text-lg font-semibold">{value.title}</h4>
                  </div>
                  <p>{value.description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
