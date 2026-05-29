import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "@seclub/ui/toaster";

export const metadata: Metadata = {
  title: "로그인 · SE Club",
  description: "SE Club 계정으로 로그인하고 회원 전용 예약·혜택을 이용하세요.",
  // Auth is an internal SSO surface — keep it out of search indexes.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#2f2a21",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
