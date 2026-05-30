import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@seclub/supabase/server"
import { AuthShell } from "@/components/auth-shell"
import { IS_AUTH_MOCK } from "@/lib/auth-mode"

/**
 * Root of the SSO app. Visitors normally arrive at /login or /signup with
 * `?next=<calling-app>` and are sent straight back there. They only land here
 * when there's no `next` (e.g. they opened the auth app directly).
 *
 * Flow:
 *   - mock mode → "로그인 완료" demo landing with sign-out
 *   - live, signed out → /login
 *   - live, signed in, no next → role-based home: admin → admin app,
 *     everyone else → member (mypage) app. Falls back to the demo landing
 *     only when the destination env vars aren't configured.
 */
export default async function AuthRootPage() {
  let signedIn = IS_AUTH_MOCK
  let displayName: string | null = null
  if (!IS_AUTH_MOCK) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: profile } = await supabase
      .from("profile")
      .select("role")
      .eq("id", user.id)
      .single()
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL
    const memberUrl = process.env.NEXT_PUBLIC_MEMBER_URL
    if (profile?.role === "admin" && adminUrl) redirect(adminUrl)
    if (memberUrl) redirect(memberUrl)

    signedIn = true
    displayName =
      (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
      user.email ||
      null
  }

  return (
    <AuthShell
      title="로그인 완료"
      subtitle={
        signedIn && displayName
          ? `${displayName}님으로 로그인되어 있습니다.`
          : "SSO 흐름이 정상적으로 마무리되었습니다."
      }
      footer={
        <form action="/signout" method="post">
          <button
            type="submit"
            className="cursor-pointer font-medium text-gold-soft underline decoration-gold-soft/40 transition-colors hover:text-ink"
            style={{ textUnderlineOffset: "5px", textDecorationThickness: "1px" }}
          >
            로그아웃
          </button>
        </form>
      }
    >
      <div className="flex flex-col gap-4 text-[13.5px] leading-[1.6] text-body">
        <p>
          실제 환경에서는 호출한 앱(예: reserve, landing)으로 자동 리다이렉트됩니다.
          호출 앱이 없을 때만 이 페이지가 표시됩니다.
        </p>
        <ul className="ml-3 list-disc space-y-1 text-body/90">
          <li>
            <Link href="/login" className="underline decoration-gold-soft/40 hover:text-ink">
              로그인
            </Link>{" "}
            (이메일 / 휴대폰 / 카카오 / Google)
          </li>
          <li>
            <Link href="/signup" className="underline decoration-gold-soft/40 hover:text-ink">
              회원가입
            </Link>{" "}
            4가지 진입 → 프로필 단계
          </li>
          <li>
            <Link
              href="/forgot-password"
              className="underline decoration-gold-soft/40 hover:text-ink"
            >
              비밀번호 찾기
            </Link>{" "}
            → 메일 발송 → 재설정
          </li>
        </ul>
      </div>
    </AuthShell>
  )
}
