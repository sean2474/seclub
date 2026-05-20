import { getHeroText } from "@/lib/action/hero-text"
import { HeroText } from "@/types/hero-text"
import { useEffect, useState } from "react"
import { toast } from "./use-toast"

export const useHeroText = () => {
  const [heroText, setHeroText] = useState<HeroText | null>(null)

  useEffect(() => {
    const fetchHeroText = async () => {
      const { data, error } = await getHeroText()
      if (error) {
        toast({
          title: "에러",
          description: error,
          variant: "destructive",
        })
      }
      if (data) {
        setHeroText(data)
      }
    }
    fetchHeroText()
  }, [])

  return {
    heroText,
    setHeroText
  }
}
