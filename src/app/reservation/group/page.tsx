import { ScrollReveal } from "@/components/base/scroll-reveal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-4 md:mb-8">
    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
    {subtitle && <p className="mt-2 text-lg text-gray-600">{subtitle}</p>}
  </div>
)

export default function GroupReservationPage() {
  const lodgingData = [
    { name: "풀빌라 단독주택", units: "7개 동", unitCap: "4명 (6명)", totalCap: "28명 (42명)", notes: "침대 2개" },
    { name: "자쿠지 단독주택", units: "3개 동", unitCap: "4명 (6명)", totalCap: "12명 (18명)", notes: "침대 2개" },
    { name: "캠핑하우스 스페셜형", units: "2개 동", unitCap: "4명 (6명)", totalCap: "8명 (12명)", notes: "침대 2개" },
    {
      name: "호텔형 별장 - 기본형",
      units: "12개 호실",
      unitCap: "2명 (4명)",
      totalCap: "24명 (48명)",
      notes: "침대 1개",
    },
    {
      name: "호텔형 별장 - 확장형",
      units: "4개 호실",
      unitCap: "4명 (6명)",
      totalCap: "16명 (24명)",
      notes: "침대 2개",
    },
  ]
  const lodgingTotal = { totalCap: "88명 (144명)" }

  const activities = [
    { title: "세미나실", description: "워크숍, 회의 등 다양한 목적의 행사를 진행할 수 있습니다." },
    { title: "해양 액티비티", description: "바로 앞 바다에서 바다생태체험, 독살, 바다 낚시, 해수욕을 즐겨보세요." },
    {
      title: "야외 수영장",
      description: "아름다운 오션뷰와 노을뷰를 감상할 수 있는 공용 야외 수영장이 마련되어 있습니다.",
    },
    {
      title: "트레킹 코스",
      description: "인접한 '솔향기 길'(10.2km, 약 4시간 소요)을 따라 자연을 만끽할 수 있습니다.",
    },
    { title: "해산물 미식", description: "인근 '만대항'에서 신선한 자연산 해산물을 맛볼 수 있습니다." },
    { title: "조식 서비스", description: "인근 '만대식당(한식)'에서 조식, 중식, 석식을 이용할 수 있습니다." },
  ]

  return (
    <div className="text-gray-800 font-sans">
      <section className="fixed -z-10 top-0 h-svh w-full overflow-x-hidden">
        <Image src={"/images/reservation/hero.jpg"} sizes="100vw" alt={"SE클럽 객실 전경"} fill className="object-cover" />
        <div className="z-10 absolute w-full h-full top-0 left-0 bg-black/30" />
        <div className="z-10 absolute top-1/2 left-1/2 md:left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-background whitespace-nowrap">
          <ScrollReveal side="top" type="h1"> 기업·단체 예약 </ScrollReveal>
          <ScrollReveal side="bottom" type="p" className="text-xl md:text-2xl mt-4"> SE클럽에서 특별한 행사와 휴양을 계획하세요. </ScrollReveal>
        </div>
      </section>

      <main className="w-full mt-[100svh] bg-background">
        {/* 1. Introduction */}
        <section className="pt-16 md:pt-32 pb-8 md:pb-16 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium leading-snug mb-0 md:mb-6"> 최적의 연수 및 휴양 장소 </h2>
              <p>
                SE클럽은 3만 3천 평의 넓은 대지와 외부인 출입이 제한된 전용 해변을 보유하여, 프라이버시를 보호받으며
                연수·휴양할 수 있는 최적의 장소입니다. 우거진 숲과 청정한 바다에서 기업(단체) 연수, 휴양, 단합 수련회 등
                성공적인 행사를 개최해 보세요.
              </p>
            </div>
            <div className="relative h-96 md:h-[500px]">
              <Image src={"/images/reservation/1.jpg"} alt="SE클럽 소개" fill className="object-cover" />
            </div>
          </div>
        </section>

        {/* 2. Seminar Room */}
        <section className="py-8 md:py-16 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 md:gap-16 items-center">
            <h2 className="text-3xl md:text-4xl font-medium leading-snug mb-2 md:hidden"> 세미나실 </h2>
              <div className="relative h-96 md:h-[500px] overflow-hidden">
                <Image src={"/images/reservation/2.jpg"} alt="세미나실 전경" fill className="object-cover" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-medium leading-snug mb-2 md:mb-6 hidden md:block"> 세미나실 </h2>
                <div className="space-y-2 md:space-y-6 mt-4">
                  <div>
                    <h3 className="text-sm uppercase tracking-wider">면적</h3>
                    <p className="text-xl font-medium mt-1">154.25㎡ (46.7평)</p>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-wider">수용 인원</h3>
                    <p className="text-xl font-medium mt-1">30명 내외</p>
                  </div>
                  <div>
                    <h3 className="text-sm uppercase tracking-wider">구비 비품</h3>
                    <p className="text-xl font-medium mt-1">책상, 의자, 빔 프로젝터 등</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Lodging Facilities */}
        <section className="py-8 md:py-16 px-6 lg:px-8 whitespace-nowrap">
          <div className="max-w-4xl mx-auto">
            <SectionHeader title="숙박 시설 (펜션)" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>단지명</TableHead>
                  <TableHead>동(호실) 수</TableHead>
                  <TableHead>동별 인원(최대)</TableHead>
                  <TableHead>시설별 인원(최대)</TableHead>
                  <TableHead>비고</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lodgingData.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.units}</TableCell>
                    <TableCell>{item.unitCap}</TableCell>
                    <TableCell>{item.totalCap}</TableCell>
                    <TableCell>{item.notes}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold">
                  <TableCell colSpan={3}>총계</TableCell>
                  <TableCell>{lodgingTotal.totalCap}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="text-sm text-gray-600 mt-4 text-right">
              * 동(호실)별 최대 인원 이용 시 침구류 등은 추가로 세팅됩니다.
            </p>
          </div>
        </section>

        {/* 4. Activities */}
        <section className="py-8 md:py-16 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SectionHeader title="부대시설 & 액티비티" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {activities.map((activity) => (
                <div key={activity.title} className="border p-6">
                  <h3 className="text-xl font-semibold mb-2">{activity.title}</h3>
                  <p className="text-gray-600">{activity.description}</p>
                </div>
              ))}
            </div>
            <p className="text-center mt-0 md:mt-8 text-md p-4">
              * <strong>전체 대관:</strong> 전체 시설 이용 시, 이용일정 3개월 전 신청이 필수입니다.
            </p>
          </div>
        </section>

        {/* 6. Contact & History */}
        <section className="py-0 md:py-16 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SectionHeader title="문의 및 현황" />
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">주요 연수 및 행사 현황</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>헬스포츠 인비테이션</li>
                  <li>뮤직카우 임·직원 연중 휴양</li>
                  <li>현대 그린파워 직원 하계 휴양</li>
                  <li>한맥 문학 정기 연수</li>
                  <li>도요타 자동차 RV4 런칭 행사 등</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">문의 안내</h3>
                <div className="space-y-3 text-lg">
                  <p>
                    <span className="font-medium">전화:</span>{" "}
                    <a href="tel:010-9703-1711" className="hover:underline">
                      010-9703-1711
                    </a>
                  </p>
                  <p>
                    <span className="font-medium">이메일:</span>{" "}
                    <a href="mailto:taean2015@naver.com" className="hover:underline">
                      taean2015@naver.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
