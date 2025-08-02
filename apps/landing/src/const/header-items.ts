import { HeaderMenuType } from "@/types";

export const menuItems: HeaderMenuType[] = [
  {
    title: "소개",
    href: "/about",
    items: [
      {
        name: "스토리",
        href: "/about"
      },
      {
        name: "오시는길",
        href: "/about/location"
      },
    ]
  },
  {
    title: "객실",
    href: "/rooms"
  },
  {
    title: "캠핑장",
    href: "/camping",
    items: [
      {
        name: "캠핑 사이트",
        href: "/camping"
      },
      {
        name: "이용안내",
        href: "/camping/rule"
      },
      {
        name: "캠핑장 종합 배치도",
        href: "/camping/map"
      },
    ]
  },
  {
    title: "웰니스",
    href: "/wellness"
  },
  {
    title: "갤러리",
    href: "/about/gallery",
    items: [
      {
        name: "사진 갤러리",
        href: "/about/gallery"
      },
      {
        name: "영상 갤러리",
        href: "/about/video"
      },
    ]
  },
  {
    title: "예약 안내",
    href: "/reservation",
    items: [
      {
        name: "요금 안내",
        href: "/reservation/pricing"
      },
      {
        name: "예약 안내",
        href: "/reservation"
      },
      {
        name: "단체 예약",
        href: "/reservation/group"
      }
    ]
  },
  {
    title: "공지·이벤트",
    href: "/notices"
  }
];

export const desktopMenu = [
  ...menuItems.map((m) => ({
    name: m.title,
    items: m.items,
    href: m.href,
  })),
];