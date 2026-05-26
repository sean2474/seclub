import { NextResponse } from "next/server"
import { createClient } from "@seclub/supabase/server"
import { IS_AUTH_MOCK } from "@/lib/auth-mode"

/**
 * Sign out and bounce back to /login. Mock mode has no real session so we
 * just redirect; live mode calls supabase.auth.signOut() to clear cookies.
 * Accepts both GET (link click) and POST (form submit, CSRF-safer pattern).
 */
async function handle(request: Request) {
  const { origin } = new URL(request.url)
  if (!IS_AUTH_MOCK) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }
  return NextResponse.redirect(`${origin}/login`, { status: 303 })
}

export { handle as GET, handle as POST }
