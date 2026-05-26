/**
 * Shared input validators for the auth forms. Keep all signup/login/reset
 * email & phone checks aligned by reusing these helpers.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value: string): string | null {
  if (!value.trim()) return "이메일을 입력해주세요."
  if (!EMAIL_RE.test(value)) return "올바른 이메일 형식이 아닙니다."
  return null
}

export const PHONE_RE = /^[0-9\-+ ]{9,15}$/

export function validatePhone(value: string): string | null {
  if (!value.trim()) return "휴대폰 번호를 입력해주세요."
  if (!PHONE_RE.test(value.trim())) return "휴대폰 번호 형식을 확인해주세요."
  return null
}

export function validatePassword(value: string, opts: { min?: number } = {}): string | null {
  const min = opts.min ?? 6
  if (!value) return "비밀번호를 입력해주세요."
  if (value.length < min) return `비밀번호는 ${min}자 이상이어야 합니다.`
  return null
}

export function validateOtp(value: string): string | null {
  const digits = value.trim()
  if (!digits) return "인증번호를 입력해주세요."
  if (!/^\d{6}$/.test(digits)) return "인증번호 6자리를 입력해주세요."
  return null
}

export function validateName(value: string): string | null {
  if (value.trim().length < 2) return "이름을 2자 이상 입력해주세요."
  return null
}
