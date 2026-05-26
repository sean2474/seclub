import { NextResponse } from "next/server"
import { createClient } from "@seclub/supabase/server"
import { IS_AUTH_MOCK } from "@/lib/auth-mode"
import { safeRedirect } from "@/lib/safe-redirect"

/**
 * OAuth callback: Supabase redirects here with `?code=...` after the user
 * authorizes a provider. We exchange the code for a session cookie, then
 * redirect to the `next` param (validated against the SSO redirect allowlist).
 *
 * Provider settings (Google, Kakao) must list `{NEXT_PUBLIC_AUTH_URL}/auth/callback`
 * as an allowed redirect URL in Supabase Auth → URL Configuration.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type")
  const nextParam = searchParams.get("next")
  const target = safeRedirect(nextParam, "/")

  // Mock OAuth: skip the code exchange entirely and forward to the destination.
  // Gated only by the server-side env var — never by a client-supplied query
  // param, since otherwise an attacker could append it to bypass OAuth code
  // validation in production. Same-origin path or allow-listed absolute URL only.
  if (IS_AUTH_MOCK && !code) {
    if (target.startsWith("http")) return NextResponse.redirect(target)
    return NextResponse.redirect(`${origin}${target}`)
  }

  if (!code) {
    if (type === "recovery") {
      return NextResponse.redirect(`${origin}/forgot-password?error=invalid_link`)
    }
    return NextResponse.redirect(`${origin}/login?error=oauth_no_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error("Auth code exchange failed:", error)
    if (type === "recovery") {
      return NextResponse.redirect(`${origin}/forgot-password?error=expired`)
    }
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
  }

  // Recovery: session now holds the password-reset claim → push to reset form.
  if (type === "recovery") {
    return NextResponse.redirect(`${origin}/reset-password`)
  }

  // New OAuth user with no name → detour through /signup/profile so they
  // can complete the account before being handed off to the calling app.
  // Most providers (Kakao, Google) sync `name`, but not all configurations do.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const name = user?.user_metadata?.name
  const hasName = typeof name === "string" && name.trim().length >= 2
  if (!hasName) {
    return NextResponse.redirect(
      `${origin}/signup/profile?next=${encodeURIComponent(target)}`,
    )
  }

  // Absolute URL (from allowlist) or same-origin path — both safe.
  if (target.startsWith("http")) return NextResponse.redirect(target)
  return NextResponse.redirect(`${origin}${target}`)
}
