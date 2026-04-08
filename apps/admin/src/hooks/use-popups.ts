import { getPopups } from "@/lib/action/popup"
import { Popup } from "@/types/popup"
import { useEffect, useState } from "react"
import { toast } from "./use-toast"

export const usePopups = () => {
  const [popups, setPopups] = useState<Popup[]>([])

  useEffect(() => {
    const fetchPopups = async () => {
      const { data, error } = await getPopups()
      if (error) {
        toast({
          title: "에러",
          description: error,
          variant: "destructive",
        })
      }
      if (data) {
        setPopups(data)
      }
    }
    fetchPopups()
  }, [])

  return {
    popups,
    setPopups
  }
}
