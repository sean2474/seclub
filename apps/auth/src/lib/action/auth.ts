"use server";

import { redirect } from "next/navigation";
import { createClient } from "@seclub/supabase/server";
import { IS_AUTH_MOCK, MOCK_OTP, mockDelay } from "@/lib/auth-mode";

type Result = { success: boolean; error: string | null };

// ──────────────────────────── EMAIL ────────────────────────────

export async function loginWithEmail(email: string, password: string): Promise<Result> {
  try {
    if (!email || !password) {
      return { success: false, error: "이메일과 비밀번호를 모두 입력해주세요." };
    }
    if (IS_AUTH_MOCK) {
      await mockDelay();
      if (password.length < 6) {
        return { success: false, error: "비밀번호가 너무 짧습니다. (데모: 6자 이상)" };
      }
      return { success: true, error: null };
    }
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Login error:", error);
      return { success: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected login error:", error);
    return { success: false, error: "로그인 중 오류가 발생했습니다." };
  }
}

/**
 * Email signup. Returns a `needsConfirmation` flag so the client can route to
 * the "check your email" step when Supabase is set to require confirmation
 * (no session is returned in that case).
 *
 * `successUrl` is the final destination after the profile step. We chain it
 * through `emailRedirectTo` so the confirmation link lands the user on
 * /signup/profile and then forwards to where they were headed.
 */
export async function registerWithEmail(
  email: string,
  password: string,
  successUrl = "/",
): Promise<Result & { needsConfirmation?: boolean }> {
  try {
    if (!email || !password) {
      return { success: false, error: "이메일과 비밀번호를 모두 입력해주세요." };
    }
    if (IS_AUTH_MOCK) {
      await mockDelay();
      // Default mock branch sends user to the "check your email" step so the
      // full confirmation UX is reachable.
      return { success: true, error: null, needsConfirmation: true };
    }
    const supabase = await createClient();
    const base = process.env.NEXT_PUBLIC_AUTH_URL;
    const emailRedirectTo = base
      ? `${base}/auth/callback?next=${encodeURIComponent(
          `/signup/profile?next=${encodeURIComponent(successUrl)}`,
        )}`
      : undefined;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: emailRedirectTo ? { emailRedirectTo } : undefined,
    });
    if (error) {
      console.error("Register error:", error);
      return { success: false, error: "가입에 실패했습니다. 이메일을 확인해주세요." };
    }
    // When email confirmation is enabled, Supabase returns a user but no session.
    const needsConfirmation = !data.session && !!data.user;
    return { success: true, error: null, needsConfirmation };
  } catch (error) {
    console.error("Unexpected register error:", error);
    return { success: false, error: "가입 중 오류가 발생했습니다." };
  }
}

// ──────────────────────────── PHONE / OTP ────────────────────────────

/**
 * Start phone auth (sign-up + login share the same OTP send).
 * Requires Twilio (or another SMS provider) configured in Supabase Auth →
 * Providers → Phone. With Twilio in test mode only the verified test number
 * receives codes.
 */
export async function sendPhoneOtp(phone: string): Promise<Result> {
  try {
    if (!phone) return { success: false, error: "휴대폰 번호를 입력해주세요." };
    if (IS_AUTH_MOCK) {
      await mockDelay();
      return { success: true, error: null };
    }
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalizePhone(phone),
      options: { channel: "sms" },
    });
    if (error) {
      console.error("Send OTP error:", error);
      return { success: false, error: "인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요." };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected send OTP error:", error);
    return { success: false, error: "인증번호 발송 중 오류가 발생했습니다." };
  }
}

/**
 * Verify SMS OTP. On success, `needsProfile=true` when the user has no name
 * in their metadata yet — Supabase's `signInWithOtp` auto-creates an account
 * for any new number, so the login flow uses this flag to detect "new user
 * disguised as login" and re-route them to /signup/profile.
 */
