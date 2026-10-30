import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@seclub/ui/table"
import { getAllPricing } from "@/lib/room-rates"
import { generateMetadata } from "@/utils/metadata-generator"

export const revalidate = 3600
export const metadata = generateMetadata("SE Club | 요금 안내", "SE Club의 객실 및 캠핑장 요금 안내")

// 2026년 11월~2027년 한달살기·캠핑 장박 공지 기준.
const monthlyStayRates = [
  { name: "오션 콘도 스탠다드", capacity: "2명 / 4명", allocation: "5실", fourWeeks: 1690000, fourWeekDiscount: 59, twoWeeks: 920000, twoWeekDiscount: 56 },
  { name: "오션 콘도 디럭스", capacity: "4명 / 6명", allocation: "2실", fourWeeks: 2490000, fourWeekDiscount: 60, twoWeeks: 1360000, twoWeekDiscount: 56 },
  { name: "선셋 캠핑하우스", capacity: "4명 / 6명", allocation: "1동", fourWeeks: 2790000, fourWeekDiscount: 60, twoWeeks: 1530000, twoWeekDiscount: 56 },
  { name: "해수 풀빌라", capacity: "4명 / 6명", allocation: "3동", fourWeeks: 2890000, fourWeekDiscount: 60, twoWeeks: 1580000, twoWeekDiscount: 56 },
  { name: "오션 스파빌라", capacity: "4명 / 6명", allocation: "1동", fourWeeks: 3490000, fourWeekDiscount: 61, twoWeeks: 1910000, twoWeekDiscount: 57 },
]

// 할인율은 공지 원문 표기 기준: https://cafe.naver.com/taeancamp/16955
const campingLongStayRates = [
  { name: "일반 텐트 · 일반 사이트", winter: 299000, winterDiscount: 78, summer: 349000, summerDiscount: 75 },
  { name: "일반 텐트 · S 사이트", winter: 379000, winterDiscount: 77, summer: 429000, summerDiscount: 74 },
  { name: "카라반 · 캠핑카 · 폴딩트레일러", winter: 359000, winterDiscount: 78, summer: 429000, summerDiscount: 74 },
]

const formatCurrency = (value?: number) => {
  if (value === undefined) return "-"
  return `${value.toLocaleString()}원`
}

const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-4 md:mb-8">
    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 whitespace-nowrap break-keep">{subtitle}</h2>
    <p className="text-3xl md:text-4xl font-medium text-gray-900">{title}</p>
  </div>
)

