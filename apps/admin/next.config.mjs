/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@seclub/utils", "@seclub/supabase", "@seclub/ui", "@seclub/data"],
}

export default nextConfig
