import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/assets/header";
import { Footer } from "@/assets/footer";

export const metadata: Metadata = {
  title: "SE클럽 | 태안둘레길캠핑장",
  description: "충청남도 태안군에 위치한 SE클럽(태안둘레길캠핑장)의 공식 웹사이트입니다. 객실 예약, 캠핑장 예약, 시설 안내 등 다양한 정보를 제공합니다.",
};

const Head = () => {
  const baseUrl = "https://seclub.co.kr";
  
  const title = "SE클럽 | 태안둘레길캠핑장";
              
  const description = "충청남도 태안군에 위치한 SE클럽(태안둘레길캠핑장)의 공식 웹사이트입니다. 객실 예약, 캠핑장 예약, 시설 안내 등 다양한 정보를 제공합니다.";
  
  const imagePath = "/og_logo.png";
  const imageWidth = "2595";
  const imageHeight = "1211";
  const imageAlt = `${title} logo`;

  const imageUrl = `${baseUrl}${imagePath}`;
  
  return (
    <head>
      {/* Primary metadata */}
      <meta name="description" content={description} />
      
      {/* Open Graph protocol - required properties */}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={`${baseUrl}`} />
      
      {/* Open Graph protocol - optional properties */}
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={title} />
      <meta property="og:locale" content="ko_KR" />
      
      {/* Open Graph protocol - structured image properties */}
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:image:alt" content={imageAlt} />
      
      {/* Twitter Card metadata */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
    </head>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head />
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
