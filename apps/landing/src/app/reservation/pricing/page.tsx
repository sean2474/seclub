import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllPricing } from "@/lib/room-rates"
import { generateMetadata } from "@/utils/metadata-generator"

export const metadata = generateMetadata("SE Club | 요금 안내", "SE Club의 객실 및 캠핑장 요금 안내")

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
  const { lodgingRates, campingRates, lateCheckoutRates, discounts } = await getAllPricing()
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
          <Table>
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
                  <TableCell className="text-right">{formatCurrency(data.rates.최성수기)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(data.rates.동절기)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(data.longStayDiscount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="text-right mt-4 text-sm text-gray-600">
            <div className="flex flex-col gap-2">
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
          <Table>
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
        <section className="max-w-4xl mx-auto">
          <SectionTitle title="장박 특별 할인" subtitle="Long-stay Discount" />
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-xl font-semibold text-center mb-6">성수기 (3-6월, 9-11월)</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>숙박일</TableHead>
                    <TableHead className="text-right">캠핑 할인율</TableHead>
                    <TableHead className="text-right">숙소 할인율</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(discounts.highSeason.camping).map(([nights, rate]) => (
                    <TableRow key={nights}>
                      <TableCell>{nights}</TableCell>
                      <TableCell className="text-right">{rate}%</TableCell>
                      <TableCell className="text-right">
                        {discounts.highSeason.lodging[nights]}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-center mb-6">동절기 (12-2월)</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>숙박 기간</TableHead>
                    <TableHead className="text-right">할인율</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(discounts.winterSeason).map(([duration, rate]) => (
                    <TableRow key={duration}>
                      <TableCell>{duration}</TableCell>
                      <TableCell className="text-right">{rate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
