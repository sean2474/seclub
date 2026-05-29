import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

// Share the session cookie across SSO subdomains (e.g. *.seclub.local in dev,
// .seclub.kr in prod) via a parent-domain cookie. Unset → host-only cookie.
const cookieDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined;

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    cookieDomain ? { cookieOptions: { domain: cookieDomain } } : undefined,
  );
