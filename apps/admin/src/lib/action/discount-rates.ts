"use server";

import { createClient } from "@seclub/supabase/server";
import type { DiscountRate } from "@/types/rooms";

export async function getDiscountRates(): Promise<{ success: boolean; data: DiscountRate[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("discount_rates")
      .select("*")
      .order("season")
      .order("category")
      .order("nights");
    if (error) return { success: false, data: null, error: "할인율 정보를 불러오는 중 오류가 발생했습니다." };
    return { success: true, data: data as DiscountRate[], error: null };
  } catch {
    return { success: false, data: null, error: "할인율 정보를 불러오는 중 오류가 발생했습니다." };
  }
}

export async function updateDiscountRate(
  id: number,
  updates: { discount_percent: number }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("discount_rates").update(updates).eq("id", id);
    if (error) return { success: false, error: "할인율 수정 중 오류가 발생했습니다." };
    return { success: true, error: null };
  } catch {
    return { success: false, error: "할인율 수정 중 오류가 발생했습니다." };
  }
}
