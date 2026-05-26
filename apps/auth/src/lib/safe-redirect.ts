/**
 * Validate and normalize a post-login `next` URL so we never redirect to an
 * arbitrary host. Returns `fallback` when the URL is missing, malformed, or
 * points outside the allowlist.
 *
 * The allowlist is derived from the comma-separated NEXT_PUBLIC_ALLOWED_REDIRECTS
 * env var. Same-origin URLs (no host, just a path) are always allowed.
 */
export function safeRedirect(rawNext: string | null | undefined, fallback: string): string {
  if (!rawNext) return fallback
  try {
    // Treat as URL relative to a placeholder base so relative paths parse cleanly.
    const url = new URL(rawNext, "http://_relative")
    const isRelative = url.host === "_relative"
    if (isRelative) return url.pathname + url.search + url.hash

    const allowed = (process.env.NEXT_PUBLIC_ALLOWED_REDIRECTS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    const matches = allowed.some((entry) => {
      try {
        const allow = new URL(entry)
        return allow.origin === url.origin
      } catch {
        return false
      }
    })
    return matches ? url.toString() : fallback
  } catch {
    return fallback
  }
}
