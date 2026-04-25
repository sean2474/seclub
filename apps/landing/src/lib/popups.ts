import { createClient } from "@/lib/supabase/server";

export interface PopupData {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  link_url: string | null;
}

export async function getActivePopups(): Promise<PopupData[]> {
  try {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("popups")
      .select("id, title, content, image_url, link_url")
      .eq("active", true)
      .or(`start_date.is.null,start_date.lte.${today}`)
      .or(`end_date.is.null,end_date.gte.${today}`)
      .order("priority", { ascending: false })
      .limit(5);

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
