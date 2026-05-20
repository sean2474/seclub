import { getHeroText } from "@/lib/action/hero-text"
import { HeroText } from "@/types/hero-text"
import { useAdminResource } from "./use-admin-resource"

export const useHeroText = () => {
  const [heroText, setHeroText] = useAdminResource<HeroText | null>(getHeroText, null)
  return { heroText, setHeroText }
}
