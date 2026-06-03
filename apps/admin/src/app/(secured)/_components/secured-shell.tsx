"use client"

import { useState, type ReactNode, Suspense } from "react"
import Image from "next/image"
import { Menu } from "lucide-react"
import type { User } from "@supabase/supabase-js"

import AdminSidebar from "@/components/admin-sidebar"
import { AdminSettingDialog } from "@/components/admin-setting"
import { Button } from "@seclub/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@seclub/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@seclub/ui/dropdown-menu"
import { Toaster } from "@seclub/ui/toaster"
import { toast } from "@seclub/ui/use-toast"
import { cn } from "@seclub/utils"
import { logout } from "@/lib/action/auth"
import { adminBaseUrl, loginUrl } from "@/lib/auth-urls"
import type { Profile } from "@/types/auth"

interface SecuredShellProps {
  user: User
  profile: Profile
  children: ReactNode
}

export function SecuredShell({ user, profile, children }: SecuredShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [settingOpen, setSettingOpen] = useState(false)

  return (
    <div className="min-h-screen w-full bg-background">
      <AdminSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div
        className={cn(
          "flex flex-col transition-[padding-left] duration-300 ease-in-out",
          isCollapsed ? "md:pl-[70px]" : "md:pl-[220px] lg:pl-[280px]",
        )}
      >
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm supports-backdrop-filter:bg-background/60 lg:h-[60px] lg:px-6">
          <Suspense fallback={<div>Loading...</div>}>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden bg-transparent">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <AdminSidebar isMobile />
              </SheetContent>
            </Sheet>
          </Suspense>
          <div className="w-full flex-1" />
          <Suspense fallback={<div>Loading...</div>}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  {profile.image_path ? (
                    <Image
                      src={profile.image_path}
                      width={32}
                      height={32}
                      alt="관리자 아바타"
                      className="rounded-full"
                    />
                  ) : (
                    <div>{user.email?.charAt(0).toUpperCase()}</div>
                  )}
                  <span className="sr-only">사용자 메뉴 토글</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setSettingOpen(true)}>설정</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    const { success, error } = await logout()
                    if (success) {
                      // Hand off to the shared SSO sign-in (cross-origin), so
                      // router.push won't work. Full reload also drops the
                      // RSC cache that thinks we're still authenticated.
                      window.location.href = loginUrl(adminBaseUrl())
                    } else {
                      toast({
                        title: "로그아웃 실패",
                        description: error || "다시 시도해주세요.",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Suspense>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
        <Toaster />
      </div>
      <AdminSettingDialog open={settingOpen} onOpenChange={setSettingOpen} />
    </div>
  )
}
