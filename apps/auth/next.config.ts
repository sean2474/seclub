import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@seclub/utils", "@seclub/supabase", "@seclub/ui", "@seclub/data"],
  images: { unoptimized: true },
  devIndicators: false,
  // Allow local SSO subdomains (see scripts/setup-local-domains.sh) to make
  // cross-origin dev requests so HMR/RSC works when served via *.seclub.local.
  allowedDevOrigins: [
    "seclub.local",
    "auth.seclub.local",
    "admin.seclub.local",
    "my.seclub.local",
    "reserve.seclub.local",
  ],
};

export default nextConfig;
