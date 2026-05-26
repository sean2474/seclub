"use server";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@seclub/supabase/server";

/**
 * Login with email and password
 */
export async function loginWithEmail(email: string, password: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    if (!email || !password) {
      return {
        success: false,
        error: "이메일과 비밀번호를 모두 입력해주세요.",
      };
    }

    const supabase = await createClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected login error:", error);
    return {
      success: false,
      error: "로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
}

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

/**
 * Check if the user is authenticated
 */
export async function checkAuth(): Promise<{
  isAuthenticated: boolean;
  user: User | null;
}> {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return {
        isAuthenticated: false,
        user: null,
      };
    }

    return {
      isAuthenticated: true,
      user: session.user,
    };
  } catch (error) {
    console.error("Auth check error:", error);
    return {
      isAuthenticated: false,
      user: null,
    };
  }
}

/**
 * Middleware to redirect authenticated users
 */
export async function redirectIfAuthenticated(redirectTo: string = "/") {
  const { isAuthenticated } = await checkAuth();
  
  if (isAuthenticated) {
    redirect(redirectTo);
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

export async function registerWithEmail(email: string, password: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    if (!email || !password) {
      return {
        success: false,
        error: "이메일과 비밀번호를 모두 입력해주세요.",
      };
    }

    const supabase = await createClient();
    
    const emailRedirectTo =
      process.env.NEXT_PUBLIC_ADMIN_URL ||
      (typeof window !== "undefined" ? window.location.origin : undefined);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: emailRedirectTo ? { emailRedirectTo } : undefined,
    });

    if (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: "가입에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected register error:", error);
    return {
      success: false,
      error: "가입 중 오류가 발생했습니다. 다시 시도해주세요.",
    };
  }
}
      