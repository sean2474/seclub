export type LayoutType = "full" | "asymmetric" | "centered" | "quote"

/**
 * 환생 갤러리는 고객이 업사이클링한 작품을 큐레이션하는 전시.
 * participant/materials/workshop_date 는 고객 작가·재료·제작 시기 메타로 사용됨.
 */
export interface GalleryRebornItem {
  id: string
  image_path: string
  small_path: string | null
  title: string | null
  description: string | null
  caption_en: string | null
  participant: string | null
  materials: string[] | null
  workshop_date: string | null
  layout_type: LayoutType
  display_order: number
}
