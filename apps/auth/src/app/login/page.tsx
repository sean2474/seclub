import { Suspense } from "react"
import Link from "next/link"
import { AuthShell } from "@/components/auth-shell"
import { redirectIfAuthenticated } from "@/lib/action/auth"
import { safeRedirect } from "@/lib/safe-redirect"
import { LoginForm } from "./_components/login-form"

// Server component. Auth check + page chrome are server-rendered; the only
// client island is <LoginForm /> below.
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const target = safeRedirect(next, "/")
  await redirectIfAuthenticated(target)

  const signupHref =
    target !== "/" ? `/signup?next=${encodeURIComponent(target)}` : "/signup"

  return (
    <AuthShell
      title="다시 만나서 반가워요"
      subtitle="SE Club 계정으로 로그인하세요."
      footer={
        <>
          계정이 없으신가요?{" "}
          <Link
            href={signupHref}
            className="font-medium text-gold-soft underline decoration-gold-soft/40 transition-colors hover:text-ink"
            style={{ textUnderlineOffset: "5px", textDecorationThickness: "1px" }}
          >
            회원가입
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <LoginForm successUrl={target} />
      </Suspense>
    </AuthShell>
  )
}
