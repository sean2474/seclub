import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export type RoomType = "pool-villa" | "ocean-condo" | "spa-villa" | "camping-house" | "ocean-condo-extended" | "premium-villa";

// DB에서 가져온 객실 정보 (icon은 string)
export interface RoomData {
  slug: string;
  name: string;
  title: string;
  subtitle: string;
  heroImage: string;
  mainImages: string[];
  overview: string;
  amenities: {
    img: string;
    title: string;
    description: string;
  }[];
  features: {
    icon: string;
    label: string;
    value: string;
  }[];
  additionalInfo: {
    title: string;
    items: string[];
  }[];
}

// 렌더링용 객실 정보 (icon은 LucideIcon)
export interface RoomInfo {
  slug: string;
  name: string;
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

export interface RoomCardProps extends Omit<RoomInfo, 'heroImage' | 'mainImages' | 'overview' | 'amenities' | 'additionalInfo' | 'name'> {
  images: string[];
}