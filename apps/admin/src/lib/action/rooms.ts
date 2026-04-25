"use server";

import { createClient } from "@/lib/supabase/server";
import type { RoomRate, LateCheckoutRate, DiscountRate, RoomInfo } from "@/types/rooms";

// ===== Room Rates =====
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
  id: string,
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

// ===== Late Checkout Rates =====
export async function getLateCheckoutRates(): Promise<{ success: boolean; data: LateCheckoutRate[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("late_checkout_rates")
      .select("id, room_rates_id, hours_3, hours_6, room_rates(name)");
    if (error) return { success: false, data: null, error: "레이트체크아웃 요금을 불러오는 중 오류가 발생했습니다." };
    const mapped = (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      room_rates_id: row.room_rates_id as string,
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
  id: string,
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

// ===== Discount Rates =====
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
  id: string,
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

// ===== Room Infos =====
export async function getRoomInfos(): Promise<{ success: boolean; data: RoomInfo[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("room_infos").select("slug, data, is_active");
    if (error) return { success: false, data: null, error: "객실 정보를 불러오는 중 오류가 발생했습니다." };
    return { success: true, data: data as RoomInfo[], error: null };
  } catch {
    return { success: false, data: null, error: "객실 정보를 불러오는 중 오류가 발생했습니다." };
  }
}

export async function updateRoomInfo(
  slug: string,
  updates: { data?: Record<string, unknown>; is_active?: boolean }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("room_infos").update(updates).eq("slug", slug);
    if (error) return { success: false, error: "객실 정보 수정 중 오류가 발생했습니다." };
    return { success: true, error: null };
  } catch {
    return { success: false, error: "객실 정보 수정 중 오류가 발생했습니다." };
  }
}
