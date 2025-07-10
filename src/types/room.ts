import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type RoomType = "pool-villa" | "ocean-condo" | "spa-villa" | "camping-house";

export interface RoomInfo {
  slug: string;
  title: string | ReactNode;
  subtitle: string;
  heroImage: string;
  mainImages: string[];
  overview: string | ReactNode;
  amenities: {
    img: string;
    title: string;
    description: string;
  }[];
  features: {
    icon: LucideIcon;
    label: string;
    value: string;
  }[];
  additionalInfo: {
    title: string;
    items: string[];
  }[];
}