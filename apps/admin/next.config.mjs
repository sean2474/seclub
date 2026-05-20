/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@seclub/utils", "@seclub/supabase", "@seclub/ui"],
}

export default nextConfig
