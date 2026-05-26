"use client"

import { FormEvent, useState } from "react"
import { FormError, PrimaryButton, TextField } from "@/components/auth-fields"
import { saveSignupProfile } from "@/lib/action/auth"
import { validateName } from "@/lib/validators"

export function ProfileForm({
  successUrl,
  initialName,
}: {
  successUrl: string
  initialName: string
}) {
  const [name, setName] = useState(initialName)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const err = validateName(name)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setFormError(null)
    setLoading(true)
    try {
      const { success, error: saveError } = await saveSignupProfile({ name })
      if (success) {
        window.location.href = successUrl
        return
      }
      setFormError(saveError || "프로필 저장에 실패했습니다.")
    } catch (err) {
      console.error("Save profile error:", err)
      setFormError("네트워크 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:gap-[14px]">
      {formError && <FormError>{formError}</FormError>}

      <TextField
        label="이름"
        type="text"
        autoComplete="name"
        placeholder="홍길동"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          if (error) setError(null)
        }}
        error={error || undefined}
        disabled={loading}
        required
      />

      <div className="mt-3">
        <PrimaryButton type="submit" loading={loading} loadingLabel="저장 중...">
          가입 완료
        </PrimaryButton>
      </div>
    </form>
  )
}
