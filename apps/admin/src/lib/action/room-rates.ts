"use server";

import { createClient } from "@seclub/supabase/server";
import type { RoomRate } from "@/types/rooms";

export async function getRoomRates(): Promise<{ success: boolean; data: RoomRate[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("room_rates")
      .select("*")
      .order("type")
      .order("display_order");
    if (error) return { success: false, data: null, error: "요금 정보를 불러오는 중 오류가 발생했습니다." };
    return { success: true, data: data as RoomRate[], error: null };
  } catch {
    return { success: false, data: null, error: "요금 정보를 불러오는 중 오류가 발생했습니다." };
  }
}

export async function updateRoomRate(
  id: number,
  updates: Partial<Pick<RoomRate, "peak_rate" | "winter_rate" | "long_stay_discount" | "display_order">>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("room_rates").update(updates).eq("id", id);
    if (error) return { success: false, error: "요금 수정 중 오류가 발생했습니다." };
    return { success: true, error: null };
  } catch {
    return { success: false, error: "요금 수정 중 오류가 발생했습니다." };
  }
}
