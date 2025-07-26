import { RoomInfo } from "@/types";
import { BedDouble, Car, Clock, Dog, Users } from "lucide-react";

export const spaVillaData: RoomInfo = {
  slug: "spa-villa",
  title: "오션스파빌라",
  subtitle: "자쿠지",
  heroImage: "/images/room/spa-villa/hero.jpg",
  mainImages: [
    "/images/room/spa-villa/main-1.png", 
    "/images/room/spa-villa/main-2.jpeg", 
    "/images/room/spa-villa/main-3.jpg", 
    "/images/room/spa-villa/main-4.jpg", 
    "/images/room/spa-villa/main-5.jpg", 
    "/images/room/spa-villa/main-6.jpg", 
  ],
  overview: (
    <p>SE CLUB 오션 스파빌라는 다락방이 있는 2층 복층형 단독주택으로, <span className="text-green-900 font-semibold">넓은 테라스</span>와 프라이빗 야외 <span className="text-green-900 font-semibold">자쿠지 스파</span>가 마련된 힐링 공간입니다. 바다와 산, 별빛을 배경으로 온전한 휴식을 즐길 수 있으며, <span className="text-green-900 font-semibold">개별 바비큐 화덕</span>과 <span className="text-green-900 font-semibold">완비된 주방</span>, 세면도구까지 갖추어 편안함과 낭만을 모두 누릴 수 있습니다
</p>
  ),
  amenities: [
    {
      img: "/images/room/spa-villa/kitchen.jpeg",
      title: "주방",
      description: "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)",
    },
    {
      img: "/images/room/spa-villa/grill.jpeg",
      title: "바비큐 그릴",
      description: "개별 바비큐 그릴 (숯·번개탄·장갑 등 무료 제공)",
    }, 
    {
      img: "/images/room/spa-villa/jacuzzi.jpeg",
      title: "자쿠지",
      description: "개별 자쿠지 (계절 관계없이 사용 가능)",
    }, 
  ],
  features: [
    { icon: BedDouble, label: '침대 개수', value: '2개' },
    { icon: Users,     label: '인원',     value: '4~6인' },
    { icon: Dog,       label: '반려견 동반 가능', value: '최대 2마리' },
    { icon: Car,       label: '차량 주차',  value: '독채당 1대 무료' },
    { icon: Clock,     label: '체크인/아웃', value: '15:00 / 11:00' },
  ],
  additionalInfo: [
    {
      title: "객실 안내",
      items: [
        "- 기본형: 2인(침대 1개), 추가 최대 2인(최대 4인), 나동 12호에 숯불화덕 설치",
        "- 확장형: 4인(침대 2개), 추가 최대 2인(최대 6인), 숯불화덕·야외 베란다 인덕션·테이블 설치",
      ],
    },
    {
      title: "추가 요금 안내",
      items: [
        "- 기본인원(기본 2인 확장 4인)에서 추가되는 인원의 1인당 요금은 20,000원이며, 예약하신 추가된 인원의 침구, 세면도구, 식기류 등은 사전에 세팅됩니다.",
        "- 반려견은 1마리당 10,000원이며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)",
        "- 주차는 독채당 1대 무료 제공되며, 추가 1대부터 1박당 10,000원이 청구됩니다.",
      ]
    },
    {
      title: "체크인·체크아웃 & 요금 안내",
      items: [
        "- 요금(비수기/성수기)은 웹사이트 요금표를 참고해 주세요.",
        "- 얼리 체크인: 오후 3시 이전 체크인 시 20,000원 추가",
        "- 레이트 체크아웃: 3시간 연장 시 55,000원, 6시간 연장 시 70,000원",
        "- 기본 체크인 오후 3시, 체크아웃 오전 11시입니다.",
      ]
    },
    {
      title: "시설 이용 안내",
      items: [
        "- 정부의 ‘일회용품 사용 자제’ 시책에 따라 치약·칫솔 등 욕실용품은 제공되지 않으니 개인 준비를 부탁드립니다.",
        "- 스파 설비 고장 위험으로 인해 입욕제 사용은 불가합니다.",
        "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."
      ]
    }
  ]
};
