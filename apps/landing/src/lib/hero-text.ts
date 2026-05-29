import { fetchHeroText, HERO_TEXT_DEFAULTS } from "@seclub/data/hero-text"
import { createClient as createPublicClient } from "@seclub/supabase/public"

export { HERO_TEXT_DEFAULTS }
export type { HeroText } from "@seclub/data/hero-text"

export const getHeroText = () => fetchHeroText(createPublicClient())
