"use server";

import { createClient } from "@seclub/supabase/server";
import type { LateCheckoutRate } from "@/types/rooms";

export async function getLateCheckoutRates(): Promise<{ success: boolean; data: LateCheckoutRate[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("late_checkout_rates")
      .select("id, room_id, hours_3, hours_6, room_rates(name)");
    if (error) return { success: false, data: null, error: "레이트체크아웃 요금을 불러오는 중 오류가 발생했습니다." };
    const mapped = (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as number,
      room_id: row.room_id as number,
      hours_3: row.hours_3 as number,
      hours_6: row.hours_6 as number,
      room_name: (row.room_rates as { name: string } | null)?.name || "",
    }));
    return { success: true, data: mapped, error: null };
  } catch {
    return { success: false, data: null, error: "레이트체크아웃 요금을 불러오는 중 오류가 발생했습니다." };
  }
}

export async function updateLateCheckoutRate(
  id: number,
  updates: { hours_3: number; hours_6: number }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("late_checkout_rates").update(updates).eq("id", id);
    if (error) return { success: false, error: "레이트체크아웃 요금 수정 중 오류가 발생했습니다." };
    return { success: true, error: null };
  } catch {
    return { success: false, error: "레이트체크아웃 요금 수정 중 오류가 발생했습니다." };
  }
}
