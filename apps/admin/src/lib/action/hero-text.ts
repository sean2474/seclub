"use server";

import { createClient } from "@/lib/supabase/server";
import type { HeroText } from "@/types/hero-text";

export async function getHeroText(): Promise<{
  success: boolean;
  data: HeroText | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("main_hero_text")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching hero text:", error);
      return { success: false, data: null, error: "메인 문구를 불러오는 중 오류가 발생했습니다." };
    }

    return { success: true, data: data as HeroText, error: null };
  } catch (error) {
    console.error("Hero text fetch error:", error);
    return { success: false, data: null, error: "메인 문구를 불러오는 중 오류가 발생했습니다." };
  }
}

export async function updateHeroText(updates: {
  tagline: string;
  heading_line1: string;
  heading_line2: string;
  button_text: string;
}): Promise<{
  success: boolean;
  data: HeroText | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    // 기존 행의 ID 조회
    const { data: existing, error: fetchError } = await supabase
      .from("main_hero_text")
      .select("id")
      .limit(1)
      .single();

    if (fetchError || !existing) {
      console.error("Error fetching hero text for update:", fetchError);
      return { success: false, data: null, error: "메인 문구 데이터를 찾을 수 없습니다." };
    }

    const { data, error } = await supabase
      .from("main_hero_text")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating hero text:", error);
      return { success: false, data: null, error: "메인 문구 수정 중 오류가 발생했습니다." };
    }

    return { success: true, data: data as HeroText, error: null };
  } catch (error) {
    console.error("Hero text update error:", error);
    return { success: false, data: null, error: "메인 문구 수정 중 오류가 발생했습니다." };
  }
}
