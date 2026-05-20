import { useEffect, useState } from "react"
import { toast } from "@seclub/ui/use-toast"

type FetcherResult<T> = { data: T | null; error: string | null }

export function useAdminResource<T>(
  fetcher: () => Promise<FetcherResult<T>>,
  initial: T,
) {
  const [data, setData] = useState<T>(initial)

  useEffect(() => {
    let active = true
    fetcher().then(({ data, error }) => {
      if (!active) return
      if (error) {
        toast({
          title: "에러",
          description: error,
          variant: "destructive",
        })
        return
      }
      if (data !== null && data !== undefined) {
        setData(data)
      }
    })
    return () => {
      active = false
    }
  }, [fetcher])

  return [data, setData] as const
}
