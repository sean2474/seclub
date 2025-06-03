import Image from 'next/image';

export const metadata = {
  title: '객실 | SE클럽',
  description: 'SE클럽의 다양한 객실 정보와 가격을 소개합니다. 풀빌라, 자쿠지 단독주택, 호텔형 객실 등 다양한 선택지가 준비되어 있습니다.',
};

type RoomType = {
  id: string;
  name: string;
  type: string;
  capacity: string;
  price: {
    weekday: string;
    weekend: string;
    peak: string;
  };
  description: string;
  features: string[];
  images: string[];
};

// 객실 데이터 (실제로는 API나 데이터베이스에서 가져올 예정)
const rooms: RoomType[] = [
  {
    id: 'pool-villa',
    name: '프라이빗 풀빌라',
    type: '독채',
    capacity: '기준 4인 (최대 6인)',
    price: {
      weekday: '450,000원',
      weekend: '550,000원',
      peak: '650,000원',
    },
    description:
      '넓은 테라스와 전용 수영장을 갖춘 프라이빗 풀빌라입니다. 가족이나 친구들과 함께 특별한 시간을 보내기에 완벽한 공간입니다. 바다가 보이는 전망과 함께 프라이버시가 보장된 휴식을 즐기세요.',
    features: [
      '전용 수영장',
      '넓은 테라스',
      '바비큐 시설',
      '오션뷰',
      '킹 사이즈 침대 2개',
      '완비된 주방',
      '넓은 거실',
      '스마트 TV',
      '무료 WiFi',
      '에어컨',
    ],
    images: ['/images/pool-villa-1.jpg', '/images/pool-villa-2.jpg', '/images/pool-villa-3.jpg'],
  },
  {
    id: 'jacuzzi-house',
    name: '자쿠지 단독주택',
    type: '독채',
    capacity: '기준 4인 (최대 6인)',
    price: {
      weekday: '350,000원',
      weekend: '450,000원',
      peak: '550,000원',
    },
    description:
      '프라이빗 자쿠지를 갖춘 단독주택형 객실입니다. 아늑한 분위기에서 편안한 휴식과 함께 자쿠지에서 피로를 풀며 힐링 시간을 가져보세요. 바다가 보이는 전망이 특징입니다.',
    features: [
      '프라이빗 자쿠지',
      '오션뷰',
      '퀸 사이즈 침대 2개',
      '주방 시설',
      '거실',
      '스마트 TV',
      '무료 WiFi',
      '에어컨',
    ],
    images: ['/images/jacuzzi-1.jpg', '/images/jacuzzi-2.jpg', '/images/jacuzzi-3.jpg'],
  },
  {
    id: 'hotel-room',
    name: '호텔형 객실',
    type: '객실',
    capacity: '기준 2인 (최대 3인)',
    price: {
      weekday: '150,000원',
      weekend: '200,000원',
      peak: '250,000원',
    },
    description:
      '깔끔하고 모던한 디자인의 호텔형 객실입니다. 합리적인 가격으로 편안한 휴식을 원하는 커플이나 소규모 여행객에게 적합합니다. 모든 객실에서 아름다운 바다 전망을 감상하실 수 있습니다.',
    features: [
      '오션뷰',
      '퀸 사이즈 침대 1개',
      '미니 냉장고',
      '전기 포트',
      '스마트 TV',
      '무료 WiFi',
      '에어컨',
    ],
    images: ['/images/hotel-room-1.jpg', '/images/hotel-room-2.jpg', '/images/hotel-room-3.jpg'],
  },
];

export default function RoomsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">객실 안내</h1>
      <p className="text-lg text-center max-w-3xl mx-auto mb-12">
        SE클럽은 다양한 타입의 객실을 제공하여 고객님의 취향과 필요에 맞는 선택이 가능합니다.
        모든 객실에서 아름다운 바다 전망을 감상하실 수 있으며, 쾌적하고 편안한 휴식 공간을 제공합니다.
      </p>

      <div className="grid grid-cols-1 gap-16 mb-12">
        {rooms.map((room) => (
          <div key={room.id} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-video lg:aspect-square">
                <Image
                  src={room.images[0]}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-2">{room.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                    {room.type}
                  </span>
                  <span className="bg-muted px-2 py-1 rounded text-sm">{room.capacity}</span>
                </div>
                <p className="mb-4">{room.description}</p>
                
                <h3 className="text-lg font-bold mb-2">주요 시설</h3>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
                  {room.features.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 mr-1 text-primary"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <h3 className="text-lg font-bold mb-2">요금 안내</h3>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">주중</p>
                      <p className="font-bold">{room.price.weekday}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">주말</p>
                      <p className="font-bold">{room.price.weekend}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">성수기</p>
                      <p className="font-bold">{room.price.peak}</p>
                    </div>
                  </div>
                  
                  <a
                    href={`/reservation?room=${room.id}`}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-md text-center block"
                  >
                    예약하기
                  </a>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-6 pt-0">
              {room.images.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                  <Image src={image} alt={`${room.name} 이미지 ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">이용 안내</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">기본 정보</h3>
            <ul className="space-y-2">
              <li>
                <strong>체크인:</strong> 15:00 ~ 18:00
              </li>
              <li>
                <strong>체크아웃:</strong> 11:00
              </li>
              <li>
                <strong>예약 보증금:</strong> 객실 요금의 30%
              </li>
              <li>
                <strong>조식:</strong> 별도 요금 (사전 예약 필요)
              </li>
              <li>
                <strong>반려동물:</strong> 일부 객실 가능 (사전 문의 필수)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">취소 및 환불 규정</h3>
            <ul className="space-y-2">
              <li>
                <strong>이용 7일 전 취소:</strong> 100% 환불
              </li>
              <li>
                <strong>이용 3일 전 취소:</strong> 70% 환불
              </li>
              <li>
                <strong>이용 1일 전 취소:</strong> 50% 환불
              </li>
              <li>
                <strong>당일 취소 및 노쇼:</strong> 환불 불가
              </li>
              <li>
                <strong>성수기 및 특별 기간:</strong> 별도 취소 규정 적용
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
