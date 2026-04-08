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
    const { data, error } = await supabase
      .from("popups")
      .select("id, title, content, image_url, link_url")
      .eq("active", true)
      .order("priority", { ascending: false })
      .limit(5);

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}
