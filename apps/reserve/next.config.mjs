/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@seclub/ui", "@seclub/utils", "@seclub/supabase"],
}

export default nextConfig
