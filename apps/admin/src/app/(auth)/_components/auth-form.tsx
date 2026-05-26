"use client"

import { FormEvent, useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@seclub/ui/button"
import { Input } from "@seclub/ui/input"
import { Label } from "@seclub/ui/label"
import { toast } from "@seclub/ui/use-toast"
import { redirectIfAuthenticated } from "@/lib/action/auth"

interface AuthFormProps {
  title: string
  subtitle?: string
  submitLabel: string
  submitLoadingLabel: string
  successTitle: string
  successDescription: string
  failureTitle: string
  failureDescription: string
  footer?: ReactNode
  passwordExtra?: ReactNode
  onSubmit: (email: string, password: string) => Promise<{ success: boolean; error: string | null }>
}

export function AuthForm({
  title,
  subtitle,
  submitLabel,
  submitLoadingLabel,
  successTitle,
  successDescription,
  failureTitle,
  failureDescription,
  footer,
  passwordExtra,
  onSubmit,
}: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    redirectIfAuthenticated()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { success, error } = await onSubmit(email, password)
      if (success) {
        toast({ title: successTitle, description: successDescription })
        router.push("/")
      } else {
        toast({
          title: failureTitle,
          description: error || failureDescription,
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "오류 발생",
        description: "처리 중 문제가 발생했습니다. 다시 시도해주세요.",
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
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="text-balance text-muted-foreground">{subtitle}</p>}
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
                {passwordExtra}
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
              {isLoading ? submitLoadingLabel : submitLabel}
            </Button>
          </form>
          {footer && <div className="mt-4 text-center text-sm">{footer}</div>}
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
