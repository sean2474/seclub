export type NoticeCategory = "일반" | "이벤트" | "중요" // 2. NoticeCategory 타입 정의
export type NoticeStatus = "게시 중" | "비게시"

export interface Notice {
  id: string
  title: string
  category: NoticeCategory // 3. category 속성 추가
  author: string
  date: string
  status: NoticeStatus
  views: number
  content?: string
  imageUrls?: string[]
}