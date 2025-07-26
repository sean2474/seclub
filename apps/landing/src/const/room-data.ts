import { CardData } from "@/types";

export const roomData: CardData[] = [
  {
    slug: "pool-villa",
    title: "해수 풀빌라",
    image: "/images/room/pool-villa/main-1.jpg",
    description: "101-106 객채",
    items: [
      { title: "해수 풀빌라", href: "/rooms/pool-villa" }
    ]
  },
  {
    slug: "ocean-condo",
    title: "오션 콘도",
    image: "/images/room/ocean-condo/hero.jpg",
    description: "호텔형",
    items: [
      { title: "오션 콘도 기본형", href: "/rooms/ocean-condo" },
      { title: "오션 콘도 확장형", href: "/rooms/ocean-condo-extended" }
    ]
  },
  {
    slug: "spa-villa",
    title: "오션스파빌라",
    image: "/images/room/spa-villa/hero.jpg",
    description: "자쿠지",
    items: [
      { title: "오션스파빌라", href: "/rooms/spa-villa" }
    ]
  },
  {
    slug: "camping-house",
    title: "선셋 캠핑 하우스",
    image: "/images/room/camping-house/hero.jpg",
    description: "글램핑/캠핑",
    items: [
      { title: "선셋 캠핑 하우스", href: "/rooms/camping-house" }
    ]
  }
];