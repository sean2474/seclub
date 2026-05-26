"use client"

import { registerWithEmail } from "@/lib/action/auth"
import { AuthForm } from "../_components/auth-form"

export default function SignupPage() {
  return (
    <AuthForm
      title="가입"
      submitLabel="가입"
      submitLoadingLabel="가입 중..."
      successTitle="가입 성공"
      successDescription="관리자 페이지로 이동합니다."
      failureTitle="가입 실패"
      failureDescription="이메일 또는 비밀번호가 올바르지 않습니다."
      footer={<>관리자가 확인 후 수락합니다</>}
      onSubmit={registerWithEmail}
    />
  )
}
