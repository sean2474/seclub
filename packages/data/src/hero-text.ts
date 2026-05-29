import { createClient } from "@seclub/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@seclub/supabase/types";

type HeroClient = SupabaseClient<Database>;

export type HeroText = Pick<
  Tables<"main_hero_text">,
  "tagline" | "heading_line1" | "heading_line2" | "button_text" | "notices_new_badge"
>;

export const HERO_TEXT_DEFAULTS: HeroText = {
  tagline: "당신만의 힐링",
  heading_line1: "SE Club에서 누리는",
  heading_line2: "완벽한 휴식",
  button_text: "지금 예약하기",
  notices_new_badge: true,
}

/**
 * Read the single hero-text row. Returns `HERO_TEXT_DEFAULTS` when the row is
 * missing or fetching fails — callers should not treat this as an error path.
 */
export async function fetchHeroText(client?: HeroClient): Promise<HeroText> {
  try {
    const supabase = client ?? (await createClient())
    const { data, error } = await supabase
      .from("main_hero_text")
      .select("tagline, heading_line1, heading_line2, button_text, notices_new_badge")
      .limit(1)
      .single()
    if (error || !data) return HERO_TEXT_DEFAULTS
    return data
  } catch {
    return HERO_TEXT_DEFAULTS
  }
}
