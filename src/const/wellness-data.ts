import { CardData } from "@/types";

export const wellnessData: CardData[] = [
  {
    slug: "walk",
    title: "산책로",
    image: "/images/wellness/walk.jpg",
    description: "아름다운 숲길과 해안길 코스",
    items: [
      { title: "산책로", href: "/wellness/walk" }
    ]
  },
  {
    slug: "swimming-pool",
    title: "수영장",
    image: "/images/wellness/swimming-pool.jpg",
    description: "바다 내음 가득 전용 야외 풀장",
    items: [
      { title: "공용 야외 수영장", href: "/wellness/swimming-pool" },
      { title: "캠핑장 내 해수 풀장", href: "/wellness/camping-pool" }
    ]
  },
  {
    slug: "photo-spot",
    title: "포토스팟",
    image: "/images/wellness/photo-spot.jpg",
    description: "환상적인 바다 전망 포토존",
    items: [
      { title: "포토스팟", href: "/wellness/photo-spot" }
    ]
  },
  {
    slug: "nature-experience",
    title: "자연 체험 프로그램",
    image: "/images/wellness/nature-experience.jpg",
    description: "생태 관찰 및 자연 체험",
    items: [
      { title: "자연 체험", href: "/wellness/nature-experience" }
    ]
  },
  {
    slug: "facility",
    title: "부대시설",
    image: "/images/wellness/facility.jpg",
    description: "카페·라운지 등 편의 시설",
    items: [
      { title: "매점 & 리필스테이션", href: "/wellness/store" },
      { title: "세미나실(공연장)", href: "/wellness/seminar-room" }
    ]
  },
  {
    slug: "special-activity",
    title: "조각공원",
    image: "/images/wellness/special-activity.jpg",
    description: "예술과 자연이 어우러진 조각공원",
    items: [
      { title: "조각공원", href: "/wellness/special-activity" }
    ]
  }
];
