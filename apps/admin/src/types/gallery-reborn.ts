export const LAYOUT_TYPES = ["full", "asymmetric", "centered", "quote"] as const
export type LayoutType = (typeof LAYOUT_TYPES)[number]

export interface GalleryRebornItem {
  id: string
  imagePath: string
  smallPath: string | null
  title: string | null
  description: string | null
  captionEn: string | null
  layoutType: LayoutType
  displayOrder: number
  createdAt: string
  updatedAt: string
  previewUrl: string
  originalUrl: string
}

export interface GalleryRebornUploadInput {
  file: File
  title?: string | null
  description?: string | null
  captionEn?: string | null
  layoutType?: LayoutType
}

export interface GalleryRebornUpdatePatch {
  title?: string | null
  description?: string | null
  captionEn?: string | null
  layoutType?: LayoutType
}

export const LAYOUT_TYPE_LABELS: Record<LayoutType, string> = {
  full: "풀블리드",
  asymmetric: "비대칭",
  centered: "중앙",
  quote: "인용문",
}
