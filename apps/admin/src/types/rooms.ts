export interface RoomRate {
  id: number;
  name: string;
  type: "lodging" | "camping";
  peak_rate: number;
  winter_rate: number;
  long_stay_discount: number;
  display_order: number;
}

export interface LateCheckoutRate {
  id: number;
  room_id: number;
  hours_3: number;
  hours_6: number;
  room_name?: string;
}

export interface DiscountRate {
  id: number;
  season: string;
  category: string;
  nights: string;
  discount_percent: number;
}

export interface RoomInfo {
  slug: string;
  data: {
    name: string;
    title: string;
    subtitle: string;
    heroImage: string;
    mainImages: string[];
    overview: string;
    amenities: { img: string; title: string; description: string }[];
    features: { icon: string; label: string; value: string }[];
    additionalInfo: { title: string; items: string[] }[];
  };
  is_active: boolean;
}
