import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-6 md:gap-10">
            <a href="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">SE클럽</span>
            </a>
            <nav className="hidden md:flex gap-6">
              <a href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                소개
              </a>
              <a href="/rooms" className="text-sm font-medium transition-colors hover:text-primary">
                객실
              </a>
              <a href="/camping" className="text-sm font-medium transition-colors hover:text-primary">
                캠핑
              </a>
              <a href="/facilities" className="text-sm font-medium transition-colors hover:text-primary">
                부대시설
              </a>
              <a href="/gallery" className="text-sm font-medium transition-colors hover:text-primary">
                갤러리
              </a>
              <a href="/reservation" className="text-sm font-medium transition-colors hover:text-primary">
                예약
              </a>
              <a href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                문의
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {/* 모바일 메뉴 버튼은 추후 구현 */}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} SE클럽. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="text-sm text-muted-foreground hover:underline">
              개인정보처리방침
            </a>
            <a href="/terms" className="text-sm text-muted-foreground hover:underline">
              이용약관
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
