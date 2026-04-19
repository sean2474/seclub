export type LayoutType = "full" | "asymmetric" | "centered" | "quote"

export interface GalleryRebornItem {
  id: string
  image_path: string
  small_path: string | null
  title: string | null
  description: string | null
  caption_en: string | null
  layout_type: LayoutType
  display_order: number
}
