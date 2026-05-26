import Link from "next/link"
import { Mail } from "lucide-react"
import { AuthShell } from "@/components/auth-shell"

export default async function SignupEmailSentPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <AuthShell
      title="이메일을 확인해주세요"
      subtitle="가입을 마치려면 메일 속 링크를 클릭해주세요."
      footer={
        <Link
          href="/signup"
          className="font-medium text-gold-soft underline decoration-gold-soft/40 transition-colors hover:text-ink"
          style={{ textUnderlineOffset: "5px", textDecorationThickness: "1px" }}
        >
          처음으로
        </Link>
      }
    >
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-gold/12 text-gold">
          <Mail className="size-5" />
        </span>
        {email && (
          <p className="text-[14px] leading-[1.55] text-ink">
            <span className="font-medium">{email}</span>로 인증 링크를 보냈습니다.
            <br />
            링크를 클릭하면 가입이 완료됩니다.
          </p>
        )}
        <p className="text-[12.5px] leading-[1.55] text-body">
          링크는 24시간 동안 유효합니다. 스팸함도 확인해주세요.
        </p>
      </div>
    </AuthShell>
  )
}
