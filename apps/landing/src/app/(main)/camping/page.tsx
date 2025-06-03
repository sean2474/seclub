import Image from 'next/image';

export const metadata = {
  title: '캠핑 | SE클럽',
  description: 'SE클럽의 캠핑장 정보와 예약 안내입니다. 바다가 보이는 아름다운 전망과 함께 편안한 캠핑을 즐겨보세요.',
};

type CampingSiteType = {
  id: string;
  name: string;
  capacity: string;
  size: string;
  price: {
    weekday: string;
    weekend: string;
    peak: string;
  };
  description: string;
  features: string[];
  images: string[];
};

// 캠핑장 데이터 (실제로는 API나 데이터베이스에서 가져올 예정)
const campingSites: CampingSiteType[] = [
  {
    id: 'ocean-view',
    name: '오션뷰 사이트',
    capacity: '기준 4인 (최대 6인)',
    size: '8m x 10m',
    price: {
      weekday: '70,000원',
      weekend: '90,000원',
      peak: '120,000원',
    },
    description:
      '바다가 한눈에 보이는 전망 좋은 캠핑 사이트입니다. 넓은 공간에서 가족, 친구들과 함께 자연을 만끽하며 캠핑을 즐기세요. 차량 진입이 가능하며 전기 사용이 가능합니다.',
    features: [
      '바다 전망',
      '잔디 사이트',
      '전기 사용 가능',
      '차량 진입 가능',
      '화장실 및 샤워실 인접',
      '취사장 이용 가능',
    ],
    images: ['/images/camping-ocean-1.jpg', '/images/camping-ocean-2.jpg', '/images/camping-ocean-3.jpg'],
  },
  {
    id: 'forest-view',
    name: '포레스트 사이트',
    capacity: '기준 4인 (최대 6인)',
    size: '7m x 9m',
    price: {
      weekday: '60,000원',
      weekend: '80,000원',
      peak: '100,000원',
    },
    description:
      '숲속의 아늑한 분위기를 느낄 수 있는 캠핑 사이트입니다. 나무 그늘 아래서 시원하게 캠핑을 즐기실 수 있습니다. 차량 진입이 가능하며 전기 사용이 가능합니다.',
    features: [
      '숲속 환경',
      '흙바닥 사이트',
      '전기 사용 가능',
      '차량 진입 가능',
      '화장실 및 샤워실 인접',
      '취사장 이용 가능',
    ],
    images: ['/images/camping-forest-1.jpg', '/images/camping-forest-2.jpg', '/images/camping-forest-3.jpg'],
  },
  {
    id: 'glamping',
    name: '글램핑 텐트',
    capacity: '기준 2인 (최대 4인)',
    size: '원형 텐트 (지름 4m)',
    price: {
      weekday: '120,000원',
      weekend: '150,000원',
      peak: '180,000원',
    },
    description:
      '캠핑 장비 없이도 편안하게 즐길 수 있는 글램핑 텐트입니다. 내부에 침구류와 기본 가구가 구비되어 있어 손쉽게 캠핑을 즐기실 수 있습니다. 바비큐 그릴이 제공됩니다.',
    features: [
      '침구류 제공',
      '전기 사용 가능',
      '조명 및 선풍기 구비',
      '바비큐 그릴 제공',
      '화장실 및 샤워실 인접',
      '취사도구 구비',
    ],
    images: ['/images/glamping-1.jpg', '/images/glamping-2.jpg', '/images/glamping-3.jpg'],
  },
];

export default function CampingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">캠핑장 안내</h1>
      <p className="text-lg text-center max-w-3xl mx-auto mb-12">
        SE클럽 캠핑장은 바다가 보이는 아름다운 전망과 함께 편안한 캠핑을 즐길 수 있는 공간입니다.
        다양한 형태의 캠핑 사이트를 제공하여 고객님의 취향에 맞는 선택이 가능합니다.
      </p>

      <div className="grid grid-cols-1 gap-16 mb-12">
        {campingSites.map((site) => (
          <div key={site.id} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-video lg:aspect-square">
                <Image
                  src={site.images[0]}
                  alt={site.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col">
                <h2 className="text-2xl font-bold mb-2">{site.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-muted px-2 py-1 rounded text-sm">{site.capacity}</span>
                  <span className="bg-muted px-2 py-1 rounded text-sm">사이트 크기: {site.size}</span>
                </div>
                <p className="mb-4">{site.description}</p>
                
                <h3 className="text-lg font-bold mb-2">주요 시설</h3>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
                  {site.features.map((feature, index) => (
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
                      <p className="font-bold">{site.price.weekday}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">주말</p>
                      <p className="font-bold">{site.price.weekend}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">성수기</p>
                      <p className="font-bold">{site.price.peak}</p>
                    </div>
                  </div>
                  
                  <a
                    href={`/reservation?camping=${site.id}`}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-md text-center block"
                  >
                    예약하기
                  </a>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-6 pt-0">
              {site.images.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-md overflow-hidden">
                  <Image src={image} alt={`${site.name} 이미지 ${index + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">캠핑장 이용 안내</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-2">기본 정보</h3>
            <ul className="space-y-2">
              <li>
                <strong>체크인:</strong> 14:00 ~ 18:00
              </li>
              <li>
                <strong>체크아웃:</strong> 11:00
              </li>
              <li>
                <strong>예약 보증금:</strong> 이용 요금의 30%
              </li>
              <li>
                <strong>매점 운영:</strong> 09:00 ~ 21:00
              </li>
              <li>
                <strong>반려동물:</strong> 동반 가능 (리드줄 필수)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">시설 안내</h3>
            <ul className="space-y-2">
              <li>
                <strong>화장실 및 샤워실:</strong> 24시간 이용 가능
              </li>
              <li>
                <strong>취사장:</strong> 공용 취사장 이용 가능
              </li>
              <li>
                <strong>전기:</strong> 모든 사이트 전기 사용 가능
              </li>
              <li>
                <strong>바비큐:</strong> 개별 바비큐 그릴 대여 가능 (유료)
              </li>
              <li>
                <strong>주차:</strong> 사이트 내 1대 무료 주차
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8">
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
  );
}
