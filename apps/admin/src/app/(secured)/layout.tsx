"use client"

import { useState, type ReactNode, Suspense, useEffect } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { getProfile, getUser, logout } from "@/lib/action/auth"
import { redirect } from "next/navigation"
import { Profile } from "@/types/auth"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  useEffect(() => {
    const getUserData = async () => {
      const user = await getUser();
      if (!user) redirect("/login");
      const profile = await getProfile(user.id);
      if (!profile) redirect("/login");
      setProfile(profile);
    }
    getUserData();
  }, [])

  if (!profile) return null;

  return (
    <div className="min-h-screen w-full bg-background">
      <AdminSidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
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
          <div className="w-full flex-1">{/* Search form removed */}</div>
          <Suspense fallback={<div>Loading...</div>}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  {profile?.image_path ? 
                    <Image
                      src={profile!.image_path}
                      width={32}
                      height={32}
                      alt="관리자 아바타"
                      className="rounded-full"
                    />
                    : <div>
                      {profile?.id.charAt(0).toUpperCase()}
                    </div>
                  }
                  <span className="sr-only">사용자 메뉴 토글</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>내 계정</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>설정</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>로그아웃</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Suspense>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
        <Toaster />
      </div>
    </div>
  )
}
