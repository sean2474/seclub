import { fetchSnsLinks } from "@seclub/data/sns-links"
import { createClient as createPublicClient } from "@seclub/supabase/public"

export type { SnsLink } from "@seclub/data/sns-links"

export const getSnsLinks = () => fetchSnsLinks(createPublicClient())
