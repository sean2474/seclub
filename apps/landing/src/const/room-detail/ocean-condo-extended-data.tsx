import { RoomInfo } from "@/types";
import { BedDouble, Clock, DoorClosed, Users } from "lucide-react";

export const oceanCondoExtendedData: RoomInfo = {
  slug: "ocean-condo-extended",
  name: "오션 콘도 디럭스",
  title: "오션 콘도 디럭스",
  subtitle: "콘도형",
  heroImage: "/images/room/ocean-condo-extended/hero.jpg",
  mainImages: [
    "/images/room/ocean-condo-extended/main-1.jpg", 
    "/images/room/ocean-condo-extended/main-2.jpg", 
    "/images/room/ocean-condo-extended/main-3.jpg", 
    "/images/room/ocean-condo-extended/main-4.png", 
  ],
  overview: (
    <p>SE CLUB 오션콘도는 탁 트인 바다 전망과 황홀한 노을을 객실에서 감상할 수 있는 콘도입니다. <span className="text-green-900 font-semibold">실내 주방</span>과 <span className="text-green-900 font-semibold">야외 인덕션</span> 테이블, <span className="text-green-900 font-semibold"> 숯불 화덕 바베큐</span>가 마련되어 있어 바다와 산, 별빛을 배경으로 낭만적인 요리를 즐길 수 있습니다.</p>
  ),
  amenities: [
    {
      img: "/images/room/ocean-condo-extended/kitchen.jpg",
      title: "주방",
      description: "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)",
    }, 
    {
      img: "/images/room/ocean-condo-extended/grill.jpg",
      title: "바비큐 그릴",
      description: "개별 바비큐 그릴 (확장형, 기본형 나동 12호)",
    }, 
    {
      img: "/images/room/ocean-condo-extended/induction.jpg",
      title: "야외 인덕션",
      description: "주방 별도 야외 베란다 인덕션과 테이블 설치",
    }
  ],
  features: [
    { icon: DoorClosed, label: '방 구성', value: '방 · 욕실 · 주방 · 테라스' },
    { icon: BedDouble, label: '침대 개수', value: '2개' },
    { icon: Users,     label: '인원',     value: '4인 (최대 6인)' },
    { icon: Clock,     label: '체크인/아웃', value: '15:00 / 11:00' },
  ],
  additionalInfo: [
    {
      title: "추가 요금 안내",
      items: [
        "- 기준인원(2인)을 초과하여 투숙 시 초과 1인당 1박에 20,000원 추가 요금이 부과되며 초과 된 인원의 침구류 등은 사전에 세팅됩니다.",
        "- - 반려견은 1마리당 1박에 10,000원이 부과되며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)",
        "- 주차는 동별 1대는 무료이며, 초과 1대부터 1박당 10,000원이 부과됩니다. (초과차량은 공용주차장에 주차)",
      ]
    },
    {
      title: "체크인·체크아웃 안내",
      items: [
        "- 얼리 체크인: 오후 2시 이전 체크인 시 20,000원 추가",
        "- 레이트 체크아웃: 3시간 연장 시 45,000원, 6시간 연장 시 60,000원",
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
