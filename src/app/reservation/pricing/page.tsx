import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { campingRates, condoRates, discounts, lodgingRates } from "@/const/pricing"

const formatCurrency = (value?: number) => {
  if (value === undefined) return "-"
  return `${value.toLocaleString()}원`
}

const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-12 md:mb-16">
    <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">{subtitle}</h2>
    <p className="text-3xl md:text-4xl font-medium text-gray-900">{title}</p>
  </div>
)

export default function PricingPage() {
  return (
    <div className="text-gray-800 font-sans">
      <section className="relative flex items-center justify-center text-center mt-[var(--header-height-expanded)] pt-10">
        <div className="relative z-20 p-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">요금 안내</h1>
          <p className="text-lg md:text-xl font-light mt-2">SE클럽의 다양한 숙소와 캠핑장 요금을 확인하세요.</p>
        </div>
      </section>

      <main className="container mx-auto px-6 lg:px-8 py-12 md:py-24 space-y-24 md:space-y-32">
        {/* Lodging Section */}
        <section className="max-w-4xl mx-auto">
          <SectionTitle title="프리미엄 숙박 시설" subtitle="Premium Lodging" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>시설</TableHead>
                <TableHead className="text-right">최성수기</TableHead>
                <TableHead className="text-right">동절기</TableHead>
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
        </section>

        {/* Condo & Camping Section */}
        <section className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionTitle title="오션 콘도" subtitle="Ocean Condo" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>타입</TableHead>
                    <TableHead className="text-right">최성수기</TableHead>
                    <TableHead className="text-right">성수기/동절기</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(condoRates).map(([type, rates]) => (
                    <TableRow key={type}>
                      <TableCell className="font-medium">{type}</TableCell>
                      <TableCell className="text-right">{formatCurrency(rates.최성수기)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(rates.성수기)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <SectionTitle title="캠핑장" subtitle="Campsite" />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>사이트</TableHead>
                    <TableHead className="text-right">최성수기</TableHead>
                    <TableHead className="text-right">성수기/동절기</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(campingRates)
                    .filter(([site]) => site !== "연박할인")
                    .map(([site, rates]) => (
                      <TableRow key={site}>
                        <TableCell className="font-medium">{site}</TableCell>
                        <TableCell className="text-right">{formatCurrency(rates.최성수기)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(rates.성수기)}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <p className="text-right mt-4 text-sm text-gray-600">
                * 성수기/동절기 연박 시 {formatCurrency(campingRates["연박할인"].성수기)} 할인
              </p>
            </div>
          </div>
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
                  {Object.entries(discounts.highSeason.camping).map(([nights]) => (
                    <TableRow key={nights}>
                      <TableCell>{nights}박 이상</TableCell>
                      <TableCell className="text-right">
                        {discounts.highSeason.camping[nights as unknown as keyof typeof discounts.highSeason.camping]}%
                      </TableCell>
                      <TableCell className="text-right">
                        {discounts.highSeason.lodging[nights as unknown as keyof typeof discounts.highSeason.lodging]}%
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
