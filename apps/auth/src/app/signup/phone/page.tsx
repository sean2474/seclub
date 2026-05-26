import Link from "next/link"
import { AuthShell } from "@/components/auth-shell"
import { redirectIfAuthenticated } from "@/lib/action/auth"
import { safeRedirect } from "@/lib/safe-redirect"
import { PhoneSignupForm } from "./_components/phone-signup-form"

export default async function PhoneSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const target = safeRedirect(next, "/")
  await redirectIfAuthenticated(target)

  return (
    <AuthShell
      title="휴대폰으로 가입"
      subtitle="번호를 입력하면 인증번호를 보내드립니다."
      footer={
        <>
          다른 방법으로 가입하시겠어요?{" "}
          <Link
            href={`/signup${next ? `?next=${encodeURIComponent(target)}` : ""}`}
            className="font-medium text-gold-soft underline decoration-gold-soft/40 transition-colors hover:text-ink"
            style={{ textUnderlineOffset: "5px", textDecorationThickness: "1px" }}
          >
            처음으로
          </Link>
        </>
      }
    >
      <PhoneSignupForm successUrl={target} />
    </AuthShell>
  )
}
