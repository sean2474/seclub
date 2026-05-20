"use server";

import { createClient } from "@seclub/supabase/server";
import type { Json } from "@seclub/supabase/types";

export interface CampingGuideSection {
  key: string;
  title: string;
  icon: string;
  items?: (string | { label: string; value: string })[];
  notes?: string[];
  footer?: string;
  content?: string;
  subsections?: {
    title: string;
    items?: (string | { label: string; value: string })[];
    content?: string;
  }[];
}

function parseCampingGuideSections(raw: Json): CampingGuideSection[] {
  if (!Array.isArray(raw)) return [];
  const valid = raw.filter(
    (s) =>
      s !== null &&
      typeof s === "object" &&
      !Array.isArray(s) &&
      typeof (s as { key?: unknown }).key === "string" &&
      typeof (s as { title?: unknown }).title === "string" &&
      typeof (s as { icon?: unknown }).icon === "string",
  );
  return valid as unknown as CampingGuideSection[];
}

export async function getCampingGuide(): Promise<{
  success: boolean;
  data: { id: string; sections: CampingGuideSection[] } | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("camping_guide")
      .select("id, sections")
      .limit(1)
      .single();
    if (error) return { success: false, data: null, error: "이용 가이드를 불러오는 중 오류가 발생했습니다." };
    return {
      success: true,
      data: { id: data.id, sections: parseCampingGuideSections(data.sections) },
      error: null,
    };
  } catch {
    return { success: false, data: null, error: "이용 가이드를 불러오는 중 오류가 발생했습니다." };
  }
}

export async function updateCampingGuide(
  id: string,
  sections: CampingGuideSection[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("camping_guide")
      .update({ sections: sections as unknown as Json, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { success: false, error: "이용 가이드 수정 중 오류가 발생했습니다." };
    return { success: true, error: null };
  } catch {
    return { success: false, error: "이용 가이드 수정 중 오류가 발생했습니다." };
  }
}
