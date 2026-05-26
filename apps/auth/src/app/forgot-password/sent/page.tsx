import Link from "next/link"
import { Mail } from "lucide-react"
import { AuthShell } from "@/components/auth-shell"

export default async function ForgotPasswordSentPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <AuthShell
      title="메일을 확인해주세요"
      subtitle="비밀번호 재설정 링크를 보내드렸습니다."
      footer={
        <>
          메일을 받지 못하셨나요?{" "}
          <Link
            href="/forgot-password"
            className="font-medium text-gold-soft underline decoration-gold-soft/40 transition-colors hover:text-ink"
            style={{ textUnderlineOffset: "5px", textDecorationThickness: "1px" }}
          >
            다시 시도
          </Link>
        </>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-gold/12 text-gold">
          <Mail className="size-5" />
        </span>
        {email && (
          <p className="text-[14px] leading-[1.55] text-ink">
            <span className="font-medium">{email}</span>로 보낸 링크를 클릭하면
            <br />
            비밀번호를 재설정할 수 있습니다.
          </p>
        )}
        <p className="text-[12.5px] leading-[1.55] text-body">
          링크는 60분간 유효합니다. 스팸함도 확인해주세요.
        </p>
        <Link
          href="/login"
          className="mt-2 text-[13px] font-medium text-gold-soft underline decoration-gold-soft/40 transition-colors hover:text-ink"
          style={{ textUnderlineOffset: "5px", textDecorationThickness: "1px" }}
        >
          로그인으로 돌아가기
        </Link>
      </div>
    </AuthShell>
  )
}
