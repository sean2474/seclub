import Image from 'next/image';

export const metadata = {
  title: '소개 | SE클럽',
  description: 'SE클럽(태안둘레길캠핑장)의 역사와 시설, 주변 관광지 정보를 소개합니다.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">SE클럽 소개</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
        <div className="relative aspect-square">
          <Image
            src="/images/about-main.jpg"
            alt="SE클럽 전경"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">프라이빗 힐링 공간, SE클럽</h2>
          <p className="text-lg mb-4">
            2015년에 설립된 SE클럽(태안둘레길캠핑장)은 충청남도 태안군의 아름다운 해안가에 위치한 
            복합 숙박 시설입니다. 자연과 조화를 이루는 건축 디자인과 편안한 시설로 방문객들에게 
            특별한 휴식 경험을 제공합니다.
          </p>
          <p className="text-lg mb-4">
            풀빌라, 자쿠지 단독주택, 호텔형 객실, 캠핑장 등 다양한 형태의 숙박 시설을 갖추고 있어 
            고객의 취향과 필요에 맞는 선택이 가능합니다.
          </p>
          <p className="text-lg">
            바다가 보이는 전망과 함께 수영장, 바비큐 시설, 조각공원, 관광농원 등 다양한 부대시설을 
            통해 방문객들에게 잊지 못할 추억을 선사합니다.
          </p>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">시설 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">객실</h3>
            <ul className="space-y-2">
              <li>풀빌라 (4인 기준)</li>
              <li>자쿠지 단독주택 (4-6인 기준)</li>
              <li>호텔형 객실 (2인 기준)</li>
              <li>전 객실 오션뷰</li>
              <li>침구류 및 타올 제공</li>
            </ul>
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">캠핑장</h3>
            <ul className="space-y-2">
              <li>바다 조망 캠핑사이트</li>
              <li>차량 진입 가능</li>
              <li>전기 사용 가능</li>
              <li>화장실 및 샤워실</li>
              <li>공용 취사장</li>
            </ul>
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-3">부대시설</h3>
            <ul className="space-y-2">
              <li>야외 수영장 (하계 운영)</li>
              <li>바비큐장</li>
              <li>조각공원</li>
              <li>관광농원</li>
              <li>전망대</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">주변 관광지</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="relative aspect-video">
              <Image
                src="/images/nearby-1.jpg"
                alt="태안해안국립공원"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">태안해안국립공원</h3>
              <p>차로 15분 거리에 위치한 태안해안국립공원은 아름다운 해안선과 자연경관을 자랑합니다.</p>
            </div>
          </div>
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="relative aspect-video">
              <Image
                src="/images/nearby-2.jpg"
                alt="만리포해수욕장"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold mb-2">만리포해수욕장</h3>
              <p>차로 20분 거리에 위치한 만리포해수욕장은 넓은 백사장과 얕은 수심으로 가족 여행객에게 인기가 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">오시는 길</h2>
        <div className="border rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">주소</h3>
            <p>충청남도 태안군 [상세 주소]</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold mb-2">자가용 이용 시</h3>
            <p>서해안고속도로 → 태안IC → 태안방면 → [상세 경로]</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">대중교통 이용 시</h3>
            <p>서울 센트럴시티터미널 → 태안터미널 → 택시 또는 버스 이용 (약 20분 소요)</p>
          </div>
          <div className="relative aspect-video mt-6">
            {/* 여기에 지도가 들어갈 예정입니다 */}
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">지도가 들어갈 영역</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
