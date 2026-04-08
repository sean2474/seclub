export interface Notice {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  active: boolean;
  images: string[] | null;
  category: string;
  view: number;
  pinned: boolean;
}