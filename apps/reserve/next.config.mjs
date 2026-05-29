/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@seclub/ui", "@seclub/utils", "@seclub/supabase"],
  // Allow local SSO subdomains (see scripts/setup-local-domains.sh) to make
  // cross-origin dev requests so HMR/RSC works when served via *.seclub.local.
  allowedDevOrigins: [
    "seclub.local",
    "auth.seclub.local",
    "admin.seclub.local",
    "my.seclub.local",
    "reserve.seclub.local",
  ],
}

export default nextConfig