export async function verifyPhoneOtp(
  phone: string,
  token: string,
): Promise<Result & { needsProfile?: boolean }> {
  try {
    if (!phone || !token) {
      return { success: false, error: "휴대폰 번호와 인증번호가 필요합니다." };
    }
    if (IS_AUTH_MOCK) {
      await mockDelay();
      if (token !== MOCK_OTP) {
        return { success: false, error: `데모 코드는 ${MOCK_OTP} 입니다.` };
      }
      return { success: true, error: null };
    }
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({
      phone: normalizePhone(phone),
      token,
      type: "sms",
    });
    if (error) {
      console.error("Verify OTP error:", error);
      return { success: false, error: "인증번호가 올바르지 않거나 만료되었습니다." };
    }
    const name = data.user?.user_metadata?.name;
    const hasName = typeof name === "string" && name.trim().length >= 2;
    return { success: true, error: null, needsProfile: !hasName };
  } catch (error) {
    console.error("Unexpected verify OTP error:", error);
    return { success: false, error: "인증 중 오류가 발생했습니다." };
  }
}

/**
 * Convert "010-1234-5678" / "01012345678" to E.164 (+821012345678).
 * Defaults to Korea (+82) when the input starts with 0.
 */
function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("82")) return `+${digits}`;
  if (digits.startsWith("0")) return `+82${digits.slice(1)}`;
  return `+${digits}`;
}

// ──────────────────────────── PASSWORD RESET ────────────────────────────

export async function sendPasswordResetEmail(email: string): Promise<Result> {
  try {
    if (!email) return { success: false, error: "이메일을 입력해주세요." };
    if (IS_AUTH_MOCK) {
      await mockDelay();
      return { success: true, error: null };
    }
    const supabase = await createClient();
    // Recovery link comes back to /auth/callback?type=recovery, which
    // exchanges the code for a session and then redirects to /reset-password.
    const redirectTo = process.env.NEXT_PUBLIC_AUTH_URL
      ? `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/callback?type=recovery`
      : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      console.error("Reset email error:", error);
      // Always return success so we don't leak account existence.
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected reset email error:", error);
    return { success: false, error: "메일 발송 중 오류가 발생했습니다." };
  }
}

export async function updatePassword(newPassword: string): Promise<Result> {
  try {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "비밀번호는 최소 6자 이상이어야 합니다." };
    }
    if (IS_AUTH_MOCK) {
      await mockDelay();
      return { success: true, error: null };
    }
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      console.error("Update password error:", error);
      return { success: false, error: "비밀번호 재설정에 실패했습니다. 링크를 다시 요청해주세요." };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected update password error:", error);
    return { success: false, error: "비밀번호 변경 중 오류가 발생했습니다." };
  }
}

// ──────────────────────────── PROFILE ────────────────────────────

/**
 * Persist additional sign-up info to `auth.users.user_metadata`. Called from
 * the /signup/profile step after any of the four entry methods finishes.
 */
export async function saveSignupProfile(input: { name: string }): Promise<Result> {
  try {
    const trimmed = input.name?.trim() ?? "";
    if (trimmed.length < 2) {
      return { success: false, error: "이름을 2자 이상 입력해주세요." };
    }
    if (IS_AUTH_MOCK) {
      await mockDelay();
      return { success: true, error: null };
    }
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
      data: { name: trimmed },
    });
    if (error) {
      console.error("Save profile error:", error);
      return { success: false, error: "프로필 저장에 실패했습니다." };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected save profile error:", error);
    return { success: false, error: "프로필 저장 중 오류가 발생했습니다." };
  }
}

// ──────────────────────────── SESSION ────────────────────────────

/**
 * Server-side redirect for users who already have a session. Pass a target
 * URL — typically the `?next=` query param — so the visitor lands back on
 * the originating app.
 */
export async function redirectIfAuthenticated(target: string) {
  if (IS_AUTH_MOCK) return; // Always treat the visitor as logged out in mock.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(target);
}

/**
 * For the /signup/profile step — let the user through only if there *is* a
 * session (they came through one of the entry flows). If not, push them back
 * to /signup so they can pick a method.
 */
export async function requireSessionForProfile(): Promise<{ name: string | null }> {
  if (IS_AUTH_MOCK) return { name: null };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signup");
  const name =
    typeof user.user_metadata?.name === "string" ? user.user_metadata.name : null;
  return { name };
}
