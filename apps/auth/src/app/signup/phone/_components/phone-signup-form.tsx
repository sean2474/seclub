"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import { FormError, PrimaryButton, TextField } from "@/components/auth-fields"
import { sendPhoneOtp, verifyPhoneOtp } from "@/lib/action/auth"
import { validateOtp, validatePhone } from "@/lib/validators"

type Step = "phone" | "otp"

/**
 * Two-step phone signup: enter number → SMS code → verify. Both steps render
 * in the same card so the transition stays in place. Focus moves to the OTP
 * input automatically once the SMS step appears.
 */
export function PhoneSignupForm({ successUrl }: { successUrl: string }) {
  const [step, setStep] = useState<Step>("phone")
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
      const { success, error } = await verifyPhoneOtp(phone, otp)
      if (success) {
        // Hard reload so the freshly-set session cookie reaches the profile RSC.
        window.location.href = `/signup/profile?next=${encodeURIComponent(successUrl)}`
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
            onClick={() => setStep("phone")}
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

        <div className="mt-3">
          <PrimaryButton type="submit" loading={loading} loadingLabel="인증 중...">
            다음
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
