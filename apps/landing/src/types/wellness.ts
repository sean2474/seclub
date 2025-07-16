export type WellnessType = "walk" | "swimming-pool" | "photo-spot" | "nature-experience" | "special-activity" | "camping-pool" | "store" | "seminar-room";

export interface WellnessData {
  slug: WellnessType;
  title: string;
  image: string;
  description: string;
}

export interface WellnessPageHeader {
  title: string
  subtitle: string
  type: string
  location: string
  hours: string
  image: string       // 헤더 배너 이미지 경로, 아래 주석으로 설명
}
export interface WellnessPageData {
  header: WellnessPageHeader
  contents: string[]   // 본문 텍스트 리스트
  images: string[]   // 갤러리 이미지 경로 배열, 옆에 주석으로 설명
}