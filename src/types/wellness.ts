export type WellnessType = "walk" | "swimming-pool" | "photo-spot" | "nature-experience" | "art-gallery" | "special-activity";

export interface WellnessData {
  slug: WellnessType;
  title: string;
  image: string;
  description: string;
}