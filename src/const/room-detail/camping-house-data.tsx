import { RoomInfo } from "@/types";
import { BedDouble, Car, Clock, Dog, Users } from "lucide-react";

export const campingHouseData: RoomInfo = {
  slug: "camping-house",
  title: "선셋 캠핑하우스",
  subtitle: "글램핑/캠핑",
  heroImage: "/images/room/camping-house/hero.jpg",
  mainImages: [
    "/images/room/camping-house/main-1.jpg", 
    "/images/room/camping-house/main-2.jpeg",
    "/images/room/camping-house/main-3.jpg"
  ],
  overview: (
    <p>SE CLUB 오션콘도는 탁 트인 <span className="text-green-900 font-semibold">바다전망</span>과 황홀한 낙조를 객실에서 감상할 수 있는 호텔형 콘도로, 모두 <span className="text-green-900 font-semibold">장기 숙박</span>이 가능합니다. 실내 주방 외에 <span className="text-green-900 font-semibold">야외 베란다 인덕션</span>과 테이블을 갖춰 바다·산·별빛을 배경으로 요리할 수 있으며, 일부 객실에서는 <span className="text-green-900 font-semibold">무료 숯불 화덕 바비큐</span>도 즐길 수 있습니다.</p>
  ),
  amenities: [
    {
      img: "/images/room/camping-house/grill.jpg",
      title: "바비큐 그릴",
      description: "개별 바비큐 그릴 (숯·번개탄·장갑 등 무료 제공)",
    }, 
    {
      img: "/images/room/camping-house/kitchen.jpg",
      title: "주방",
      description: "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)",
    }, 
  ],
  features: [
    { icon: BedDouble, label: '침대 개수', value: '2개' },
    { icon: Users,     label: '인원',     value: '4~6인' },
    { icon: Dog,       label: '반려견 동반', value: '최대 2마리' },
    { icon: Car,       label: '차량 주차',  value: '독채당 1대 무료' },
    { icon: Clock,     label: '체크인/아웃', value: '15:00 / 11:00' },
  ],
  additionalInfo: [
    {
      title: "추가 요금 안내",
      items: [
        "- 기본인원(4인)에서 추가되는 인원의 1인당 요금은 20,000원이며, 예약하신 추가된 인원의 침구, 세면도구, 식기류 등은 사전에 세팅됩니다.",
        "- 반려견은 1마리당 10,000원이며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)",
        "- 1개 시설마다 차량 1대의 주차장이 준비되어 있으며, 초과차량 1대당 10,000원/(1박)이 부과됩니다. (초과차량은 공용주차장에 주차)",
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
        "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."
      ]
    }
  ]
};
