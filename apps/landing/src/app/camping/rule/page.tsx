import { Clock, ListChecks, Info, PlusCircle, PawPrint } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateMetadata } from "@/utils/metadata-generator";

export const metadata = generateMetadata("SE클럽 | 캠핑장 이용 안내", "SE클럽 캠핑장의 이용 안내 및 시설 정보");

export default function CampsiteInfoPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-12 mt-[var(--header-height-expanded)]">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">캠핑장 이용 안내</h1>
          <p className="mt-3 text-base text-foreground/80">즐겁고 편안한 캠핑을 위해 아래 내용을 확인해주세요.</p>
        </header>

        <main className="space-y-8">
          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold border-b border-foreground/50 pb-2 mb-4">
              <Clock className="w-5 h-5 text-foreground/80" />
              시간 안내
            </h2>
            <Card>
              <CardContent className="p-6 grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-foreground/80">체크인</p>
                  <p className="text-lg font-semibold mt-1">오후 2시 이후</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/80">체크아웃</p>
                  <p className="text-lg font-semibold mt-1">낮 12시 이전</p>
                </div>
                <div className="sm:col-span-2">
                  <ul className="list-disc list-inside text-sm text-foreground/80 space-y-1 pl-1">
                    <li>입장 전일에 예약이 없을 시 얼리체크인 가능 (문의필요)</li>
                    <li>퇴장일에 예약이 없을시 레이트체크아웃 가능 (문의필요)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold border-b border-foreground/50 pb-2 mb-4">
              <ListChecks className="w-5 h-5 text-foreground/80" />
              주요 절차 및 시설
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">입 · 퇴장 절차</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-foreground/80">
                    <li>입구 관리동에서 체크인</li>
                    <li>쓰레기 분리 수거봉투(2장)수령, 사이트및 주차위치 확인</li>
                    <li>이용 중 쓰레기 분리 수거 및 퇴장 전 쓰레기(일반, 재황용, 음식물)분리 배출 (쓰레기 처리장)</li>
                    <li>사이트 내 쓰레기 수거 및 깔판 정리정돈</li>
                  </ol>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">공용 시설</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80">
                    <li>샤워장 · 탈의실 (4개소)</li>
                    <li>개수대 · 화장실 (5개소)</li>
                    <li>공용 수영장 (시즌 운영)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold border-b border-foreground/50 pb-2 mb-4">
              <PlusCircle className="w-5 h-5 text-foreground/80" />
              추가 요금 안내
            </h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <ul className="list-disc list-inside text-foreground/80 space-y-2">
                  <li>조기 입장 이용료: 10,000원</li>
                  <li>퇴장 연장 이용료: 3시간 연장 20,000원, 6시간 연장 25,000원</li>
                  <li>카라반, 캠핑카, 트레일러 등 동반 이용 시 1박에 10,000원 추가 부과</li>
                  <li>캠핑장 사이트 별 기준인원 초과 시 1인당 1박에 10,000원 추가 부과</li>
                  <li>반려견 동반 이용 시 1마리당 1박에 5,000원 추가 부과</li>
                </ul>
                <p className="text-sm text-foreground/80 pt-2 border-t mt-4">
                  문의 및 신청은 예약담당에게 전화 주세요. (010-9703-1711)
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold border-b border-foreground/50 pb-2 mb-4">
              <PawPrint className="w-5 h-5 text-foreground/80" />
              반려견 동반 안내
            </h2>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">주의사항</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-foreground/80 space-y-2">
                  <li>세퍼트, 진돗개 등 맹견 및 중대형견(10kg 이상)은 입장할 수 없습니다. (장애인 보조견 제외)</li>
                  <li>사이트별 2마리로 제한합니다.</li>
                  <li>모든 반려견은 반드시 목줄을 착용해야 합니다.</li>
                  <li>편의시설(개수대, 샤워장, 화장실 등)에는 반려견 출입을 엄격히 금합니다.</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold border-b border-foreground/50 pb-2 mb-4">
              <Info className="w-5 h-5 text-foreground/80" />
              기타 안내
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">주차 안내</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80">
                    사이트별 지정 위치에 주차해야 합니다. 대부분 사이트 내 직접 주차가 가능하나, 일부 사이트는 짐을 내린
                    후 지정 장소로 이동해야 합니다.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">인터넷</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/80">네트워크</span>
                    <span className="font-medium text-foreground/70">SECLUB_1 / 2 / 3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/80">비밀번호</span>
                    <span className="font-mono text-foreground/70">12345678</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">비상 연락처</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/80">관리실 (현장 문의)</p>
                    <p className="font-semibold mt-1">010-4668-1704</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/80">예약 담당</p>
                    <p className="font-semibold mt-1">010-9703-1711</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
