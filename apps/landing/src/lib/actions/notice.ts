"use server"

import { Notice, NoticeDetail } from "@/types"
import { fetchNotices, fetchNoticeById } from "@seclub/data/notice";
import { fetchCategoryNames } from "@seclub/data/category";

/**
 * Fetch all *active* notices for the public landing list.
 */
export async function getNotices(): Promise<{
  success: boolean;
  data: Notice[] | null;
  error: string | null;
}> {
  const { data, error } = await fetchNotices<Notice>({
    activeOnly: true,
    columns: "id, category, title, created_at, view, pinned",
  })
  if (error) return { success: false, data: null, error }
  return { success: true, data, error: null }
}

export const getNoticeCategories = async (): Promise<string[]> =>
  fetchCategoryNames(true)

export const getNoticeById = async (id: string): Promise<NoticeDetail | null> => {
  const { data } = await fetchNoticeById(id)
  return data as NoticeDetail | null
}
