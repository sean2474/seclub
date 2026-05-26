"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { FormError, PasswordField, PrimaryButton } from "@/components/auth-fields"
import { updatePassword } from "@/lib/action/auth"
import { validatePassword } from "@/lib/validators"

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Record<string, string | null> = {
      password: validatePassword(password),
      confirm: confirm !== password ? "비밀번호가 일치하지 않습니다." : null,
    }
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    setFormError(null)
    setLoading(true)
    try {
      const { success, error } = await updatePassword(password)
      if (success) {
        router.push("/login?reset=success")
        return
      }
      setFormError(error || "비밀번호 재설정에 실패했습니다.")
    } catch (err) {
      console.error("Reset password error:", err)
      setFormError("네트워크 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:gap-[14px]">
      {formError && <FormError>{formError}</FormError>}

      <PasswordField
        label="새 비밀번호"
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
        label="새 비밀번호 확인"
        placeholder="••••••••"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => {
          setConfirm(e.target.value)
          if (errors.confirm) setErrors((p) => ({ ...p, confirm: null }))
        }}
        error={errors.confirm || undefined}
        disabled={loading}
        required
      />

      <div className="mt-3">
        <PrimaryButton type="submit" loading={loading} loadingLabel="저장 중...">
          비밀번호 변경
        </PrimaryButton>
      </div>
    </form>
  )
}
