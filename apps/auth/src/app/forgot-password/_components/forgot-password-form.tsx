"use client"

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FormError, PrimaryButton, TextField } from "@/components/auth-fields"
import { sendPasswordResetEmail } from "@/lib/action/auth"
import { validateEmail } from "@/lib/validators"

const CALLBACK_ERROR_COPY: Record<string, string> = {
  invalid_link: "유효하지 않은 링크입니다. 새 재설정 메일을 요청해주세요.",
  expired: "링크가 만료되었습니다. 다시 시도해주세요.",
}

export function ForgotPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const callbackError = params?.get("error")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(
    callbackError ? CALLBACK_ERROR_COPY[callbackError] || null : null,
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validateEmail(email)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setFormError(null)
    setLoading(true)
    try {
      const { success, error: sendError } = await sendPasswordResetEmail(email)
      if (success) {
        router.push(`/forgot-password/sent?email=${encodeURIComponent(email)}`)
        return
      }
      setFormError(sendError || "메일 발송에 실패했습니다.")
    } catch (err) {
      console.error("Forgot password error:", err)
      setFormError("네트워크 오류가 발생했습니다.")
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
          if (error) setError(null)
        }}
        error={error || undefined}
        disabled={loading}
        required
      />

      <div className="mt-3">
        <PrimaryButton type="submit" loading={loading} loadingLabel="발송 중...">
          재설정 링크 받기
        </PrimaryButton>
      </div>
    </form>
  )
}
