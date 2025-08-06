import { RoomInfo } from "@/types";
import { BedDouble, Clock, Dog, DoorClosed, Users } from "lucide-react";

export const poolVillaData: RoomInfo = {
  slug: "pool-villa",
  name: "해수 풀빌라",
  title: (
    <h1 className="text-white font-mono font-light text-5xl md:text-7xl mt-2 md:mt-4">
      海水 <span className="font-pretendard font-thin">풀빌라</span>
    </h1>
  ),
  subtitle: "101-106 독채",
  heroImage: "/images/room/pool-villa/hero.jpg",
  mainImages: [
    "/images/room/pool-villa/main-1.jpg", 
    "/images/room/pool-villa/main-2.jpg", 
    "/images/room/pool-villa/main-3.jpg",
    "/images/room/pool-villa/main-4.jpg"
  ],
  overview: (
    <p>피부 진정과 스트레스 완화에 효과적인 <span className="text-green-900 font-semibold">해수</span>를 사용하는 SE CLUB 海水풀빌라는, 각 독채마다 <span className="text-green-900 font-semibold">프라이빗 가든</span>과 전용 <span className="text-green-900 font-semibold">풀·스파</span>가 완비된 유니크한 힐링 공간입니다. 외부의 방해 없이 오롯이 나만의 시간을 즐기며 깊은 휴식을 경험할 수 있습니다</p>
  ),
  amenities: [
    {
      img: "/images/room/pool-villa/kitchen.jpg",
      title: "주방",
      description: "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)",
    }, 
    {
      img: "/images/room/pool-villa/pool.jpg",
      title: "해수 풀",
      description: "바닷물을 이용한 풀 (규격 4.5 * 2.5 * 0.9m)",
    }, 
    {
      img: "/images/room/pool-villa/grill.jpg",
      title: "바비큐 그릴",
      description: "개별 바비큐 그릴 (숯·번개탄·장갑 등 무료 제공)",
    }, 
    {
      img: "/images/room/pool-villa/spa.jpg",
      title: "월풀 스파",
      description: "월풀 스파 (입욕제 사용 불가, 2회 사용 후 4시간 대기)",
    }
  ],
  features: [
    { icon: DoorClosed, label: '방 구성', value: '방 2 · 욕실 · 주방 · 테라스' },
    { icon: BedDouble, label: '침대 개수', value: '2개' },
    { icon: Users,     label: '인원',     value: '4인 (최대 6인)' },
    { icon: Dog,       label: '반려견 동반 가능', value: '최대 2마리' },
    { icon: Clock,     label: '체크인/아웃', value: '15:00 / 11:00' },
  ],
  additionalInfo: [
    {
      title: "수영장 안내",
      items: [
        "- 수영장의 크기는 가로 4.5m, 세로 2.5m, 깊이 0.9m이며 바닷물을 사용합니다.",
        "- 이용 기간은 7~8월이며 확정 일정은 별도 공지를 통해 안내됩니다.",
        "- 수위는 0.75m 이하로 유지되며, 체크인 시 물을 교체합니다.",
        "- 바닷물을 이용 함으로 피부에 좋은 머드 등이 섞일 수 있으며 태풍 등 천재지변 시 이용이 어려울 수 있습니다.",
        "- 어린이는 반드시 구명조끼 등 안전 장비를 착용하고 보호자와 함께 이용해야 하며, 다이빙·점프·뜀박질 등 위험 행위는 금지됩니다.",
      ]
    },
    {
      title: "추가 요금 안내",
      items: [
        "- 기준 인원(4인)을 초과하여 투숙 시 초과 1인당 1박에 20,000원 추가 요금이 부과되며 초과 된 인원의 침구류 등은 사전에 세팅됩니다.",
        "- 반려견은 1마리당 1박에 10,000원이 부과되며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)",
        "- 주차는 동별 1대는 무료이며, 초과 1대부터 1박당 10,000원이 부과됩니다. (초과차량은 공용주차장에 주차)",
      ]
    },
    {
      title: "체크인·체크아웃 안내",
      items: [
        "- 얼리 체크인: 오후 2시 이전 체크인 시 20,000원 추가",
        "- 레이트 체크아웃: 3시간 연장 시 55,000원, 6시간 연장 시 70,000원",
        "- 기본 체크인 오후 3시, 체크아웃 오전 11시입니다.",
      ]
    },
    {
      title: "시설 이용 안내",
      items: [
        "- 정부의 ‘일회용품 사용 자제’ 시책에 따라 치약·칫솔 등 욕실용품은 제공되지 않으니 개인 준비를 부탁드립니다.",
        "- 스파 설비 고장 위험으로 인해 입욕제 사용은 불가합니다.",
        "- 전기 온수 탱크 특성상, 1회 사용 후에는 최소 4시간이 경과 후에 재사용이 가능합니다. (온수를 틀기 전에 꼭 스파 배수구를 막아 주세요.)",
        "- 건강한 생태계에서는 풍뎅이, 나방, 돈 벌래 등 여러 가지 곤충들이 서식하고 있습니다. 절대로 창문이나 출입문을 열어두시면 안됩니다."
      ]
    }
  ]
};
