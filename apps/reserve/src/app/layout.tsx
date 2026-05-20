import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SE CLUB | 예약",
  description: "전 객실에서 오션뷰를 감상할 수 있으며, 전용 야외발코니에서 프라이빗 요리를 즐길 수 있습니다",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
