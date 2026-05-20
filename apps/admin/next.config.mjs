/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@seclub/utils", "@seclub/supabase", "@seclub/ui"],
}

export default nextConfig
