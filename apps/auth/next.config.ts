import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@seclub/utils", "@seclub/supabase", "@seclub/ui", "@seclub/data"],
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
