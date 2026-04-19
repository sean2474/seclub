import type { GalleryRebornItem } from "@/types/gallery-reborn"

/**
 * Mock 데이터. 실제 운영 시 고객이 업사이클링한 작품을 어드민이 선정해 업로드.
 * 이미지는 작품 오브제/디테일샷 상정 (현재는 사이트 자산으로 임시 대체).
 */
export const galleryRebornMock: GalleryRebornItem[] = [
  {
    id: "mock-01",
    image_path: "/images/landing/hero-2.jpg",
    small_path: null,
    title: "바다가 남긴 것",
    description:
      "폭풍이 지나간 해변에서 주운 유목과 조개껍질을 엮어 만든 오브제. 버려진 파편이 모여 하나의 풍경이 된다.",
    caption_en: "What the Sea Left Behind",
    participant: "정수민",
    materials: ["유목", "조개", "소금"],
    workshop_date: "2026.03",
    layout_type: "full",
    display_order: 0,
  },
  {
    id: "mock-02",
    image_path: "/images/landing/hero-3.jpg",
    small_path: null,
    title: "해풍을 품은 매듭",
    description:
      "밀려온 폐그물을 해체해 다시 짠 태피스트리. 그물은 다시 그물이 아니라, 바다의 숨을 기록한 매듭이 된다.",
    caption_en: "Knots of Seawind",
    participant: "이지우",
    materials: ["폐그물", "마끈"],
    workshop_date: "2026.04",
    layout_type: "asymmetric",
    display_order: 1,
  },
  {
    id: "mock-03",
    image_path: "/images/site/a.jpg",
    small_path: null,
    title: "유리조각의 두 번째 삶",
    description:
      "모래에 갈린 유리조각을 모아 빛을 통과시키는 창을 만들었다. 깨어진 것이 가장 투명한 이야기를 한다.",
    caption_en: "Second Life of Glass",
    participant: "박도현 · 송민아",
    materials: ["씨글라스", "폐목재", "철사"],
    workshop_date: "2026.01",
    layout_type: "centered",
    display_order: 2,
  },
  {
    id: "mock-04",
    image_path: "/images/landing/hero-4.jpg",
    small_path: null,
    title: "고요한 기록",
    description: "버려진 그물에서 고요한 매듭이 태어난다.",
    caption_en: "Quiet Record",
    participant: "익명",
    materials: ["폐그물", "콘크리트 조각"],
    workshop_date: "2026.02",
    layout_type: "quote",
    display_order: 3,
  },
  {
    id: "mock-05",
    image_path: "/images/landing/hero-1.jpg",
    small_path: null,
    title: "달빛 아래 기다림",
    description:
      "밤의 해변에서만 보이는 그림자. 얕은 달빛이 스며들 때, 오래된 사물은 새 얼굴을 얻는다.",
    caption_en: "Waiting Under Moonlight",
    participant: "김하연",
    materials: ["플라스틱 부표", "LED"],
    workshop_date: "2025.11",
    layout_type: "full",
    display_order: 4,
  },
  {
    id: "mock-06",
    image_path: "/images/landing/section-2.jpg",
    small_path: null,
    title: "조개의 기억",
    description:
      "조개껍질 하나에 담긴 계절. 말라붙은 소금 결정과 함께 캔버스 위에 놓이면, 그것은 그대로 한 편의 풍경이 된다.",
    caption_en: "Memory of Shells",
    participant: "서로운",
    materials: ["조개", "소금 결정", "캔버스"],
    workshop_date: "2025.12",
    layout_type: "asymmetric",
    display_order: 5,
  },
  {
    id: "mock-07",
    image_path: "/images/site/hero.jpg",
    small_path: null,
    title: "파도가 새긴 문양",
    description:
      "오랜 시간 파도에 닳아 둥글어진 도자기 조각들. 흠이 있어 버려졌던 것들이 자연의 손에 의해 완성된다.",
    caption_en: "Patterns Carved by Waves",
    participant: "윤태린",
    materials: ["폐도자기", "해류 흔적"],
    workshop_date: "2026.05",
    layout_type: "centered",
    display_order: 6,
  },
]
