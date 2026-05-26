import Link from "next/link"
import { AuthShell } from "@/components/auth-shell"
import { SignupPicker } from "@/components/signup-picker"
import { redirectIfAuthenticated } from "@/lib/action/auth"
import { safeRedirect } from "@/lib/safe-redirect"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const target = safeRedirect(next, "/")
  await redirectIfAuthenticated(target)

  const loginHref =
    target !== "/" ? `/login?next=${encodeURIComponent(target)}` : "/login"

  return (
    <AuthShell
      title="SE Club 가입"
      subtitle="가입 방법을 선택해주세요."
      footer={
        <>
          이미 계정이 있으신가요?{" "}
          <Link
            href={loginHref}
            className="font-medium text-gold-soft underline decoration-gold-soft/40 transition-colors hover:text-ink"
            style={{ textUnderlineOffset: "5px", textDecorationThickness: "1px" }}
          >
            로그인
          </Link>
        </>
      }
    >
      <SignupPicker successUrl={target} />
    </AuthShell>
  )
}
