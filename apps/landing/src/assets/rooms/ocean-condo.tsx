import { IconBell, IconCoffee, IconBeer, IconWifi } from "@tabler/icons-react";
import Image from "next/image";

export const OceanCondo = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[700px] w-full">
        <Image src="/images/room/ocean-condo.jpg" alt="오션 콘도" fill className="object-cover" />
        <div className="mt-6 absolute z-10 bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="mt-6 absolute z-20 bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <h1 className="text-5xl font-bold">오션 콘도</h1>
          <p className="mt-2">호텔 객실과 같은 편안함과, 발코니에서 바라보는 탁 트인 오션뷰를 제공합니다.</p>
        </div>
      </section>

      <section className="container ">

      </section>
      <section className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center">
          <IconBell size={48} />
          <span className="mt-2">룸서비스</span>
        </div>
        <div className="flex flex-col items-center">
          <IconCoffee size={48} />
          <span className="mt-2">조식 뷔페</span>
        </div>
        <div className="flex flex-col items-center">
          <IconBeer size={48} />
          <span className="mt-2">미니바</span>
        </div>
        <div className="flex flex-col items-center">
          <IconWifi size={48} />
          <span className="mt-2">Wi-Fi</span>
        </div>
      </section>

      {/* Room Types */}
      <section className="mt-16 space-y-12">
        {/* Basic Type */}
        <div>
          <h2 className="text-2xl font-semibold">기본형</h2>
          <p className="mt-2">사용 가능 인원: 기본 2인 (침대 1개), 추가 가능 2인, 최대 4인</p>
        </div>
        {/* Expanded Type */}
        <div>
          <h2 className="text-2xl font-semibold">확장형</h2>
          <p className="mt-2">사용 가능 인원: 기본 4인 (침대 2개), 추가 가능 2인, 최대 6인</p>
        </div>
      </section>

      {/* Description */}
      <section className="mt-16 prose max-w-none">
        <h3>특징</h3>
        <p>호텔 형식으로 꾸며진 실내에서 탁 트인 바다 전망과 황홀한 낙조를 자연스럽게 조망할 수 있습니다. 앞 바다에서는 바다 생태 체험, 독살 체험, 바다 낚시 등이 가능합니다.</p>
        <p>야외 베란다에 인덕션과 테이블이 설치되어 있어 요리하며 산과 바다, 밤하늘을 감상할 수 있습니다. (화재 위험으로 숯불 화덕 사용 불가)</p>
        <p>확장형 및 기본형 나동 12호에는 개별 바비큐 화덕과 테이블이 설치되어 있으며, 필요한 바비큐 용품(그릴, 석쇠, 번개탄, 숯, 토치, 장갑 등)이 무료로 제공됩니다.</p>
      </section>

      {/* Facilities */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold">수영장</h3>
          <p>야외 공용 수영장을 사용하실 수 있으며, 바다와 어우러진 아름다운 전망을 즐길 수 있습니다.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">족욕탕</h3>
          <p>야외 수영장 옆에 규격 280×140×60cm의 족욕탕이 있어 계절에 관계없이 이용 가능합니다.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">주방용품</h3>
          <p>냉장고, 전자레인지, 인덕션, 전기밥솥, 커피포트, 냄비, 프라이팬, 도마, 국자, 칼, 그릇 등이 제공되며, 양념은 별도로 준비해 주세요.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">세면도구</h3>
          <p>헤어드라이어, 수건, 바디워시, 샴푸, 린스, 비누 등이 제공되며, 치약과 칫솔은 개별 준비해 주세요.</p>
        </div>
      </section>

      {/* Reservation Info */}
      <section className="mt-16 space-y-4">
        <h3 className="text-xl font-semibold">이용 요금 및 안내</h3>
        <p>1박 기준 요금 및 연박 할인, 추가 인원 요금, 주차 안내 등이 있습니다.</p>
        <button className="mt-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark">예약하러 가기</button>
      </section>
    </main>
  );
};