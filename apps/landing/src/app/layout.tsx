import "./globals.css";
import { Header } from "@/assets/header";
import { Footer } from "@/assets/footer";
import { ChatbotWidget } from "@/components/ui/chatbot-widget";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { getHeroText } from "@/lib/hero-text";

const Head = () => {
  const baseUrl = "https://seclub.kr";
  
  const title = "SE Club";
  const description = "충청남도 태안군에 위치한 SE Club(태안둘레길캠핑장 & 펜션)의 공식 웹사이트입니다.";
  
  const imagePath = "/logos/og_logo.png";
  const imageWidth = "1200";
  const imageHeight = "630";
  const imageAlt = `${title} logo`;

  const imageUrl = `${baseUrl}${imagePath}`;
  
  return (
    <head>
      {/* Google Tag Manager */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KWCLWZBD');`,
        }}
      />
      {/* End Google Tag Manager */}

      <meta name="naver-site-verification" content="09b041ea9831b1189ef5506af8983de8bcca77ab" />

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const heroText = await getHeroText();
  return (
    <html lang="ko" suppressHydrationWarning>
      <Head />
      <body className={`antialiased font-pretendard font-[400]`} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KWCLWZBD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <Header showNoticesBadge={heroText.notices_new_badge} />
        {children}
        <Footer />
        <ChatbotWidget />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
