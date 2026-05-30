"use server";

import { createClient } from "@seclub/supabase/server";
import type { Tables } from "@seclub/supabase/types";

export type AdminSnsLink = Tables<"sns_links">;

export async function getSnsLinks(): Promise<{
  data: AdminSnsLink[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("sns_links")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching sns links:", error);
      return { data: null, error: "SNS 링크를 불러오는 중 오류가 발생했습니다." };
    }

    return { data: data as AdminSnsLink[], error: null };
  } catch (error) {
    console.error("SNS links fetch error:", error);
    return { data: null, error: "SNS 링크를 불러오는 중 오류가 발생했습니다." };
  }
}

export async function saveSnsLinks(
  rows: { id: string; url: string; active: boolean; sort_order: number }[],
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();

    for (const row of rows) {
      const { error } = await supabase
        .from("sns_links")
        .update({
          url: row.url.trim(),
          active: row.active,
          sort_order: row.sort_order,
        })
        .eq("id", row.id);

      if (error) {
        console.error("Error updating sns link:", error);
        return { success: false, error: "SNS 링크 저장 중 오류가 발생했습니다." };
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("SNS links save error:", error);
    return { success: false, error: "SNS 링크 저장 중 오류가 발생했습니다." };
  }
}
