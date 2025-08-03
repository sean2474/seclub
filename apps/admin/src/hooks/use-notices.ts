import { getNotices } from "@/lib/action/notice"
import { Notice } from "@/types/notices"
import { useEffect, useState } from "react"
import { toast } from "./use-toast"

export const useNotices = () => {
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    const fetchNotices = async () => {
      const { data, error } = await getNotices()
      if (error) {
        toast({
          title: "에러",
          description: error,
          variant: "destructive",
        })
      }
      if (data) {
        setNotices(data)
      }
    }
    fetchNotices()
  }, [])

  return {
    notices,
    setNotices
  }
}