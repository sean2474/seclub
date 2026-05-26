"use client"

import Link from "next/link"
import { loginWithEmail } from "@/lib/action/auth"
import { AuthForm } from "../_components/auth-form"

export default function LoginPage() {
  return (
    <AuthForm
      title="로그인"
      subtitle="관리자 계정 정보를 입력하세요."
      submitLabel="로그인"
      submitLoadingLabel="로그인 중..."
      successTitle="로그인 성공"
      successDescription="관리자 페이지로 이동합니다."
      failureTitle="로그인 실패"
      failureDescription="이메일 또는 비밀번호가 올바르지 않습니다."
      passwordExtra={
        <Link href="#" className="ml-auto inline-block text-sm underline">
          비밀번호를 잊으셨나요?
        </Link>
      }
      footer={
        <>
          계정이 없으신가요?{" "}
          <Link href="#" className="underline">
            문의하기
          </Link>
        </>
      }
      onSubmit={loginWithEmail}
    />
  )
}
