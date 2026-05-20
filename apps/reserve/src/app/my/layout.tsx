import type { Metadata } from "next";
import Link from "next/link";
import { MockAuthProvider } from "@/lib/mock-auth";
import { MyNavigation } from "./_components/my-navigation";

export const metadata: Metadata = {
  title: "마이페이지 | SE CLUB",
  description: "예약 관리, 멤버십, 프로필 관리",
};

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MockAuthProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-foreground/10 bg-white">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
            <Link href="/my" className="flex flex-col items-center">
              <span className="text-lg font-light tracking-[0.3em] text-foreground">SE</span>
              <span className="text-[9px] font-light tracking-[0.15em] text-foreground -mt-1">CLUB</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/my/lookup"
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                예약조회
              </Link>
              <Link
                href="/"
                className="text-sm text-foreground/60 hover:text-foreground"
              >
                메인사이트
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full shrink-0 lg:w-56">
              <MyNavigation />
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </div>
    </MockAuthProvider>
  );
}
