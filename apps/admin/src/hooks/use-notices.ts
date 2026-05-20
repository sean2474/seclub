import { getNotices } from "@/lib/action/notice"
import { Notice } from "@/types/notices"
import { useAdminResource } from "./use-admin-resource"

export const useNotices = () => {
  const [notices, setNotices] = useAdminResource<Notice[]>(getNotices, [])
  return { notices, setNotices }
}
