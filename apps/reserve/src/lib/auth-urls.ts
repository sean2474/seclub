/**
 * Helpers for redirecting visitors to the shared `@seclub/auth` SSO app.
 *
 * `NEXT_PUBLIC_AUTH_URL` should be set per environment (e.g. http://localhost:3004
 * in dev, https://auth.seclub.kr in production). When unset, falls back to a
 * sub-domain heuristic so the login link still resolves in unconfigured envs.
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

/**
 * Build the SSO login URL. Pass `nextUrl` (typically the current page) so the
 * user is sent back here after a successful login.
 */
export const loginUrl = (nextUrl?: string) => buildAuthUrl("/login", nextUrl)
export const signupUrl = (nextUrl?: string) => buildAuthUrl("/signup", nextUrl)

/** Return the current page as a full URL, suitable for use as `nextUrl`. */
export function currentUrl(): string | undefined {
  if (typeof window === "undefined") return undefined
  return window.location.href
}
