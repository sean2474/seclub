"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, ArrowRight } from "lucide-react"
import { createClient } from "@seclub/supabase/client"
import { IS_AUTH_MOCK } from "@/lib/auth-mode"
import { FormError } from "./auth-fields"

/**
 * Four sign-up entry methods rendered as quiet horizontal tiles. The two
 * password-bearing paths (email/phone) push to dedicated step pages; the
 * OAuth tiles kick off Supabase's hosted flow inline.
 */
export function SignupPicker({ successUrl }: { successUrl: string }) {
  const [pendingOAuth, setPendingOAuth] = useState<"kakao" | "google" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startOAuth = async (provider: "kakao" | "google") => {
    setPendingOAuth(provider)
    setError(null)
    const next = `/signup/profile?next=${encodeURIComponent(successUrl)}`
    if (IS_AUTH_MOCK) {
      window.location.href = `/auth/callback?next=${encodeURIComponent(next)}`
      return
    }
    try {
      const supabase = createClient()
      // OAuth returns to the callback, which then redirects to the profile step
      // when the user hasn't filled in their name yet.
      const callbackUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: callbackUrl },
      })
      if (oauthError) {
        console.error(`${provider} OAuth start failed:`, oauthError)
        setError("소셜 가입 연결에 실패했습니다. 잠시 후 다시 시도해주세요.")
        setPendingOAuth(null)
      }
    } catch (err) {
      console.error(`${provider} OAuth unexpected error:`, err)
      setError("소셜 가입 중 오류가 발생했습니다.")
      setPendingOAuth(null)
    }
  }

  const queryNext = successUrl !== "/" ? `?next=${encodeURIComponent(successUrl)}` : ""

  return (
    <div className="flex flex-col gap-2.5">
      {error && <FormError>{error}</FormError>}
      <PickerTile
        as="link"
        href={`/signup/phone${queryNext}`}
        icon={<Phone className="size-[18px]" />}
        label="휴대폰으로 가입"
        sub="문자로 인증번호를 받습니다"
      />
      <PickerTile
        as="link"
        href={`/signup/email${queryNext}`}
        icon={<Mail className="size-[18px]" />}
        label="이메일로 가입"
        sub="비밀번호로 보호되는 계정"
      />
      <PickerTile
        as="button"
        onClick={() => startOAuth("kakao")}
        disabled={pendingOAuth !== null}
        icon={<KakaoIcon />}
        label={pendingOAuth === "kakao" ? "이동 중…" : "카카오로 가입"}
        sub="간편 가입"
        accent="kakao"
      />
      <PickerTile
        as="button"
        onClick={() => startOAuth("google")}
        disabled={pendingOAuth !== null}
        icon={<GoogleIcon />}
        label={pendingOAuth === "google" ? "이동 중…" : "Google로 가입"}
        sub="간편 가입"
      />
    </div>
  )
}

interface CommonTileProps {
  icon: React.ReactNode
  label: string
  sub: string
  accent?: "kakao"
}

type TileProps =
  | (CommonTileProps & {
      as: "link"
      href: string
    })
  | (CommonTileProps & {
      as: "button"
      onClick: () => void
      disabled?: boolean
    })

function PickerTile(props: TileProps) {
  const base =
    "group flex w-full cursor-pointer items-center gap-3.5 rounded-lg border border-ink-soft/15 bg-card/70 px-4 py-3 text-left transition-all duration-200 ease-out hover:border-gold/50 hover:bg-card focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/30 disabled:cursor-not-allowed disabled:opacity-60"

  const accentClass =
    props.accent === "kakao"
      ? "border-kakao bg-kakao/95 hover:bg-kakao hover:border-kakao"
      : ""

  const inner = (
    <>
      <span
        className={
          "grid size-9 shrink-0 place-items-center rounded-md " +
          (props.accent === "kakao"
            ? "bg-kakao-text/8 text-kakao-text"
            : "bg-gold/10 text-ink")
        }
      >
        {props.icon}
      </span>
      <span className="flex flex-1 flex-col">
        <span
          className={
            "text-[14px] font-medium tracking-[0.005em] " +
            (props.accent === "kakao" ? "text-kakao-text" : "text-ink")
          }
        >
          {props.label}
        </span>
        <span
          className={
            "text-[12px] leading-tight " +
            (props.accent === "kakao" ? "text-kakao-text/60" : "text-body/85")
          }
        >
          {props.sub}
        </span>
      </span>
      <ArrowRight
        className={
          "size-4 transition-transform group-hover:translate-x-0.5 " +
          (props.accent === "kakao" ? "text-kakao-text/60" : "text-label")
        }
      />
    </>
  )

  if (props.as === "link") {
    return (
      <Link href={props.href} className={base + " " + accentClass}>
        {inner}
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      className={base + " " + accentClass}
    >
      {inner}
    </button>
  )
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M12 3C6.477 3 2 6.582 2 11c0 2.799 1.81 5.255 4.547 6.66l-1.07 3.918a.4.4 0 0 0 .6.434l4.61-3.073A12.4 12.4 0 0 0 12 19c5.523 0 10-3.582 10-8s-4.477-8-10-8Z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
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
