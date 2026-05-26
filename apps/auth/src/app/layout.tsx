import "./globals.css";
import { Toaster } from "@seclub/ui/toaster";

export const metadata = {
  title: "Auth · seclub",
  description: "SSO 인증",
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
