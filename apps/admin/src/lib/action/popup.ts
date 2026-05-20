"use server";

import { createClient } from "@seclub/supabase/server";
import type { Popup } from "@/types/popup";

export async function getPopups(): Promise<{
  success: boolean;
  data: Popup[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("popups")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching popups:", error);
      return { success: false, data: null, error: "팝업을 불러오는 중 오류가 발생했습니다." };
    }

    return { success: true, data: data as Popup[], error: null };
  } catch (error) {
    console.error("Unexpected error fetching popups:", error);
    return { success: false, data: null, error: "팝업을 불러오는 중 오류가 발생했습니다." };
  }
}

export async function createPopup(popupData: {
  title: string;
  content?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  active: boolean;
  priority: number;
  start_date?: string | null;
  end_date?: string | null;
}): Promise<{
  success: boolean;
  data: Popup | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("popups")
      .insert({
        title: popupData.title,
        content: popupData.content || null,
        image_url: popupData.image_url || null,
        link_url: popupData.link_url || null,
        active: popupData.active,
        priority: popupData.priority,
        start_date: popupData.start_date || null,
        end_date: popupData.end_date || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating popup:", error);
      return { success: false, data: null, error: "팝업 등록 중 오류가 발생했습니다." };
    }

    return { success: true, data: data as Popup, error: null };
  } catch (error) {
    console.error("Popup creation error:", error);
    return { success: false, data: null, error: "팝업 등록 중 오류가 발생했습니다." };
  }
}

function extractPopupStoragePath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const m = url.pathname.match(/\/storage\/v1\/object\/public\/popups\/(.+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export async function updatePopup(
  id: string,
  updates: Partial<{
    title: string;
    content: string | null;
    image_url: string | null;
    link_url: string | null;
    active: boolean;
    priority: number;
    start_date: string | null;
    end_date: string | null;
  }>
): Promise<{
  success: boolean;
  data: Popup | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    // image_url이 바뀌는 경우 이전 파일을 cleanup 대상으로 식별
    let orphanedPath: string | null = null;
    if ("image_url" in updates) {
      const { data: existing } = await supabase
        .from("popups")
        .select("image_url")
        .eq("id", id)
        .single();
      if (existing?.image_url && existing.image_url !== updates.image_url) {
        orphanedPath = extractPopupStoragePath(existing.image_url);
      }
    }

    const { data, error } = await supabase
      .from("popups")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating popup:", error);
      return { success: false, data: null, error: "팝업 수정 중 오류가 발생했습니다." };
    }

    if (orphanedPath) {
      const { error: removeError } = await supabase.storage.from("popups").remove([orphanedPath]);
      if (removeError) {
        console.warn("Failed to cleanup orphaned popup image:", orphanedPath, removeError);
      }
    }

    return { success: true, data: data as Popup, error: null };
  } catch (error) {
    console.error("Popup update error:", error);
    return { success: false, data: null, error: "팝업 수정 중 오류가 발생했습니다." };
  }
}

export async function deletePopup(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    // 팝업의 이미지 URL 조회 후 스토리지에서도 삭제
    const { data: popup } = await supabase
      .from("popups")
      .select("image_url")
      .eq("id", id)
      .single();

    if (popup?.image_url) {
      const path = extractPopupStoragePath(popup.image_url);
      if (path) {
        await supabase.storage.from("popups").remove([path]);
      }
    }

    const { error } = await supabase
      .from("popups")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting popup:", error);
      return { success: false, error: "팝업 삭제 중 오류가 발생했습니다." };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Popup deletion error:", error);
    return { success: false, error: "팝업 삭제 중 오류가 발생했습니다." };
  }
}

export async function uploadPopupImage(
  popupId: string,
  base64Data: string,
  contentType: string
): Promise<{
  success: boolean;
  data: string | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const ext = contentType.split("/")[1] === "png" ? "png" : "jpg";
    const filename = `${popupId}/${crypto.randomUUID()}.${ext}`;
    const blob = Buffer.from(base64Data, "base64");

    const { error: uploadError } = await supabase.storage
      .from("popups")
      .upload(filename, blob, { contentType });

    if (uploadError) {
      console.error("Error uploading popup image:", uploadError);
      return { success: false, data: null, error: "이미지 업로드 중 오류가 발생했습니다." };
    }

    const { data: { publicUrl } } = supabase.storage
      .from("popups")
      .getPublicUrl(filename);

    return { success: true, data: publicUrl, error: null };
  } catch (error) {
    console.error("Popup image upload error:", error);
    return { success: false, data: null, error: "이미지 업로드 중 오류가 발생했습니다." };
  }
}
