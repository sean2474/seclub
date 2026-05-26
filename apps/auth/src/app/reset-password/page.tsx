import Link from "next/link"
import { AuthShell } from "@/components/auth-shell"
import { ResetPasswordForm } from "./_components/reset-password-form"

/**
 * Reached via the link in the password-reset email. Supabase puts a temporary
 * session in place (recovery flow) so updateUser({ password }) works inside
 * this client form.
 */
export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="새 비밀번호 설정"
      subtitle="새로 사용할 비밀번호를 입력해주세요."
      footer={
        <Link
          href="/login"
          className="font-medium text-gold-soft underline decoration-gold-soft/40 transition-colors hover:text-ink"
          style={{ textUnderlineOffset: "5px", textDecorationThickness: "1px" }}
        >
          로그인으로 돌아가기
        </Link>
      }
    >
      <ResetPasswordForm />
    </AuthShell>
  )
}
