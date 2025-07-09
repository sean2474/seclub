import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/assets/header";
import { Footer } from "@/assets/footer";

export const metadata: Metadata = {
  title: "SE클럽 | 태안둘레길캠핑장",
  description: "충청남도 태안군에 위치한 SE클럽(태안둘레길캠핑장)의 공식 웹사이트입니다. 객실 예약, 캠핑장 예약, 시설 안내 등 다양한 정보를 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`$antialiased font-pretendard font-thin`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
