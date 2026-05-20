import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "./database.types";

export type UpdateSessionOptions = {
  /**
   * Path prefix that requires an authenticated user. When unauthenticated and
   * the request path starts with this prefix, the user is redirected to
   * `signInPath`. If omitted, no path-based protection is applied.
   */
  protectedPrefix?: string;
  /**
   * Destination for unauthenticated users hitting `protectedPrefix`.
   * Required when `protectedPrefix` is set.
   */
  signInPath?: string;
  /**
   * If set and the request path equals `redirectFrom` while authenticated,
   * the user is redirected to `redirectTo`. Useful for sending logged-in users
   * away from the public landing page or sign-in form.
   */
  redirectFrom?: string;
  redirectTo?: string;
};

export const updateSession = async (
  request: NextRequest,
  options: UpdateSessionOptions = {},
) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    const user = await supabase.auth.getUser();
    const { protectedPrefix, signInPath, redirectFrom, redirectTo } = options;

    if (
      protectedPrefix &&
      signInPath &&
      request.nextUrl.pathname.startsWith(protectedPrefix) &&
      user.error
    ) {
      return NextResponse.redirect(new URL(signInPath, request.url));
    }

    if (
      redirectFrom &&
      redirectTo &&
      request.nextUrl.pathname === redirectFrom &&
      !user.error
    ) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
