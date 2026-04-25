"use server";

import { createClient } from "@/lib/supabase/server";

export interface WellnessProgram {
  slug: string;
  header: {
    title: string;
    subtitle: string;
    type: string;
    location: string;
    hours: string;
    image: string;
  };
  contents: string[];
  images: string[];
  updated_at: string;
}

export async function getWellnessPrograms(): Promise<{
  success: boolean;
  data: WellnessProgram[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("wellness_programs")
      .select("*")
      .order("slug");
    if (error) return { success: false, data: null, error: "웰니스 프로그램을 불러오는 중 오류가 발생했습니다." };
    return { success: true, data: data as WellnessProgram[], error: null };
  } catch {
    return { success: false, data: null, error: "웰니스 프로그램을 불러오는 중 오류가 발생했습니다." };
  }
}

export async function upsertWellnessProgram(
  program: WellnessProgram
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("wellness_programs")
      .upsert({
        slug: program.slug,
        header: program.header,
        contents: program.contents,
        images: program.images,
        updated_at: new Date().toISOString(),
      });
    if (error) return { success: false, error: "웰니스 프로그램 수정 중 오류가 발생했습니다." };
    return { success: true, error: null };
  } catch {
    return { success: false, error: "웰니스 프로그램 수정 중 오류가 발생했습니다." };
  }
}
