import type { GalleryRebornItem } from "@/types/gallery-reborn"

/**
 * Mock 데이터 — 고객이 업사이클링한 작품을 어드민이 선정해 올린다는 가정.
 * 이미지는 `public/tmp/gallery-reborn/` 임시 디렉터리 (DB 연동 후 제거 예정).
 * 출처: Wikimedia Commons (CC licensed, mock 전용).
 */
export const galleryRebornMock: GalleryRebornItem[] = [
  {
    id: "mock-01",
    image_path: "/tmp/gallery-reborn/03-sea-glass-beach.jpg",
    small_path: null,
    title: "해변의 보석",
    description:
      "수십 년 파도에 깎인 유리조각들을 모아 해변의 광경 그대로 담았다. 쓸려 나간 것이 도리어 가장 섬세한 결을 남긴다.",
    caption_en: "Jewels on the Shore",
    participant: "정수민",
    materials: ["씨글라스", "모래"],
    workshop_date: "2026.03",
    layout_type: "full",
    display_order: 0,
  },
  {
    id: "mock-02",
    image_path: "/tmp/gallery-reborn/01-sea-glass-blue.jpg",
    small_path: null,
    title: "푸른 시간",
    description:
      "깨진 병 조각이 물과 모래의 손을 거쳐 부드러워지기까지 수십 년. 파편은 사라지지 않고, 빛나는 푸른 시간으로 남는다.",
    caption_en: "Blue Time",
    participant: "이지우",
    materials: ["씨글라스"],
    workshop_date: "2026.04",
    layout_type: "full",
    display_order: 1,
  },
  {
    id: "mock-03",
    image_path: "/tmp/gallery-reborn/06-shells-basket.jpg",
    small_path: null,
    title: "조개의 바구니",
    description:
      "몇 주간의 갯벌 산책에서 주워 모은 조개들. 서로 다른 모양이 한 바구니 안에서 말을 섞기 시작한다.",
    caption_en: "Basket of Shells",
    participant: "박도현 · 송민아",
    materials: ["조개", "대나무 바구니"],
    workshop_date: "2026.01",
    layout_type: "centered",
    display_order: 2,
  },
  {
    id: "mock-04",
    image_path: "/tmp/gallery-reborn/07-shell-fragments.jpg",
    small_path: null,
    title: "흩어진 기록",
    description:
      "모래에 파묻혀 있던 조개껍질 파편들. 어느 것도 완전하지 않지만, 한데 놓으면 그 자체로 해변의 연대기가 된다.",
    caption_en: "Scattered Records",
    participant: "김하연",
    materials: ["조개 파편", "밧줄"],
    workshop_date: "2025.11",
    layout_type: "centered",
    display_order: 3,
  },
  {
    id: "mock-05",
    image_path: "/tmp/gallery-reborn/05-sculpture-atlantis.jpg",
    small_path: null,
    title: "아틀란티스의 혼",
    description:
      "해변에 버려진 쇠사슬, 닻, 도자기 조각을 엮어 하나의 오브제로 세웠다. 바다가 삼켰던 것이 다시 서서히 일어선다.",
    caption_en: "Soul of Atlantis",
    participant: "서로운",
    materials: ["쇠사슬", "폐도자기", "닻 조각"],
    workshop_date: "2025.12",
    layout_type: "asymmetric",
    display_order: 4,
  },
  {
    id: "mock-06",
    image_path: "/tmp/gallery-reborn/04-driftwood.jpg",
    small_path: null,
    title: "스카버러의 잔해",
    description:
      "바위틈에 끼어 굳어버린 유목 한 조각. 흉터처럼 남은 결을 그대로 두고 받침대 위에 올렸다.",
    caption_en: "Scarborough Remnant",
    participant: "윤태린",
    materials: ["유목", "참나무 받침"],
    workshop_date: "2026.05",
    layout_type: "full",
    display_order: 5,
  },
  {
    id: "mock-07",
    image_path: "/tmp/gallery-reborn/09-paper-mache.jpg",
    small_path: null,
    title: "만드는 손",
    description:
      "찢어 풀어낸 신문지와 밀가루 풀. 떠내려간 것들이 다시 형태를 얻는 과정 자체를 전시한다.",
    caption_en: "Crafting Hands",
    participant: "익명",
    materials: ["폐신문", "밀가루 풀"],
    workshop_date: "2026.02",
    layout_type: "centered",
    display_order: 6,
  },
  {
    id: "mock-08",
    image_path: "/tmp/gallery-reborn/10-recycled-plastic.jpg",
    small_path: null,
    title: "플라스틱의 기억",
    description:
      "해안선에서 주운 플라스틱 파편을 열로 녹여 평면으로 펼쳤다. 색이 먼저 번지고, 형태가 나중에 온다.",
    caption_en: "Memory of Plastic",
    participant: "한서우",
    materials: ["해양 폐플라스틱"],
    workshop_date: "2026.03",
    layout_type: "centered",
    display_order: 7,
  },
  {
    id: "mock-09",
    image_path: "/tmp/gallery-reborn/08-shells-museum.jpg",
    small_path: null,
    title: "박물의 계절",
    description:
      "수집 상자 속 조개들. 어느 해의 여름, 어느 해의 가을 — 순서가 없는 달력이 놓인다.",
    caption_en: "Seasons in a Cabinet",
    participant: "문지호",
    materials: ["조개", "유리 상자"],
    workshop_date: "2025.10",
    layout_type: "centered",
    display_order: 8,
  },
  {
    id: "mock-10",
    image_path: "/tmp/gallery-reborn/02-sea-glass-jamaica.jpg",
    small_path: null,
    title: "카리브해의 시간",
    description:
      "카리브 해풍을 닮은 초록·호박빛 유리조각들. 오랜 표류가 준 색을 건드리지 않고 그대로 늘어놓았다.",
    caption_en: "Caribbean Time",
    participant: "조윤",
    materials: ["씨글라스", "해류 흔적"],
    workshop_date: "2025.09",
    layout_type: "asymmetric",
    display_order: 9,
  },
]