export default async function PricingPage() {
  const { lodgingRates, campingRates, lateCheckoutRates } = await getAllPricing()
  return (
    <div className="text-gray-800 font-sans">
      <section className="relative flex items-center justify-center text-center mt-[var(--header-height-expanded)] pt-10">
        <div className="relative z-20 p-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">요금 안내</h1>
          <p className="text-lg md:text-xl font-light mt-2">SE Club의 다양한 숙소와 캠핑장 요금을 확인하세요.</p>
        </div>
      </section>

      <main className="container mx-auto px-6 lg:px-8 py-6 md:py-12 space-y-8 md:space-y-12">
        {/* Lodging Section */}
        <section className="max-w-4xl mx-auto">
          <SectionTitle title="프리미엄 숙박 시설" subtitle="Premium Lodging" />
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>시설</TableHead>
                  <TableHead className="text-right">최성수기</TableHead>
                  <TableHead className="text-right">성수기/동절기</TableHead>
                  <TableHead className="text-right">연박할인</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(lodgingRates).map(([name, data]) => (
                  <TableRow key={name}>
                    <TableCell className="font-medium">{name}</TableCell>
                    {name === "프리미엄 빌라" ? (
                      <TableCell colSpan={3} className="text-right">별도문의</TableCell>
                    ) : (
                      <>
                        <TableCell className="text-right">{formatCurrency(data.rates.최성수기)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(data.rates.동절기)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(data.longStayDiscount)}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="text-right mt-4 text-sm text-gray-600">
            <div className="flex flex-col gap-2">
              <span>* 별도문의 : 010-9703-1711</span>
              <span>* 최성수기(7~8월), 성수기(3~6월, 9~11월), 동절기(12~2월)</span>
              <span>* 연박할인: 성수기/동절기</span>
              <span>* 시설별 기준인원 초과시 1인당 1박에 20,000원 추가 부과</span>
              <span>* 반려견 동반 이용 시 1마리당 1박에 10,000원 추가 부과</span>
            </div>
          </div>
        </section>

        {/* Condo & Camping Section */}
        <section className="max-w-4xl mx-auto">
          <SectionTitle title="캠핑장" subtitle="Campsite" />
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead>사이트</TableHead>
                  <TableHead className="text-right">최성수기</TableHead>
                  <TableHead className="text-right">성수기/동절기</TableHead>
                  <TableHead className="text-right">연박할인</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(campingRates)
                  .filter(([site]) => site !== "연박할인")
                  .map(([site, data]) => (
                    <TableRow key={site}>
                      <TableCell className="font-medium">{site}</TableCell>
                      <TableCell className="text-right">{formatCurrency(data.rates.최성수기)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(data.rates.동절기)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(data.longStayDiscount)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="text-right mt-4 text-sm text-gray-600">
            <div className="flex flex-col gap-2">
              <span>* 최성수기(7~8월), 성수기(3~6월, 9~11월), 동절기(12~2월)</span>
              <span>* 연박할인: 성수기/동절기</span>
            </div>
          </div>
        </section>
        {/* Late Checkout Section */}
        <section className="max-w-4xl mx-auto">
          <SectionTitle title="시간 연장 요금 안내" subtitle="Late Check-out" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>시설</TableHead>
                <TableHead className="text-right">3시간 연장</TableHead>
                <TableHead className="text-right">6시간 연장</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lateCheckoutRates.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item["3시간"])}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item["6시간"])}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Long Stay Discount Section */}
        <section id="long-stay-discount" className="max-w-4xl mx-auto">
          <SectionTitle title="장박 특별 할인" subtitle="Long-stay Discount" />
          <p className="text-center text-gray-600 mb-8">2026년 11월 ~ 2027년 예약 안내</p>
          <div className="space-y-10">
            <div>
              <h3 id="monthly-stay-title" className="text-xl font-semibold text-center mb-2">숙박시설 한달살기</h3>
              <p className="text-center text-sm text-gray-600 mb-6">2주 또는 4주 · 평일·주말 제한 없이 이용 · 정상 이용료 대비 최대 61% 할인</p>
              <p className="text-xs text-gray-600 mb-2 md:hidden">표를 좌우로 밀어 전체 요금과 이용 조건을 확인하세요.</p>
              <Table className="min-w-[680px]" aria-labelledby="monthly-stay-title">
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">시설</TableHead>
                    <TableHead scope="col" className="text-right">4주 이용료</TableHead>
                    <TableHead scope="col" className="text-right">2주 이용료</TableHead>
                    <TableHead scope="col">기준 / 최대 인원</TableHead>
                    <TableHead scope="col" className="text-right">월 한정 수량</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyStayRates.map((item) => (
                    <TableRow key={item.name}>
                      <TableHead scope="row" className="text-gray-900">{item.name}</TableHead>
                      <TableCell className="text-right whitespace-nowrap">
                        <span className="font-semibold">{formatCurrency(item.fourWeeks)}</span>
                        <span className="block text-xs text-gray-600 mt-1">{item.fourWeekDiscount}% 할인</span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <span className="font-semibold">{formatCurrency(item.twoWeeks)}</span>
                        <span className="block text-xs text-gray-600 mt-1">{item.twoWeekDiscount}% 할인</span>
                      </TableCell>
                      <TableCell>{item.capacity}</TableCell>
                      <TableCell className="text-right">{item.allocation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>요청 시 객실 재세팅을 진행해 드립니다.</li>
                <li>반려견 최대 2마리 동반 가능 · 동반 이용료 면제 (1일·1마리당 10,000원)</li>
                <li>기준 차량은 모든 시설 1대이며, 초과 시 일별 차량 1대당 10,000원, 인원 1명당 20,000원이 부과됩니다.</li>
                <li>월 배정 객실 예약 완료 시 마감되며, 조기 마감될 수 있습니다.</li>
              </ul>
            </div>
            <div>
              <h3 id="camping-long-stay-title" className="text-xl font-semibold text-center mb-2">캠핑 장박</h3>
              <p className="text-center text-sm text-gray-600 mb-6">4주 기준 · 평일·주말 제한 없이 이용 · 정상 이용료 대비 최대 78% 할인</p>
              <p className="text-xs text-gray-600 mb-2 md:hidden">표를 좌우로 밀어 전체 요금을 확인하세요.</p>
              <Table className="min-w-[560px]" aria-labelledby="camping-long-stay-title">
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">이용 유형</TableHead>
                    <TableHead scope="col" className="text-right">동절기 (11월~2월)<span className="block text-xs mt-1">월 25사이트 한정</span></TableHead>
                    <TableHead scope="col" className="text-right">하계 (3월~10월)<span className="block text-xs mt-1">월 15사이트 한정</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campingLongStayRates.map((item) => (
                    <TableRow key={item.name}>
                      <TableHead scope="row" className="text-gray-900">{item.name}</TableHead>
                      <TableCell className="text-right whitespace-nowrap">
                        <span className="font-semibold">{formatCurrency(item.winter)}</span>
                        <span className="block text-xs text-gray-600 mt-1">{item.winterDiscount}% 할인</span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <span className="font-semibold">{formatCurrency(item.summer)}</span>
                        <span className="block text-xs text-gray-600 mt-1">{item.summerDiscount}% 할인</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>사전 이용 최대 2박 · 퇴장 후 14일 이내 장박 결정 시 사전 이용료를 장박 이용료에서 차감해 드립니다.</li>
                <li>반려견 최대 2마리 동반 가능 · 동반 이용료 면제 (1일·1마리당 5,000원)</li>
                <li>기준 인원 4명, 차량 1대 · 초과 시 일별 차량 1대당 10,000원, 인원 1명당 10,000원이 추가됩니다.</li>
                <li>캠핑 장비는 이용 고객께서 직접 유지·관리해 주셔야 합니다. 바람·눈 등으로 텐트에 특별한 이상이 있는 경우 관리자가 사진을 촬영해 안내해 드립니다.</li>
                <li>월별 장박 사이트 예약 완료 시 마감됩니다.</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                <a href="https://cafe.naver.com/taeancamp/16955" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">캠핑 장박 공지 원문 보기 (새 창)</a>
              </p>
            </div>
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>예약 신청 및 상담: <a href="tel:01097031711" className="font-semibold text-gray-900 underline underline-offset-4">010-9703-1711</a></p>
              <p>직접 방문하여 객실과 사이트를 둘러보신 후 상담하셔도 좋습니다.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
