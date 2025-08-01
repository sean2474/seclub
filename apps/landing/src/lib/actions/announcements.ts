import { Announcement, AnnouncementDetail } from "@/types"

export const getAnnouncements = async () : Promise<Announcement[]> => {
    return [
      { id: 1, category: "수상", title: "2022 고객 만족경영 패밀리 리조트 브랜드 부문 : 한국경제를 빛낸 인물 & 경영 - 매경 미디어그룹", date: "2022-12-15", views: 427 },
      { id: 2, category: "수상", title: "2022 * 관광산업발전 유공(풀빌라&리조트 부문) : 국회 문화체육관광위원회 위원장", date: "2022-11-10", views: 386 },
      { id: 3, category: "이벤트", title: "가수 이벤트 - 8월 주말 라이브 공연 안내", date: "2025-07-25", views: 612 },
      {
        id: 4,
        category: "공지",
        title: "📢 SE CLUB 새단장 안내 📢",
        date: "2025-07-20",
        views: 520,
      }
    ]
}

export const getAnnouncementCategories = async () : Promise<string[]> => {
    return [ "수상", "이벤트", "공지" ]
}

export const getAnnouncementById = async (id: number) : Promise<AnnouncementDetail | null> => {
  const announcements = [
    {
      id: 1,
      category: "수상",
      title: "2022 고객 만족경영 패밀리 리조트 브랜드 부문 : 한국경제를 빛낸 인물 & 경영 - 매경 미디어그룹",
      date: "2022-12-15",
      views: 427,
      content: "2022년 고객 만족경영 패밀리 리조트 브랜드 부문에서 SE클럽이 '한국경제를 빛낸 인물 & 경영' 상을 수상하였습니다. 매경 미디어그룹 주관으로 진행된 이번 시상식에서 고객 만족을 위한 우리의 노력을 인정받게 되어 매우 영광입니다. 앞으로도 최고의 서비스로 보답하겠습니다."
    },
    {
      id: 2,
      category: "수상",
      title: "2022 관광산업발전 유공(풀빌라&리조트 부문) : 국회 문화체육관광위원회 위원장",
      date: "2022-11-10",
      views: 386,
      content: "SE클럽이 2022년 관광산업발전 유공 시상식에서 풀빌라&리조트 부문 상을 받았습니다. 국회 문화체육관광위원회 위원장이 수여한 이 상은 한국 관광산업 발전에 기여한 공로를 인정받아 수상하게 되었습니다. SE클럽은 앞으로도 한국 관광산업 발전에 이바지하기 위해 최선을 다하겠습니다."
    },
    {
      id: 3,
      category: "이벤트",
      title: "가수 이벤트 - 8월 주말 라이브 공연 안내",
      date: "2025-07-25",
      views: 612,
      content: "8월에는 매 주말마다 SE클럽에서 라이브 공연을 진행하고 있습니다. 캠핑장의 아름다운 경관과 함께 예쁜 노래소리로 주말을 보내세요.\n\n- 일시: 8월 매주 금/토/일 저녁 7시\n- 장소: SE클럽 중앙 광장\n- 출연 가수: 매주 변경 (홈페이지 일정 확인)\n\n많은 참여 부탁드립니다."
    },
    {
      id: 4,
      category: "공지",
      title: "📢 SE CLUB 새단장 안내 📢",
      date: "2025-07-20",
      views: 520,
      content: "안녕하세요, SE CLUB을 찾아주시는 고객 여러분!\n더욱 편리하고 감각적인 경험을 선사하기 위해 웹사이트를 새롭게 단장했습니다.\n\n모던한 디자인 & 직관적 UI\n깔끔해진 레이아웃과 직관적인 메뉴 구조로 원하는 정보에 빠르게 접근할 수 있습니다.\n\n생생한 현장감의 갤러리\n프리미엄 빌라부터 캠핑 사이트까지, SE CLUB만의 아름다운 풍경을 고해상도 이미지로 만나보세요.\n\n모바일 최적화\n스마트폰·태블릿에서도 쾌적하게 이용할 수 있도록 반응형 웹으로 전면 개편했습니다.\n\n이벤트·프로모션\n시즌별 프로모션, 얼리버드 혜택 등 최신 소식을 한눈에 확인하세요.\n\n📬 소중한 의견을 들려주세요\n\n새로워진 웹사이트에 대한 느낀 점이나 개선 제안이 있으시면 언제든지 카페 혹은 저희에게 직접 문의주세요. \n\n앞으로도 SE CLUB과 함께 바다와 산, 별빛이 어우러진 특별한 순간을 즐겨보세요.\n감사합니다!\n\n– SE CLUB 드림 –"
    }
  ]

  return announcements.find((announcement) => announcement.id === id) || null
}