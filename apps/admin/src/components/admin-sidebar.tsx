"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tent, LayoutDashboard, ImageIcon, Megaphone, ChevronRight, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

interface AdminSidebarProps {
  isMobile?: boolean
  isCollapsed?: boolean
  onToggle?: () => void
}

export default function AdminSidebar({ isMobile = false, isCollapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "대시보드", icon: LayoutDashboard},
    { href: "/gallery", label: "갤러리 관리", icon: ImageIcon },
    { href: "/videos", label: "영상 갤러리", icon: Video },
    { href: "/notices", label: "공지사항 관리", icon: Megaphone },
  ]

  const baseClasses = "flex h-full max-h-screen flex-col gap-2"
  const desktopClasses =
    "hidden md:block fixed inset-y-0 left-0 z-20 border-r bg-muted/40 transition-[width] duration-300 ease-in-out"

  if (isMobile) {
    return (
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="" className="flex items-center gap-2 font-semibold">
            <Tent className="h-6 w-6" />
            <span className="">캠핑장 관리자</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className={cn(baseClasses, desktopClasses, isCollapsed ? "w-[70px]" : "w-[220px] lg:w-[280px] h-svh fixed")}>
        <div
          className={cn(
            "flex h-14 items-center border-b lg:h-[60px]",
            isCollapsed ? "justify-start px-2" : "px-4 lg:px-6",
          )}
        >
          <Link href="" className={cn("flex items-center gap-2 font-semibold", isCollapsed ? "pl-3.5" : "")}>
            <Image src="/logo.png" alt="logo" width={24} height={24} quality={100} />
            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">SECLUB 관리자</span>}
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav
            className={cn("grid items-start text-sm font-medium", isCollapsed ? "px-2" : "px-2 lg:px-4")}
          >
            {navItems.map((item) =>
              isCollapsed ? (
                <Tooltip key={item.label} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-12 w-full items-center justify-start pl-4.5 rounded-lg text-muted-foreground transition-colors hover:text-primary",
                        pathname === item.href && "bg-muted text-primary",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary h-12",
                    pathname === item.href && "bg-muted text-primary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <div className="h-12 overflow-hidden flex items-center whitespace-nowrap">{item.label}</div>
                </Link>
              ),
            )}
          </nav>
        </div>
        <div className={cn("absolute top-1/2 -translate-y-1/2 transition-all", isCollapsed ? "right-3.5" : "right-5")}>
          <div onClick={onToggle} className="w-full bg-transparent cursor-pointer border rounded-md p-2 hover:bg-foreground hover:text-background hover:border-foreground transition-colors duration-300">
            <ChevronRight className={cn("h-6 w-6 transition-transform duration-300 delay-500", isCollapsed ? "" : "rotate-180")} />
            <span className="sr-only">사이드바 토글</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
