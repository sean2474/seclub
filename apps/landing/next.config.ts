import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@seclub/utils", "@seclub/supabase", "@seclub/ui", "@seclub/data"],
  // Allow local SSO subdomains (see scripts/setup-local-domains.sh) to make
  // cross-origin dev requests so HMR/RSC works when served via *.seclub.local.
  allowedDevOrigins: [
    "seclub.local",
    "auth.seclub.local",
    "admin.seclub.local",
    "my.seclub.local",
    "reserve.seclub.local",
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "nqsogxcasyjauqgwmrxi.supabase.co" },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [{ type: "host", value: "chat.seclub.kr" }],
          destination: "https://seclub.off2on.io/:path*",
        },
      ],
    };
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
