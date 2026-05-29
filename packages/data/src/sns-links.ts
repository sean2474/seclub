import { createClient } from "@seclub/supabase/server";
import type { Tables } from "@seclub/supabase/types";

type SnsClient = Awaited<ReturnType<typeof createClient>>;

export type SnsLink = Pick<
  Tables<"sns_links">,
  "id" | "platform" | "label" | "url" | "active" | "sort_order"
>;

/**
 * Read the SNS links that should appear on the public site: active rows that
 * have a URL set, ordered by `sort_order`. Returns `[]` when fetching fails —
 * callers should not treat this as an error path.
 *
 * Icons are mapped from `platform` in the client (react-icons), so the icon is
 * not stored in the DB.
 */
export async function fetchSnsLinks(client?: SnsClient): Promise<SnsLink[]> {
  try {
    const supabase = client ?? (await createClient())
    const { data, error } = await supabase
      .from("sns_links")
      .select("id, platform, label, url, active, sort_order")
      .eq("active", true)
      .neq("url", "")
      .order("sort_order", { ascending: true })
    if (error || !data) return []
    return data
  } catch {
    return []
  }
}
