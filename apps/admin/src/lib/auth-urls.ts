/**
 * Helpers for redirecting to the shared `@seclub/auth` SSO app.
 *
 * `NEXT_PUBLIC_AUTH_URL` is set per environment (http://auth.seclub.local:3004
 * in dev, https://auth.seclub.kr in prod). `NEXT_PUBLIC_ADMIN_URL` is this
 * app's own base, used as the post-login `next` target.
 */
export function authBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_AUTH_URL) return process.env.NEXT_PUBLIC_AUTH_URL
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//auth.${window.location.host}`
  }
  return "https://auth.seclub.kr"
}

function buildAuthUrl(path: "/login" | "/signup", nextUrl?: string): string {
  const base = authBaseUrl()
  if (!nextUrl) return `${base}${path}`
  const params = new URLSearchParams({ next: nextUrl })
  return `${base}${path}?${params.toString()}`
}

export const loginUrl = (nextUrl?: string) => buildAuthUrl("/login", nextUrl)
export const signupUrl = (nextUrl?: string) => buildAuthUrl("/signup", nextUrl)

/**
 * This app's own base URL — the post-login destination. Prefer the env var
 * (works server-side); fall back to the live origin in the browser.
 */
export function adminBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_ADMIN_URL) return process.env.NEXT_PUBLIC_ADMIN_URL
  if (typeof window !== "undefined") return window.location.origin
  return "https://admin.seclub.kr"
}

/** Current page as a full URL (client only), suitable for `nextUrl`. */
export function currentUrl(): string | undefined {
  if (typeof window === "undefined") return undefined
  return window.location.href
}
