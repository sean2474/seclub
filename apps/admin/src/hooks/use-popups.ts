import { getPopups } from "@/lib/action/popup"
import { Popup } from "@/types/popup"
import { useAdminResource } from "./use-admin-resource"

export const usePopups = () => {
  const [popups, setPopups] = useAdminResource<Popup[]>(getPopups, [])
  return { popups, setPopups }
}
