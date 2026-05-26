"use client"

import { forwardRef, FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@seclub/utils"
import {
  FormError,
  PasswordField,
  PrimaryButton,
  TextField,
} from "@/components/auth-fields"
import { OAuthButtons, OAuthDivider } from "@/components/oauth-buttons"
import { loginWithEmail, sendPhoneOtp, verifyPhoneOtp } from "@/lib/action/auth"
import { validateEmail, validateOtp, validatePhone } from "@/lib/validators"

type Mode = "email" | "phone"
type PhoneStep = "input" | "otp"

const ERROR_COPY: Record<string, string> = {
  oauth_no_code: "소셜 로그인 코드를 받지 못했습니다. 다시 시도해주세요.",
  oauth_failed: "소셜 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.",
}

/**
 * Email/password ↔ phone/OTP login. Tabs share the card; OAuth providers sit
 * below the divider. Only the form state is client; chrome stays server-side.
 *
 * Tabs follow APG tablist semantics (role + aria-selected + arrow keys).
 * Banners surface OAuth/reset states routed back via the query string.
 */
export function LoginForm({ successUrl }: { successUrl: string }) {
  const params = useSearchParams()
  const [mode, setMode] = useState<Mode>("email")
  const emailRef = useRef<HTMLButtonElement>(null)
  const phoneRef = useRef<HTMLButtonElement>(null)

  const errorCode = params?.get("error")
  const resetSuccess = params?.get("reset") === "success"

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
    e.preventDefault()
    const nextMode = mode === "email" ? "phone" : "email"
    setMode(nextMode)
    if (nextMode === "email") emailRef.current?.focus()
    else phoneRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-[18px]">
      {errorCode && <FormError>{ERROR_COPY[errorCode] || "오류가 발생했습니다. 다시 시도해주세요."}</FormError>}
      {resetSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-md border border-gold/30 bg-gold/10 px-3 py-2 text-[12.5px] leading-[1.5] text-ink"
        >
          비밀번호가 재설정되었습니다. 새 비밀번호로 로그인해주세요.
        </div>
      )}

      <div
        role="tablist"
        aria-label="로그인 방식"
        onKeyDown={onKey}
        className="flex rounded-lg border border-ink-soft/15 bg-card/60 p-0.5"
      >
        <TabButton
          ref={emailRef}
          id="login-tab-email"
          panelId="login-panel-email"
          active={mode === "email"}
          onClick={() => setMode("email")}
        >
          이메일
        </TabButton>
        <TabButton
          ref={phoneRef}
          id="login-tab-phone"
          panelId="login-panel-phone"
          active={mode === "phone"}
          onClick={() => setMode("phone")}
        >
          휴대폰
        </TabButton>
      </div>

      <div
        role="tabpanel"
        id={mode === "email" ? "login-panel-email" : "login-panel-phone"}
        aria-labelledby={mode === "email" ? "login-tab-email" : "login-tab-phone"}
      >
        {mode === "email" ? (
          <EmailLogin successUrl={successUrl} />
        ) : (
          <PhoneLogin successUrl={successUrl} />
        )}
      </div>

      <OAuthDivider />
      <OAuthButtons successUrl={successUrl} />
    </div>
  )
}

interface TabButtonProps {
  id: string
  panelId: string
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

const TabButton = forwardRef<HTMLButtonElement, TabButtonProps>(function TabButton(
  { id, panelId, active, onClick, children },
  ref,
) {
  return (
    <button
      ref={ref}
      id={id}
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={cn(
        "flex-1 cursor-pointer rounded-md py-2 text-[13px] font-medium tracking-[0.02em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/30",
        active
          ? "bg-ink text-cream shadow-[0_1px_2px_rgba(47,42,33,0.18)]"
          : "text-label hover:text-ink",
      )}
    >
      {children}
    </button>
  )
})

function EmailLogin({ successUrl }: { successUrl: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string | null> = {
      email: validateEmail(email),
      password: !password ? "비밀번호를 입력해주세요." : null,
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    setFormError(null)
    setLoading(true)
    try {
      const { success, error } = await loginWithEmail(email, password)
      if (success) {
        window.location.href = successUrl
        return
      }
      setFormError(error || "로그인에 실패했습니다.")
    } catch (err) {
      console.error("Email login error:", err)
      setFormError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:gap-[14px]">
      {formError && <FormError>{formError}</FormError>}

      <TextField
        label="이메일"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (errors.email) setErrors((p) => ({ ...p, email: null }))
        }}
        error={errors.email || undefined}
        disabled={loading}
        required
      />

      <PasswordField
        label="비밀번호"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          if (errors.password) setErrors((p) => ({ ...p, password: null }))
        }}
        labelAdornment={
          <Link
            href="/forgot-password"
            className="text-[11px] font-medium text-gold-soft underline decoration-gold-soft/40 transition-colors hover:text-ink"
            style={{ textUnderlineOffset: "5px", textDecorationThickness: "1px" }}
          >
            비밀번호 찾기
          </Link>
        }
        error={errors.password || undefined}
        disabled={loading}
        required
      />

