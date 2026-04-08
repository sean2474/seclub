export interface Popup {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  link_url: string | null;
  active: boolean;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}
