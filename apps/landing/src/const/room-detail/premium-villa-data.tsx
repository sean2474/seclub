import { RoomInfo } from "@/types";
import { BedDouble, Clock, Dog, DoorClosed, Users } from "lucide-react";

export const premiumVillaData: RoomInfo = {
  slug: "premium-villa",
  title: "프리미엄 빌라",
  subtitle: "인피니티 풀",
  heroImage: "/images/room/premium-villa/hero.jpg",
  mainImages: [
    "/images/room/premium-villa/main-1.jpg", 
    "/images/room/premium-villa/main-2.jpeg", 
    "/images/room/premium-villa/main-3.jpg", 
    "/images/room/premium-villa/main-4.jpeg", 
    "/images/room/premium-villa/main-5.jpeg", 
  ],
  overview: (
    <p>SE CLUB 프리미엄 빌라는 끝없이 펼쳐진 바다와 황홀한 노을이 객실 창문 너머로 펼쳐지는 특별한 휴식처입니다. <span className="text-green-900 font-semibold">실내 주방</span>, <span className="text-green-900 font-semibold">야외 인피니티 풀</span>, <span className="text-green-900 font-semibold">프라이빗 바비큐 공간</span>을 갖춰, 바다, 산, 그리고 별빛이 수놓인 낭만의 순간을 한층 더 완벽하게 즐기실 수 있습니다
</p>
  ),
  amenities: [
    // {
    //   img: "/images/room/premium-villa/kitchen.jpg",
    //   title: "주방",
    //   description: "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)",
    // },  // TODO: 사진받으면 추가하기: 주방, 욕조 
    {
      img: "/images/room/premium-villa/grill.jpeg",
      title: "바비큐 그릴",
      description: "개별 바비큐 그릴",
    }, 
    {
      img: "/images/room/premium-villa/pool.JPG",
      title: "인피니티 풀",
      description: "개별 수영장",
    }, 
  ],
  features: [
    { icon: DoorClosed, label: '방 구성', value: '방 3 · 욕실 2 · 주방 · 테라스 · 풀' },
    { icon: BedDouble, label: '침대 개수', value: '3개' },
    { icon: Users,     label: '인원',     value: '6인' },
    { icon: Dog,       label: '반려견 동반 가능', value: '최대 2마리' },
    { icon: Clock,     label: '체크인/아웃', value: '15:00 / 11:00' },
  ],
  additionalInfo: [
    {
      title: "수영장 안내",
      items: [
        "- 수영장의 크기는 가로 2.6m, 세로 12m, 깊이 1.2m이며 바닷물을 사용합니다.",
        "- 풀은 365일 이용이 가능하고 체크인 시 물을 교체합니다.",
        "- 어린이는 반드시 구명조끼 등 안전 장비를 착용하고 보호자와 함께 이용해야 하며, 다이빙·점프·뜀박질 등 위험 행위는 금지됩니다."
      ]
    },
    {
      title: "추가 요금 안내",
      items: [
        "- 최대 인원(4인)을 초과하여 투숙 시 1인당 100,000원의 추가 요금이 부과됩니다.",
        "- 주차는 2대 무료 제공되며, 추가 1대부터 1박당 20,000원이 청구됩니다."
      ]
    },
    {
      title: "체크인·체크아웃 안내",
      items: [
        "- 얼리 체크인: 오후 3시 이전 체크인 시 20,000원 추가",
        "- 레이트 체크아웃: 3시간 연장 시 150,000원, 6시간 연장 시 300,000원",
        "- 기본 체크인 오후 3시, 체크아웃 오전 11시입니다."
      ]
    },
    {
      title: "시설 이용 안내",
      items: [
        "- 정부의 '일회용품 사용 자제' 시책에 따라 치약·칫솔 등 욕실용품은 제공되지 않으니 개인 준비를 부탁드립니다.",
        "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."
      ]
    }
  ]
};
