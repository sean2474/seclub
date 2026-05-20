import type { Tables } from "@seclub/supabase/types";

type NoticeRow = Tables<"notice">;

// 랜딩 목록·카드용 (가벼움)
export type Notice = Pick<
  NoticeRow,
  "id" | "category" | "title" | "created_at" | "view" | "pinned"
>;

// 랜딩 상세 페이지용
export type NoticeDetail = Notice & Pick<NoticeRow, "content" | "images">;
