"use server"

import { Notice, NoticeDetail } from "@/types"
import { createClient } from "@/lib/supabase/server";

/**
 * Fetch all notices from the database
 */
export async function getNotices(): Promise<{
  success: boolean;
  data: Notice[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("notice")
      .select("id, category, title, created_at, view, pinned")
      .eq("active", true)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching notices:", error);
      return {
        success: false,
        data: null,
        error: "공지사항을 불러오는 중 오류가 발생했습니다.",
      };
    }

    return {
      success: true,
      data: data,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error fetching notices:", error);
    return {
      success: false,
      data: null,
      error: "공지사항을 불러오는 중 오류가 발생했습니다.",
    };
  }
}

export const getNoticeCategories = async () : Promise<string[]> => {
  try {
    const supabase = await createClient();

    const [{ data: catData }, { data: noticeData }] = await Promise.all([
      supabase.from("category").select("type"),
      supabase.from("notice").select("category").eq("active", true),
    ]);

    const tableCats = (catData || []).map((c: { type: string }) => c.type);
    const noticeCats = (noticeData || [])
      .map((n: { category: string }) => n.category)
      .filter(Boolean);

    return Array.from(new Set([...tableCats, ...noticeCats])).sort();
  } catch {
    return [];
  }
}

export const getNoticeById = async (id: string) : Promise<NoticeDetail | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notice")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching notice:", error);
    return null;
  }

  // 기존 plain text 호환: HTML이 아닌 경우만 \n 변환
  if (data.content && !data.content.startsWith("<")) {
    data.content = data.content.replace(/\\n/g, "\n");
  }

  return data;
}