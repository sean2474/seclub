"use server";

import { createClient } from "@seclub/supabase/server";
import type { Json } from "@seclub/supabase/types";
import type { RoomInfo } from "@/types/rooms";

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
  updates: { data?: RoomInfo["data"]; is_active?: boolean }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient();
    const payload: { data?: Json; is_active?: boolean } = {};
    if (updates.data !== undefined) payload.data = updates.data as unknown as Json;
    if (updates.is_active !== undefined) payload.is_active = updates.is_active;
    const { error } = await supabase.from("room_infos").update(payload).eq("slug", slug);
    if (error) return { success: false, error: "객실 정보 수정 중 오류가 발생했습니다." };
    return { success: true, error: null };
  } catch {
    return { success: false, error: "객실 정보 수정 중 오류가 발생했습니다." };
  }
}
