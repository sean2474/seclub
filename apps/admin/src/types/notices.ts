import type { Tables } from "@seclub/supabase/types";

// 어드민은 전체 row (CRUD 대상)
export type Notice = Tables<"notice">;
