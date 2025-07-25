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
        name: "경관",
        href: "/about/gallery"
      },
      {
        name: "오시는길",
        href: "/about/directions"
      },
    ]
  },
  {
    title: "캠핑장",
    href: "/camping"
  },
  {
    title: "객실",
    href: "/rooms"
  },
  {
    title: "웰니스",
    href: "/wellness"
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