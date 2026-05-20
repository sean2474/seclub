"use server";

import { createClient } from "@seclub/supabase/server";
import type { Notice } from "@/types/notices";
import crypto from "crypto";

/**
 * HTML 콘텐츠 내 base64 이미지를 Supabase Storage에 업로드하고 URL로 교체.
 * 업로드 실패 시 throw — base64를 그대로 DB에 저장하면 페이로드가 너무 크거나
 * 일부 이미지만 보이는 문제가 생기므로 호출자가 처리하도록 한다.
 */
async function uploadHtmlImages(
  html: string,
  noticeUuid: string,
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string> {
  // 같은 dataUrl이 여러 번 등장해도 모두 잡도록 unique 추출 후 순차 처리
  const base64Regex = /src="(data:image\/[^;]+;base64,[^"]+?)"/g;
  const dataUrls = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = base64Regex.exec(html)) !== null) {
    dataUrls.add(m[1]);
  }

  if (dataUrls.size === 0) return html;

  let result = html;

  for (const dataUrl of dataUrls) {
    const base64Data = dataUrl.split(",")[1];
    if (!base64Data) continue;

    const mimeMatch = dataUrl.match(/data:(image\/([^;]+));/);
    const contentType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const rawExt = mimeMatch ? mimeMatch[2].toLowerCase() : "jpeg";
    // 지원 확장자만 매핑, 그 외는 jpg로
    const extMap: Record<string, string> = {
      png: "png",
      gif: "gif",
      webp: "webp",
      svg: "svg",
      "svg+xml": "svg",
      jpeg: "jpg",
      jpg: "jpg",
    };
    const ext = extMap[rawExt] || "jpg";

    const blob = Buffer.from(base64Data, "base64");
    const filename = `${noticeUuid}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("notice")
      .upload(filename, blob, { contentType, upsert: false });

    if (uploadError) {
      console.error("Error uploading notice image:", uploadError, { filename });
      // base64를 그대로 두면 일부 이미지만 보이거나 페이로드 폭주의 원인이 됨
      throw new Error(
        `이미지 업로드에 실패했습니다 (${uploadError.message}). 잠시 후 다시 시도해주세요.`
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("notice").getPublicUrl(filename);

    // 같은 dataUrl이 본문에 여러 번 등장하는 경우까지 모두 교체
    // (split/join 은 정규식 escape 없이 전체 치환을 안전하게 수행)
    result = result.split(dataUrl).join(publicUrl);
  }

  return result;
}

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
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notices:", error);
      return { success: false, data: null, error: "공지사항을 불러오는 중 오류가 발생했습니다." };
    }

    const notices = data.map((notice: Notice) => {
      // 기존 plain text 호환: HTML이 아닌 경우만 \n 변환
      if (!notice.content.startsWith("<")) {
        notice.content = notice.content.replace(/\\n/g, "\n");
      }
      return notice;
    });

    return { success: true, data: notices, error: null };
  } catch (error) {
    console.error("Unexpected error fetching notices:", error);
    return { success: false, data: null, error: "공지사항을 불러오는 중 오류가 발생했습니다." };
  }
}

/**
 * Get a single notice by ID
 */
export async function getNoticeById(id: string): Promise<{
  success: boolean;
  data: Notice | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("notice")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching notice with ID ${id}:`, error);
      return { success: false, data: null, error: "공지사항을 불러오는 중 오류가 발생했습니다." };
    }

    if (!data) {
      return { success: false, data: null, error: "해당 공지사항을 찾을 수 없습니다." };
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error(`Unexpected error fetching notice with ID ${id}:`, error);
    return { success: false, data: null, error: "공지사항을 불러오는 중 오류가 발생했습니다." };
  }
}

/**
 * Create a new notice with HTML content
 */
export async function createNotice(noticeData: {
  title: string;
  content: string;
  category: string;
  active: boolean;
  pinned?: boolean;
}): Promise<{
  success: boolean;
  data: Notice | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    const noticeUuid = crypto.randomUUID();

    // HTML 내 base64 이미지 → Supabase Storage 업로드
    const processedContent = await uploadHtmlImages(
      noticeData.content,
      noticeUuid,
      supabase
    );

    const { data, error } = await supabase
      .from("notice")
      .insert({
        id: noticeUuid,
        title: noticeData.title,
        content: processedContent,
        category: noticeData.category,
        active: noticeData.active,
        pinned: noticeData.pinned || false,
        images: null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating notice:", error);
      return { success: false, data: null, error: "공지사항 생성 중 오류가 발생했습니다." };
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Unexpected error creating notice:", error);
    const msg = error instanceof Error ? error.message : "공지사항 생성 중 오류가 발생했습니다.";
    return { success: false, data: null, error: msg };
  }
}

/**
 * Update an existing notice
 */
export async function updateNotice(
  id: string,
  noticeData: {
    title?: string;
    content?: string;
    category?: string;
    active?: boolean;
    pinned?: boolean;
  }
): Promise<{
  success: boolean;
  data: Notice | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    let processedContent = noticeData.content;
    if (processedContent) {
      processedContent = await uploadHtmlImages(processedContent, id, supabase);
    }

    const updateData: Record<string, unknown> = {};
    if (noticeData.title !== undefined) updateData.title = noticeData.title;
    if (processedContent !== undefined) updateData.content = processedContent;
    if (noticeData.category !== undefined) updateData.category = noticeData.category;
    if (noticeData.active !== undefined) updateData.active = noticeData.active;
    if (noticeData.pinned !== undefined) updateData.pinned = noticeData.pinned;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("notice")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating notice with ID ${id}:`, error);
      return { success: false, data: null, error: "공지사항 수정 중 오류가 발생했습니다." };
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error(`Unexpected error updating notice with ID ${id}:`, error);
    const msg = error instanceof Error ? error.message : "공지사항 수정 중 오류가 발생했습니다.";
    return { success: false, data: null, error: msg };
  }
}

/**
 * Delete a notice and its images from storage
 */
export async function deleteNotice(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    // 스토리지에서 해당 notice 폴더 전체 삭제
    const { data: files } = await supabase.storage
      .from("notice")
      .list(id);

    if (files && files.length > 0) {
      const filePaths = files.map((f) => `${id}/${f.name}`);
      await supabase.storage.from("notice").remove(filePaths);
    }

    // 기존 images 컬럼의 이미지도 삭제 (하위 호환)
    const { data: notice } = await supabase
      .from("notice")
      .select("images")
      .eq("id", id)
      .single();

    if (notice?.images && notice.images.length > 0) {
      const oldFilenames = notice.images
        .map((url: string) => {
          const parts = url.split("/storage/v1/object/public/notice/");
          return parts[1] || null;
        })
        .filter(Boolean) as string[];

      if (oldFilenames.length > 0) {
        await supabase.storage.from("notice").remove(oldFilenames);
      }
    }

    const { error: deleteError } = await supabase
      .from("notice")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(`Error deleting notice with ID ${id}:`, deleteError);
      return { success: false, error: "공지사항 삭제 중 오류가 발생했습니다." };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error(`Unexpected error deleting notice with ID ${id}:`, error);
    return { success: false, error: "공지사항 삭제 중 오류가 발생했습니다." };
  }
}
