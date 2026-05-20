import { Search } from "lucide-react";
import { LookupForm } from "./_components/lookup-form";

export default function LookupPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">예약 조회</h1>
        <p className="mt-2 text-foreground/60">
          예약번호와 예약자 정보로 예약 내역을 확인할 수 있습니다.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="rounded-lg border border-foreground/10 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Search className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="font-medium text-foreground">비회원 예약 조회</h2>
            <p className="text-sm text-foreground/60">
              로그인 없이 예약 내역을 확인하세요
            </p>
          </div>
        </div>

        <LookupForm />
      </div>

      {/* Help Section */}
      <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-4">
        <h3 className="font-medium text-foreground">예약번호를 모르시나요?</h3>
        <p className="mt-2 text-sm text-foreground/60">
          예약 완료 시 입력하신 이메일 또는 휴대폰으로 예약번호가 발송됩니다.
          <br />
          예약번호를 찾을 수 없는 경우, 고객센터로 문의해 주세요.
        </p>
        <a
          href="/contact"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          고객센터 문의하기
        </a>
      </div>

      {/* Recent Lookup Tip */}
      <div className="rounded-lg border border-foreground/10 bg-white p-4">
        <h3 className="font-medium text-foreground">알아두세요</h3>
        <ul className="mt-3 space-y-2 text-sm text-foreground/70">
          <li className="flex items-start gap-2">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
            예약번호는 SE로 시작합니다. (예: SE260314-ABC1)
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
            이메일 또는 전화번호 중 하나만 입력해도 조회 가능합니다.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-foreground/30" />
            예약 취소/변경은 조회 후 상세 페이지에서 가능합니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
