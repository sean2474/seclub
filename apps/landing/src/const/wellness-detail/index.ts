import { WellnessPageData, WellnessType } from "@/types";

export const wellnessPageData: Record<WellnessType, WellnessPageData> = {
  // 1. 산책로
  walk: {
    header: {
      title: "산책로",
      subtitle:
        "울창한 솔향기 숲길과 간조 시 열리는 드넓은 해안길을 따라 걷는 10.2km 트레킹 코스입니다.",
      type: "산책로",
      location: "단지 전역",
      hours: "상시 개방",
      image: "/images/wellness/walk/hero.jpg", // 솔숲과 해안길이 함께 보이는 헤더 배너
    },
    contents: [
      "솔향기길 1코스: 꾸지나무골 해변 → 만대항 (10.2km, 약 4시간 소요). 간조 시 바닷길 진입 가능",
      "솔향기길 2코스 (참고): 제3해변 → 이원방조제 (9.9km). 초보자는 사목해변 왕복 권장",
      "농원 오솔길: 1–2km, 30분–1시간 소요. 사계절 꽃·과실 관찰 가능",
      "안전 팁: 등산화 착용, 물·간식 지참, 물때표 확인, 해안 구간 미끄럼 주의",
    ],
    images: [
      "/images/wellness/walk/1.jpg",
      "/images/wellness/walk/2.jpg",
      "/images/wellness/walk/3.jpg",
      "/images/wellness/walk/4.jpg",
      "/images/wellness/walk/5.jpg",
      "/images/wellness/walk/6.jpg",
      "/images/wellness/walk/7.jpg",
      "/images/wellness/walk/8.jpg",
      "/images/wellness/walk/9.jpg",
    ]
  },

  // 2. 공용 야외 수영장
  "swimming-pool": {
    header: {
      title: "공용 야외 수영장",
      subtitle:
        "별장 2·3구역에 위치한 바다 전경의 프라이빗 야외 풀장과 족욕탕을 즐길 수 있습니다.",
      type: "수영장",
      location: "별장 2·3구역",
      hours: "10:00 – 19:00",
      image: "/images/wellness/swimming-pool/hero.jpg",
    },
    contents: [
      "운영 기간: 매년 7월~8월 (상세 일정 별도 공지)",
      "이용 시간: 10:00 – 19:00",
      "풀장 사양: 가로 17m × 폭 11m, 어린이 0.6m / 성인 1.0m, 족욕탕(280×140×60cm)·사계절 온수",
      "수칙: 신발 벗고 이용, 음식물·반려동물 금지, 어린이는 보호자 동반·구명조끼 착용, 다이빙·점핑 금지",
      "부대 서비스: 타월·튜브·구명조끼 대여",
    ],
    images: [
      "/images/wellness/swimming-pool/1.jpg",
      "/images/wellness/swimming-pool/2.jpg",
      "/images/wellness/swimming-pool/3.jpg",
      "/images/wellness/swimming-pool/4.jpg",
    ]
  },

  // 3. 캠핑장 내 해수 풀장
  "camping-pool": {
    header: {
      title: "캠핑장 내 해수 풀장",
      subtitle:
        "캠핑장 구역에 마련된 바닷물 풀장에서 자연 속 해수욕장 같은 물놀이를 즐겨보세요.",
      type: "해수 풀장",
      location: "캠핑장 구역",
      hours: "10:00 – 19:00",
      image: "/images/wellness/camping-pool/hero.jpg",
    },
    contents: [
      "운영 기간: 매년 7월~8월 (상세 일정 별도 공지)",
      "이용 시간: 10:00 – 19:00",
      "풀장 사양: 가로 12m × 폭 5m, 최대 깊이 0.9m (수위 0.75m 이하)",
      "바닷물 이용으로 머드 성분 함유 가능",
      "주의 사항: 태풍·폭우 시 이용 제한, 갯바위 미끄럼 주의",
      "이용 수칙: 신발 벗고 이용, 음식물·반려동물 금지, 어린이는 보호자 동반·안전 장비 착용 필수",
      "금연 구역, 쓰레기 분리수거장(쥬라기 포토존 앞) 이용",
    ],
    images: [
      "/images/wellness/camping-pool/1.jpg",
      "/images/wellness/camping-pool/2.jpeg",
      "/images/wellness/camping-pool/3.jpeg",
    ]
  },

  // 4. 포토스팟
  "photo-spot": {
    header: {
      title: "포토스팟",
      subtitle: "절경 포인트를 모아둔 단지 내 대표 ‘인생샷’ 명소를 안내합니다.",
      type: "포토스팟",
      location: "단지 전역",
      hours: "상시 개방",
      image: "/images/wellness/photo-spot/hero.jpg",
    },
    contents: [
      "1전망대(반려견 캠핑장 위): 산·바다 파노라마 뷰",
      "2전망대: 해안 절벽 위 조망",
      "별장 2·3구역 풀장: 풀과 바다가 연결된 뷰",
      "조각공원: 대표 작품 앞 연출 샷",
      "농원 오솔길: 계절별 꽃·과실 배경",
      "제2·제3해변: 간조 전후 갯바위·모래사장 뷰",
      "나무화석: 제2해변 낚시터 근처 위치",
    ],
    images: [
      "/images/wellness/photo-spot/1.jpg",
      "/images/wellness/photo-spot/2.jpg",
    ]
  },

  // 5. 자연 체험 프로그램
  "nature-experience": {
    header: {
      title: "자연 체험 프로그램",
      subtitle:
        "바다 속 산책부터 갯벌 생태·독살 체험, 갯바위 낚시까지 다양한 해양 액티비티를 제공합니다.",
      type: "생태 체험·갯바위 낚시",
      location: "앞바다 및 갯바위 전역",
      hours: "프로그램별 상이 (사전 문의)",
      image: "/images/wellness/nature-experience/hero.jpg",
    },
    contents: [
      "바다 속 산책: 간조 시 신발 신고 최대 500m 진입, 갯바위·조개 지대 탐험",
      "생태 체험: 굴·고동·개불·명주조개 관찰 및 소량 채집 (자연 보호 준수)",
      "독살 체험: 전통 어로법 이해 및 체험, 안전 교육 후 진행",
      "갯바위 낚시: 낚싯대·미끼 대여, 초보자 프로그램 운영",
      "안내: 체험 후에는 캠핑장 내 야외 개수대를 자유롭게 이용 가능",
      "유의 사항: 매일 물때표 확인 필수, 구명조끼·장갑 권장, 갯바위 미끄럼 주의",
    ],
    images: [
      "/images/wellness/nature-experience/1.jpg",
      "/images/wellness/nature-experience/2.jpg",
      "/images/wellness/nature-experience/3.jpg",
      "/images/wellness/nature-experience/4.jpg",
      "/images/wellness/nature-experience/5.jpg",
      "/images/wellness/nature-experience/6.jpg",
    ]
  },

  // 6. 매점 & 리필스테이션
  store: {
    header: {
      title: "매점 & 리필스테이션",
      subtitle:
        "무포장·용기내 캠페인과 제로웨이스트 샵, 핸드드립 커피·비건 스낵을 만나는 편의 공간입니다.",
      type: "매점 & 리필스테이션",
      location: "관리동 입구",
      hours: "09:00 – 21:00",
      image: "/images/wellness/store/hero.jpg",
    },
    contents: [
      "위치·운영: 관리동 입구 내, 09:00–21:00, 문의 010-3945-2079",
      "무포장 캠페인: 용기 지참 시 할인, 종이가방·용기 대여(보증금 500원)",
      "리필스테이션 품목: 주방세제·소프넛·올리브오일·발사믹·포도씨유·핑크솔트 입욕제·원두 소분",
      "제로웨이스트 샵: 대나무칫솔·고체치약·고체비누·썬크림·바디로션·업사이클링 소품",
      "커피 & 다과: 핸드드립 커피, 유기농 비건 스낵·초콜릿, 무료 정수물(용기 지참 필수), 소프트 아이스크림(비수기 주말)",
      "이벤트: 당일 밭 수확 상추 무료 제공 (매장 공지 확인)",
    ],
    images: [
      "/images/wellness/store/1.jpg",
    ]
  },

  // 7. 세미나실(공연장)
  "seminar-room": {
    header: {
      title: "세미나실(공연장)",
      subtitle:
        "소규모 강연·워크숍·공연이 가능한 다목적 공간으로, 무대·음향·조명 시설을 갖추고 있습니다.",
      type: "세미나실",
      location: "관리동 내",
      hours: "09:00 – 21:00 (예약제)",
      image: "/images/wellness/seminar-room/hero.jpg", // 세미나실 내부 또는 무대 전경 헤더 배너
    },
    contents: [
      "예약·문의: 사전 예약 필수, 010-9703-1711",
      "수용 인원: 최대 50명 (의자 배치 변경 가능)",
      "시설 사양: 무대(5m×3m), 프로젝터·스크린, 유·무선 마이크 2대, 스피커, 조명 레일, 간이 객석 30석",
      "비용: 기본 대관료·장비 사용료 별도 문의",
      "부대 서비스: 음향·영상 기술 스탭 파견 가능",
    ],
    images: [
      "/images/wellness/seminar-room/1.jpg",
    ]
  },

  // 8. 조각공원
  "special-activity": {
    header: {
      title: "조각공원",
      subtitle:
        "국내 정상급 조각가들의 작품을 숲·잔디밭·전망데크에서 만나는 야외 미술관입니다.",
      type: "조각공원",
      location: "단지 내 조각공원 구역",
      hours: "09:00 – 18:00",
      image: "/images/wellness/special-activity/hero.jpg",
    },
    contents: [
      "주요 작가·작품: 김영중(유기적 곡선), 김석우(금속·돌 대비), 이필언(자연물 기반 대형 아트)",
      "관람 동선: 입구 광장 → 숲속 미로 → 전망데크 → 잔디밭 전시장",
      "이용 팁: QR코드 AR 해설 제공, 포토스팟 안내도 비치, 우천 시 우산 대여 가능",
    ],
    images: [
      "/images/wellness/special-activity/1.jpg",
      "/images/wellness/special-activity/2.jpg",
      "/images/wellness/special-activity/3.jpg",
      "/images/wellness/special-activity/4.jpg",
    ]
  }
}
