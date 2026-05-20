// 공통 타입
export type HeaderMenuType = {
  title: string;
  href?: string;
  items?: {
    name: string;
    href: string;
  }[];
};

// 숙박 유형: 객실 또는 캠핑장
export type AccommodationType = "room" | "site";

export type RoomNumber = {
  id: string;
  maxNights: number;
};

export type RoomType = {
  id: string;
  type: "room";
  category: string;
  name: string;
  roomConfig: string;
  bedCount: string;
  capacity: string;
  maxCapacity: string;
  baseGuests: number;
  maxGuests: number;
  petAllowed: boolean;
  petLimit?: string;
  maxPets?: number;
  checkIn: string;
  checkOut: string;
  price: number;
  weekendPrice: number;
  peakPrice: number;
  extraPersonFee?: number;
  petFee?: number;
  images: string[];
  amenities: string[];
  description: string;
  roomNumbers?: RoomNumber[];
};

// Re-export from other type files
export * from "./reservation";
export * from "./payment";
export * from "./favorite";
export * from "./membership";
export * from "./profile";
