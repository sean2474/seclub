"use client";

import { useState, FormEvent, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@seclub/ui/button"
import { Input } from "@seclub/ui/input"
import { Label } from "@seclub/ui/label"
import { useToast } from "@seclub/ui/use-toast"

import { redirectIfAuthenticated, registerWithEmail } from "@/lib/action/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Use useEffect to handle redirect after component mount
  useEffect(() => {
    const checkAuth = async () => {
      const result = await redirectIfAuthenticated()
      // If already authenticated, the redirect happens automatically
    }
    checkAuth()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { success, error } = await registerWithEmail(email, password)

      if (success) {
        toast({
          title: "가입 성공",
          description: "관리자 페이지로 이동합니다.",
        })
        router.push("/")
      } else {
        toast({
          title: "가입 실패",
          description: error || "이메일 또는 비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "로그인 중 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">가입</h1>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required 
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">비밀번호</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "가입 중..." : "가입"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            관리자가 확인 후 수락합니다
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/29.webp"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.5]"
        />
      </div>
    </div>
  )
}
