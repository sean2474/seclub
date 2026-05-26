"use client"

import { useState } from "react"
import { createClient } from "@seclub/supabase/client"
import { IS_AUTH_MOCK } from "@/lib/auth-mode"
import { FormError } from "./auth-fields"

type Provider = "google" | "kakao"

const PROVIDER_LABEL: Record<Provider, string> = {
  google: "Google로 계속하기",
  kakao: "카카오로 계속하기",
}

/**
 * Social sign-in buttons. On click we kick off the Supabase OAuth flow which
 * redirects to the provider; provider returns to `/auth/callback?next=...`
 * which exchanges the code for a session and bounces to the originating app.
 *
 * Interaction matches the landing `primary` button language: no scale or
 * transform on click — only background/border change. Label never moves.
 */
export function OAuthButtons({ successUrl }: { successUrl: string }) {
  const [pending, setPending] = useState<Provider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startOAuth = async (provider: Provider) => {
    setPending(provider)
    setError(null)
    if (IS_AUTH_MOCK) {
      // Skip Supabase — jump straight to the callback so the redirect chain
      // still gets exercised. The callback re-checks the env var server-side
      // (we deliberately don't propagate the mock signal via the URL, which
      // would be a code-validation bypass in production).
      window.location.href = `/auth/callback?next=${encodeURIComponent(successUrl)}`
      return
    }
    try {
      const supabase = createClient()
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(successUrl)}`
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callbackUrl },
      })
      if (oauthError) {
        console.error(`${provider} OAuth start failed:`, oauthError)
        setError("소셜 로그인 연결에 실패했습니다. 잠시 후 다시 시도해주세요.")
        setPending(null)
      }
      // On success Supabase navigates to the provider; this component unmounts.
    } catch (err) {
      console.error(`${provider} OAuth unexpected error:`, err)
      setError("소셜 로그인 중 오류가 발생했습니다.")
      setPending(null)
    }
  }

  // OAuth keeps each provider's signature brand color, so the landing
  // primary fill→outline language doesn't translate — yellow outline on
  // cream washes out. Instead we hold the brand fill and only nudge the
  // surface on hover (brightness for Kakao, soft cream for Google). No
  // scale on the container so the label still doesn't move.
  const base =
    "inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-lg border px-4 text-[13.5px] font-medium tracking-[0.02em] transition-[background-color,filter,box-shadow,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/35 disabled:cursor-not-allowed disabled:opacity-60"

  return (
    <div className="flex flex-col gap-2">
      {error && <FormError>{error}</FormError>}
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => startOAuth("kakao")}
        className={base + " border-kakao bg-kakao text-kakao-text hover:brightness-[0.96]"}
      >
        <KakaoIcon />
        <span>{pending === "kakao" ? "이동 중…" : PROVIDER_LABEL.kakao}</span>
      </button>

      <button
        type="button"
        disabled={pending !== null}
        onClick={() => startOAuth("google")}
        className={base + " border-ink-soft/15 bg-white text-google-text hover:bg-cream-50"}
      >
        <GoogleIcon />
        <span>{pending === "google" ? "이동 중…" : PROVIDER_LABEL.google}</span>
      </button>
    </div>
  )
}

function KakaoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 3C6.477 3 2 6.582 2 11c0 2.799 1.81 5.255 4.547 6.66l-1.07 3.918a.4.4 0 0 0 .6.434l4.61-3.073A12.4 12.4 0 0 0 12 19c5.523 0 10-3.582 10-8s-4.477-8-10-8Z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.614Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.322 0 2.508.455 3.44 1.346l2.582-2.581C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  )
}

export function OAuthDivider() {
  return (
    <div className="relative my-1 flex items-center">
      <div className="flex-1 border-t border-ink-soft/15" />
      <span className="px-3 text-[10.5px] uppercase tracking-[0.18em] text-body/70">또는</span>
      <div className="flex-1 border-t border-ink-soft/15" />
    </div>
  )
}
