import { Clock, ListChecks, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CampsiteInfoPage() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 mt-[var(--header-height-expanded)]">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
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
                    <li>전일 예약 없을 시 얼리 체크인 가능 (문의 필요)</li>
                    <li>레이트 체크아웃은 별도 옵션으로 운영됩니다.</li>
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
                    <li>관리동에서 고객안내 및 체크인</li>
                    <li>쓰레기봉투 수령 및 위치 확인</li>
                    <li>퇴장 전 쓰레기 분리배출</li>
                    <li>깔판 및 대여용품 정돈</li>
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
                    <p className="font-semibold mt-1">010-6343-1711</p>
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
