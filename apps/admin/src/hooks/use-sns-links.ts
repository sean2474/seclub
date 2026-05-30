import { getSnsLinks, type AdminSnsLink } from "@/lib/action/sns-links"
import { useAdminResource } from "./use-admin-resource"

export const useSnsLinks = () => {
  const [snsLinks, setSnsLinks] = useAdminResource<AdminSnsLink[]>(getSnsLinks, [])
  return { snsLinks, setSnsLinks }
}
