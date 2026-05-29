import { createClient } from "@seclub/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@seclub/supabase/types";

type CategoryClient = SupabaseClient<Database>;

/**
 * Returns the union of categories from the `category` seed table and any
 * categories actually used by notices. When the `category` table is empty,
 * falls back to the distinct categories on `notice` rows.
 *
 * @param activeOnly  when true, only consider active notices for the fallback.
 */
export async function fetchCategoryNames(
  activeOnly = false,
  client?: CategoryClient,
): Promise<string[]> {
  try {
    const supabase = client ?? (await createClient())

    const { data: catData } = await supabase.from("category").select("type").order("type")
    const tableCats = (catData ?? []).map((c: { type: string }) => c.type)

    if (tableCats.length > 0) return tableCats

    // Fallback when the category table is empty: derive from existing notices.
    let noticeQuery = supabase.from("notice").select("category")
    if (activeOnly) noticeQuery = noticeQuery.eq("active", true)
    const { data: noticeData } = await noticeQuery

    const noticeCats = Array.from(
      new Set(
        (noticeData ?? [])
          .map((n: { category: string }) => n.category)
          .filter(Boolean),
      ),
    ).sort()
    return noticeCats
  } catch (err) {
    console.error("Unexpected error fetching categories:", err)
    return []
  }
}
