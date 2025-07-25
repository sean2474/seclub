import type React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <AccordionItem value={title}>
    <AccordionTrigger className="text-xl md:text-2xl font-medium rounded-lg hover:bg-beige/30 transition-all duration-300 hover:no-underline p-6">{title}</AccordionTrigger>
    <AccordionContent className="pt-4 text-base text-gray-600 leading-relaxed p-4">{children}</AccordionContent>
  </AccordionItem>
)

const InfoList = ({ items }: { items: React.ReactNode[] }) => (
  <ul className="space-y-3 list-disc pl-5">
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
)

export default function ReservationPage() {
  const refundPolicy = [
    { period: "7일 전 이상", rate: "100%" },
    { period: "6일 전 ~ 5일 전", rate: "70%" },
    { period: "4일 전 ~ 3일 전", rate: "50%" },
    { period: "2일 전 ~ 1일 전", rate: "20%" },
    { period: "예약 당일", rate: "환불 불가" },
  ]

  return (
    <div className="text-gray-800 font-sans">
      <section className="relative flex items-center justify-center text-center mt-[var(--header-height-expanded)] pt-10">
        <div className="relative z-20 p-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">예약 안내</h1>
          <p className="text-lg md:text-xl font-light mt-2">SE클럽 이용을 위한 예약 규정을 안내해 드립니다.</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <Accordion type="single" collapsible className="w-full">
          <Section title="1. 예약 시스템">
            <InfoList
              items={[
                "SE클럽의 모든 시설은 지정 예약제로 24시간 실시간 예약이 가능합니다.",
                <span key="reservation-period">
                  <strong>예약 가능 기간:</strong> 현재 월을 포함하여 최대 3개월 말일까지 예약할 수 있습니다. (예: 7월
                  중 예약 시 10월 31일까지 가능)
                </span>,
                <span key="four-month-reservation">
                  <strong>4개월 차 예약 오픈:</strong> 매월 말일 24:00에 다음 분기 예약이 자동으로 오픈됩니다. (예: 4월
                  예약은 1월 31일 24:00부터 가능)
                </span>,
                <span key="special-reservation">
                  <strong>특별 예약:</strong> 3개월 이후 일정에 3박 이상 확정된 경우, 또는 시스템 이용이 번거로우실 때는
                  예약 담당자(☎ 010-9703-1711)에게 문의해 주세요.
                </span>,
              ]}
            />
          </Section>

          <Section title="2. 결제 안내">
            <InfoList
              items={[
                "예약 완료 후 안내된 기한 내에 온라인 결제를 반드시 완료해야 하며, 기한 초과 시 예약은 자동 취소됩니다.",
                "결제 시 '예약자 이름'을 정확히 입력해 주세요. (예: 홍길동 ✓ / 홍 길동, 홍길동1/1 ✕)",
                "현금 또는 현장 카드 결제는 불가능하며, 직접 방문 시에도 처리되지 않습니다.",
              ]}
            />
          </Section>

          <Section title="3. 예약 변경">
            <InfoList
              items={[
                <span key="schedule-change">
                  <strong>일정 변경:</strong> 1회에 한해 예약일 3일 전까지 가능합니다.
                </span>,
                <span key="site-change">
                  <strong>사이트 변경:</strong> 1회에 한해 가능합니다.
                </span>,
                <div key="change-procedure">
                  <strong>변경 절차:</strong>
                  <ol className="list-decimal pl-5 mt-2 space-y-1">
                    <li>예약 시스템에서 원하는 날짜/사이트로 신규 예약을 진행합니다.</li>
                    <li>
                      <strong>(중요)</strong> 신규 예약 건에 결제하지 말고, 기존 예약은 그대로 유지합니다.
                    </li>
                    <li>
                      &quot;일정 변경 요청&quot; 또는 &quot;사이트 변경 요청&quot; 문자를 예약 담당자(☎ 010-9703-1711)에게 발송합니다.
                    </li>
                  </ol>
                </div>,
              ]}
            />
          </Section>

          <Section title="4. 예약 취소 및 환불">
            <div className="space-y-6">
              <InfoList
                items={[
                  "예약 시스템에서 직접 취소 신청이 가능합니다.",
                  "취소 시 예약 번호, 예약자명, 환불받을 은행명, 계좌번호를 정확히 입력해야 합니다.",
                  "환불은 매주 목요일에 처리되며, 신청일로부터 최대 7일 이내 지정 계좌로 입금됩니다.",
                  "예약 변경 후 취소 시, 처음 변경 신청일과 최종 취소 신청일 중 고객에게 더 불리한 환불 규정을 적용합니다.",
                ]}
              />
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">환불 규정</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>취소 시점</TableHead>
                      <TableHead className="text-right">환불 비율</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {refundPolicy.map((policy) => (
                      <TableRow key={policy.period}>
                        <TableCell className="font-medium">{policy.period}</TableCell>
                        <TableCell className="text-right">{policy.rate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Section>

          <Section title="5. 유의사항">
            <InfoList
              items={[
                "풀장 운영 기간은 6월 중순 ~ 9월 중순이며, 확정 일정은 공지를 통해 별도 안내됩니다.",
                "22:00 이후 도착 시 야간 담당자(☎ 010-6343-1711)에게 사전 연락이 필수입니다.",
                "예약된 인원·차량 초과 시 입장이 불가하며, 이는 환불 사유가 되지 않습니다.",
                "구내 차량 운행은 08:00~22:00, 제한속도 20km/h를 준수해야 하며 상향등·클락션 사용을 금지합니다.",
                "반려동물은 지정된 숙소 및 캠핑장 외에는 반입이 금지되며, 위반 시 입장이 거부될 수 있습니다.",
                "객실 내 직화 조리 및 화재 위험 물품(개인 가스레인지, 그릴, 양초 등) 반입을 금지합니다.",
                "야외 화로 사용 시 반드시 화로대와 받침대를 사용하고, 재는 지정된 재통에 버려주세요.",
                "22:00 이후 고성방가, 과도한 음향기기 사용 등 민원 발생 시 퇴장 조치될 수 있습니다.",
                "청소년 보호법에 따라 미성년자는 보호자 동반 없이 단독 입실 및 혼숙이 불가합니다.",
                "수영장에서는 다이빙을 금지하며, 반드시 보호자의 감독 하에 이용해야 합니다.",
                "해변 체험 활동 시 만조·간조 시간을 반드시 확인하여 안전에 유의하시기 바랍니다.",
                "시설물 파손 및 개인 소지품 분실에 대한 책임은 이용자 본인에게 있습니다.",
              ]}
            />
          </Section>
        </Accordion>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold mb-4">Contact</h3>
          <div className="space-y-2 text-lg">
            <p>
              예약·변경·취소 문의:{" "}
              <a href="tel:010-9703-1711" className="font-semibold hover:underline">
                010-9703-1711
              </a>
            </p>
            <p>
              관리실 (현장 문의):{" "}
              <a href="tel:010-6343-1711" className="font-semibold hover:underline">
                010-6343-1711
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
