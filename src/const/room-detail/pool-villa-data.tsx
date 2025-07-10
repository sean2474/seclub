import { RoomInfo } from "@/types";
import { BedDouble, Car, Clock, Dog, Users } from "lucide-react";

export const poolVillaData: RoomInfo = {
  slug: "pool-villa",
  title: (
    <h1 className="text-white font-mono font-light text-5xl md:text-7xl mt-2 md:mt-4">
      海水 <span className="font-pretendard font-thin">풀빌라</span>
    </h1>
  ),
  subtitle: "101-106 객채",
  heroImage: "/images/room/pool-villa/hero.jpg",
  mainImages: [
    "/images/room/pool-villa/main-1.jpg", 
    "/images/room/pool-villa/main-2.jpg", 
    "/images/room/pool-villa/main-3.jpg"
  ],
  overview: (
    <p>SECLUB 풀빌라는 각 독채별로 <span className="text-green-900 font-semibold">프라이빗 가든</span>과 <span className="text-green-900 font-semibold">풀·스파</span>가 완비되어 있어 외부 방해 없이 온전한 휴식을 취할 수 있습니다. 3동과 6동은 직영으로 운영되어 더욱 <span className="text-green-900 font-semibold">깐깐한 </span>관리가 이루어지며, 평일과 주말 모두 <span className="text-green-900 font-semibold">장기 숙박</span>이 가능합니다.</p>
  ),
  amenities: [
    {
      img: "/images/room/pool-villa/grill.jpg",
      title: "바비큐 그릴",
      description: "개별 바비큐 그릴 (숯·번개탄·장갑 등 무료 제공)",
    }, 
    {
      img: "/images/room/pool-villa/kitchen.jpg",
      title: "주방",
      description: "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)",
    }, 
    {
      img: "/images/room/pool-villa/spa.jpg",
      title: "월풀 스파",
      description: "월풀 스파 (입욕제 사용 불가, 2회 사용 후 4시간 대기)",
    }
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
      title: "수영장 안내",
      items: [
        "- 수영장의 크기는 가로 4.5m, 세로 2.5m, 깊이 0.9m이며 바닷물을 사용합니다.",
        "- 이용 기간은 7월과 8월이며, 시즌은 2024년 6월 14일부터 9월 8일까지입니다.",
        "- 수위는 0.75m 이하로 유지되며, 체크인 시 물을 교체합니다.",
        "- 어린이는 반드시 구명조끼 등 안전 장비를 착용하고 보호자와 함께 이용해야 하며, 다이빙·점프·뜀박질 등 위험 행위는 금지됩니다.",
      ]
    },
    {
      title: "추가 요금 안내",
      items: [
        "- 최대 인원(4인)을 초과하여 투숙 시 1인당 20,000원의 추가 요금이 부과됩니다.",
        "- 반려견은 1마리당 10,000원이며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)",
        "- 주차는 독채당 1대 무료 제공되며, 추가 1대부터 1박당 10,000원이 청구됩니다.",
      ]
    },
    {
      title: "체크인·체크아웃 안내",
      items: [
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
        "- 전기 온수 탱크 특성상, 연속 2회 사용 후에는 최소 4시간의 재충전 시간이 필요합니다.",
        "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."
      ]
    }
  ]
};
