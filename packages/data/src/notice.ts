import { createClient } from "@seclub/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@seclub/supabase/types";

/** Either the cookie-based server client or the cookie-less public client. */
type NoticeClient = SupabaseClient<Database>;

export type NoticeRow = Tables<"notice">;

export type NoticeListItem = Pick<
  NoticeRow,
  "id" | "category" | "title" | "created_at" | "view" | "pinned"
>;

/**
 * Convert legacy plain-text notice content (with literal `\n`) into real
 * newlines, while leaving HTML notices untouched.
 */
export function normalizeNoticeContent<T extends { content: string | null }>(
  notice: T,
): T {
  if (notice.content && !notice.content.startsWith("<")) {
    notice.content = notice.content.replace(/\\n/g, "\n")
  }
  return notice
}

interface FetchNoticesOptions {
  /** When true, only return notices with active=true. */
  activeOnly?: boolean
  /** When provided, restrict the returned columns. */
  columns?: string
}

/**
 * Shared notice list reader for landing/admin. Defaults to listing all
 * notices, sorted by pinned then created_at desc, with content normalized.
 */
export async function fetchNotices<T = NoticeRow>(
  options: FetchNoticesOptions = {},
  client?: NoticeClient,
): Promise<{ data: T[] | null; error: string | null }> {
  try {
    const supabase = client ?? (await createClient())
    let query = supabase
      .from("notice")
      .select(options.columns ?? "*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
    if (options.activeOnly) query = query.eq("active", true)

    const { data, error } = await query

    if (error) {
      console.error("Error fetching notices:", error)
      return { data: null, error: "공지사항을 불러오는 중 오류가 발생했습니다." }
    }
    const rows = (data ?? []) as Array<{ content?: string | null }>
    rows.forEach((row) => normalizeNoticeContent(row as { content: string | null }))
    return { data: rows as unknown as T[], error: null }
  } catch (error) {
    console.error("Unexpected error fetching notices:", error)
    return { data: null, error: "공지사항을 불러오는 중 오류가 발생했습니다." }
  }
}

/**
 * Read a single notice by id. Returns `null` when not found or on error.
 */
export async function fetchNoticeById(
  id: string,
  client?: NoticeClient,
): Promise<{ data: NoticeRow | null; error: string | null }> {
  try {
    const supabase = client ?? (await createClient())
    const { data, error } = await supabase
      .from("notice")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Error fetching notice with ID ${id}:`, error)
      return { data: null, error: "공지사항을 불러오는 중 오류가 발생했습니다." }
    }
    if (!data) return { data: null, error: "해당 공지사항을 찾을 수 없습니다." }
    return { data: normalizeNoticeContent(data), error: null }
  } catch (error) {
    console.error(`Unexpected error fetching notice with ID ${id}:`, error)
    return { data: null, error: "공지사항을 불러오는 중 오류가 발생했습니다." }
  }
}
