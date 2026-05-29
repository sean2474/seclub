"use server"

import { Notice, NoticeDetail } from "@/types"
import { fetchNotices, fetchNoticeById } from "@seclub/data/notice";
import { fetchCategoryNames } from "@seclub/data/category";
import { createClient as createPublicClient } from "@seclub/supabase/public";

/**
 * Fetch all *active* notices for the public landing list.
 * Uses the cookie-less public client so the notices page can be statically
 * cached (ISR) instead of re-rendering on every request.
 */
export async function getNotices(): Promise<{
  success: boolean;
  data: Notice[] | null;
  error: string | null;
}> {
  const { data, error } = await fetchNotices<Notice>(
    {
      activeOnly: true,
      columns: "id, category, title, created_at, view, pinned",
    },
    createPublicClient(),
  )
  if (error) return { success: false, data: null, error }
  return { success: true, data, error: null }
}

export const getNoticeCategories = async (): Promise<string[]> =>
  fetchCategoryNames(true, createPublicClient())

export const getNoticeById = async (id: string): Promise<NoticeDetail | null> => {
  const { data } = await fetchNoticeById(id, createPublicClient())
  return data as NoticeDetail | null
}
