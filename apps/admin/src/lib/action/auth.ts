"use server";

import { createClient } from "@seclub/supabase/server";

// NOTE: Email/password login + signup now live in the shared @seclub/auth SSO
// app. Admin only reads the (shared-cookie) session here and gates by role.

/**
 * Logout the current user
 */
export async function logout(): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "로그아웃 중 오류가 발생했습니다.",
    };
  }
}

export async function getUser() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  return user.user;
}

export async function getProfile(id: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profile").select("*").eq("id", id).single();

  return profile;
}

export async function changePassword(newPassword: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: "비밀번호는 최소 6자 이상이어야 합니다.",
      };
    }

    const supabase = await createClient();
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Password change error:", error);
      return {
        success: false,
        error: "비밀번호 변경에 실패했습니다.",
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected password change error:", error);
    return {
      success: false,
      error: "비밀번호 변경 중 오류가 발생했습니다.",
    };
  }
}
      