      <div className="mt-3">
        <PrimaryButton type="submit" loading={loading} loadingLabel="로그인 중...">
          로그인
        </PrimaryButton>
      </div>
    </form>
  )
}

function PhoneLogin({ successUrl }: { successUrl: string }) {
  const router = useRouter()
  const [step, setStep] = useState<PhoneStep>("input")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const otpRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === "otp") otpRef.current?.focus()
  }, [step])

  const sendCode = async (e: FormEvent) => {
    e.preventDefault()
    const err = validatePhone(phone)
    if (err) {
      setPhoneError(err)
      return
    }
    setPhoneError(null)
    setFormError(null)
    setLoading(true)
    try {
      const { success, error } = await sendPhoneOtp(phone)
      if (success) setStep("otp")
      else setFormError(error || "인증번호 발송에 실패했습니다.")
    } catch (err) {
      console.error("Send OTP error:", err)
      setFormError("네트워크 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const verify = async (e: FormEvent) => {
    e.preventDefault()
    const err = validateOtp(otp)
    if (err) {
      setOtpError(err)
      return
    }
    setOtpError(null)
    setFormError(null)
    setLoading(true)
    try {
      const { success, error, needsProfile } = await verifyPhoneOtp(phone, otp)
      if (success) {
        // Supabase auto-creates accounts for new phone numbers. When the
        // freshly-verified user has no name yet, treat the "login" as the
        // first leg of a signup and send them to the profile step instead
        // of bouncing to the calling app.
        window.location.href = needsProfile
          ? `/signup/profile?next=${encodeURIComponent(successUrl)}`
          : successUrl
        router.refresh()
        return
      }
      setFormError(error || "인증에 실패했습니다.")
    } catch (err) {
      console.error("Verify OTP error:", err)
      setFormError("네트워크 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    setFormError(null)
    setLoading(true)
    try {
      const { error } = await sendPhoneOtp(phone)
      if (error) setFormError(error)
    } catch (err) {
      console.error("Resend OTP error:", err)
      setFormError("재전송 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (step === "otp") {
    return (
      <form onSubmit={verify} noValidate className="flex flex-col gap-3 sm:gap-[14px]">
        {formError && <FormError>{formError}</FormError>}

        <div
          role="status"
          aria-live="polite"
          className="rounded-md border border-gold/25 bg-gold/8 px-3 py-2 text-[12px] leading-[1.5] text-label"
        >
          <span className="font-medium text-ink">{phone}</span>로 인증번호를 보냈습니다.
        </div>

        <TextField
          ref={otpRef}
          label="인증번호"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="6자리 숫자"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            if (otpError) setOtpError(null)
          }}
          error={otpError || undefined}
          disabled={loading}
          required
        />

        <div className="flex items-center justify-between text-[12px]">
          <button
            type="button"
            onClick={() => setStep("input")}
            className="cursor-pointer text-label underline decoration-label/30 underline-offset-[4px] transition-colors hover:text-ink"
          >
            번호 다시 입력
          </button>
          <button
            type="button"
            onClick={resend}
            disabled={loading}
            className="cursor-pointer text-gold-soft underline decoration-gold-soft/40 underline-offset-[4px] transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            인증번호 재전송
          </button>
        </div>

        <div className="mt-2">
          <PrimaryButton type="submit" loading={loading} loadingLabel="인증 중...">
            로그인
          </PrimaryButton>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={sendCode} noValidate className="flex flex-col gap-3 sm:gap-[14px]">
      {formError && <FormError>{formError}</FormError>}

      <TextField
        label="휴대폰 번호"
        type="tel"
        autoComplete="tel"
        placeholder="010-0000-0000"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value)
          if (phoneError) setPhoneError(null)
        }}
        error={phoneError || undefined}
        disabled={loading}
        required
      />

      <div className="mt-3">
        <PrimaryButton type="submit" loading={loading} loadingLabel="발송 중...">
          인증번호 받기
        </PrimaryButton>
      </div>
    </form>
  )
}
