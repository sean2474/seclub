import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.youtube.com", "nqsogxcasyjauqgwmrxi.supabase.co"],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://seclub.kr/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
