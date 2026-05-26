"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { FormError, PasswordField, PrimaryButton, TextField } from "@/components/auth-fields"
import { registerWithEmail } from "@/lib/action/auth"
import { validateEmail, validatePassword } from "@/lib/validators"

export function EmailSignupForm({ successUrl }: { successUrl: string }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string | null> = {
      email: validateEmail(email),
      password: validatePassword(password),
      passwordConfirm: passwordConfirm !== password ? "비밀번호가 일치하지 않습니다." : null,
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    setFormError(null)
    setLoading(true)
    try {
      const { success, error, needsConfirmation } = await registerWithEmail(
        email,
        password,
        successUrl,
      )
      if (!success) {
        setFormError(error || "가입 중 오류가 발생했습니다.")
        return
      }
      if (needsConfirmation) {
        router.push(`/signup/email/sent?email=${encodeURIComponent(email)}`)
        return
      }
      // Hard reload — the server-action set the new session cookie, but the
      // RSC fetch from router.push wouldn't pick it up in time, leaving the
      // profile page to think there's no session and bounce back to /signup.
      window.location.href = `/signup/profile?next=${encodeURIComponent(successUrl)}`
    } catch (err) {
      console.error("Email signup error:", err)
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
        placeholder="you@example.com"
        autoComplete="email"
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
        placeholder="••••••••"
        autoComplete="new-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value)
          if (errors.password) setErrors((p) => ({ ...p, password: null }))
        }}
        error={errors.password || undefined}
        disabled={loading}
        minLength={6}
        required
      />

      <PasswordField
        label="비밀번호 확인"
        placeholder="••••••••"
        autoComplete="new-password"
        value={passwordConfirm}
        onChange={(e) => {
          setPasswordConfirm(e.target.value)
          if (errors.passwordConfirm) setErrors((p) => ({ ...p, passwordConfirm: null }))
        }}
        error={errors.passwordConfirm || undefined}
        disabled={loading}
        required
      />

      <div className="mt-3">
        <PrimaryButton type="submit" loading={loading} loadingLabel="가입 중...">
          다음
        </PrimaryButton>
      </div>
    </form>
  )
}
