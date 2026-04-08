import { createClient } from "@/lib/supabase/server";

export interface HeroText {
  tagline: string;
  heading_line1: string;
  heading_line2: string;
  button_text: string;
}

const DEFAULTS: HeroText = {
  tagline: "당신만의 힐링",
  heading_line1: "SE Club에서 누리는",
  heading_line2: "완벽한 휴식",
  button_text: "지금 예약하기",
};

export async function getHeroText(): Promise<HeroText> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("main_hero_text")
      .select("tagline, heading_line1, heading_line2, button_text")
      .limit(1)
      .single();

    if (error || !data) return DEFAULTS;
    return data;
  } catch {
    return DEFAULTS;
  }
}
