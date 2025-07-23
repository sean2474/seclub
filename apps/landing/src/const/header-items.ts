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
      {
        name: "공지사항",
        href: "/notices"
      }
    ]
  },
  {
    title: "캠핑장",
    href: "/camping",
    items: [
      {
        name: "캠핑사이트",
        href: "/camping"
      },
      {
        name: "이용 안내",
        href: "/camping/guide"
      }
    ]
  },
  {
    title: "객실",
    href: "/rooms",
    items: [
      {
        name: "해수 풀빌라",
        href: "/rooms/pool-villa"
      },
      {
        name: "오션콘도",
        href: "/rooms/ocean-condo"
      },
      {
        name: "오션스파빌라",
        href: "/rooms/spa-villa"
      },
      {
        name: "선셋 캠핑 하우스",
        href: "/rooms/camping-house"
      }
    ]
  },
  {
    title: "웰니스",
    href: "/wellness",
    items: [
      {
        name: "산책로",
        href: "/wellness/walking-paths"
      },
      {
        name: "부대시설",
        href: "/wellness/facilities"
      },
      {
        name: "수영장",
        href: "/wellness/pool"
      },
      {
        name: "포토스팟",
        href: "/wellness/photo-spots"
      },
      {
        name: "자연체험",
        href: "/wellness/nature-experience"
      }
    ]
  },
  {
    title: "예약",
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
  }
];

export const desktopMenu = [
  ...menuItems.map((m) => ({
    name: m.title,
    items: m.items,
    href: m.href,
  })),
];