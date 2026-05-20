import { getCategories } from "@/lib/action/category"
import { useAdminResource } from "./use-admin-resource"

export const useCategories = () => {
  const [categories, setCategories] = useAdminResource<string[]>(getCategories, [])
  return { categories, setCategories }
}
