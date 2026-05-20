import "./globals.css";

export const metadata = {
  title: "마이페이지 · seclub",
  description: "내 예약·결제 관리",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
