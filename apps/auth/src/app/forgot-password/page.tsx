import { Suspense } from "react"
import Link from "next/link"
import { AuthShell } from "@/components/auth-shell"
import { ForgotPasswordForm } from "./_components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="비밀번호 찾기"
      subtitle="가입하신 이메일로 재설정 링크를 보내드립니다."
      footer={
        <>
          <Link
            href="/login"
            className="font-medium text-gold-soft underline decoration-gold-soft/40 transition-colors hover:text-ink"
            style={{ textUnderlineOffset: "5px", textDecorationThickness: "1px" }}
          >
            로그인으로 돌아가기
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <ForgotPasswordForm />
      </Suspense>
    </AuthShell>
  )
}
