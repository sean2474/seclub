import React from 'react';
import { IconClock, IconBuilding, IconCup } from "@tabler/icons-react";
import Image from "next/image";

export const ArtGallery = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[700px] w-full">
        <Image src="/images/room/camping-house.jpg" alt="부대시설" fill className="object-cover" />
        <div className="mt-6 absolute z-10 bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="mt-6 absolute z-20 bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <h1 className="text-5xl font-bold">부대시설</h1>
          <p className="mt-2">투숙객을 위한 다양한 부대시설이 마련되어 있습니다.</p>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center">
          <IconCup size={48} />
          <span className="mt-2">레스토랑: 07:00 - 22:00</span>
        </div>
        <div className="flex flex-col items-center">
          <IconClock size={48} />
          <span className="mt-2">스파: 10:00 - 21:00 (예약 필요)</span>
        </div>
        <div className="flex flex-col items-center">
          <IconBuilding size={48} />
          <span className="mt-2">피트니스 센터: 24시간</span>
        </div>
        <div className="flex flex-col items-center">
          <IconCup size={48} />
          <span className="mt-2">라운지: 10:00 - 23:00</span>
        </div>
      </section>

      {/* Description */}
      <section className="mt-16 prose max-w-none">
        <h3>특징</h3>
        <p>
          휴양과 편안함을 위한 다양한 부대시설을 갖추고 있으며, 투숙객 여러분께 최상의 서비스를 제공합니다.
          레스토랑에서는 신선한 현지 식재료로 준비한 다양한 요리를 즐기실 수 있으며,
          스파에서는 전문가의 손길로 힐링을 경험하실 수 있습니다.
        </p>
        <p>
          24시간 운영되는 피트니스 센터에서는 최신 장비로 건강을 유지하실 수 있고,
          라운지에서는 편안한 분위기 속에서 휴식을 취하실 수 있습니다.
        </p>
      </section>

      {/* Facilities */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold">레스토랑</h3>
          <p>신선한 지역 식재료로 준비한 다양한 요리를 제공하는 메인 레스토랑입니다.</p>
          <p className="text-sm text-gray-600 mt-1">운영 시간: 07:00 - 22:00</p>
          <p className="text-sm text-gray-600">조식 뷔페: 07:00 - 10:00</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">스파</h3>
          <p>전문 테라피스트의 손길로 완벽한 휴식과 힐링을 경험할 수 있는 공간입니다.</p>
          <p className="text-sm text-gray-600 mt-1">운영 시간: 10:00 - 21:00 (예약 필요)</p>
          <p className="text-sm text-gray-600">대표 프로그램: 아로마 테라피, 스웨디시 마사지, 핫스톤 마사지</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">피트니스 센터</h3>
          <p>최신 운동 장비가 갖춰진 24시간 이용 가능한 피트니스 센터입니다.</p>
          <p className="text-sm text-gray-600 mt-1">운영 시간: 24시간</p>
          <p className="text-sm text-gray-600">시설: 유산소 장비, 웨이트 머신, 요가 매트</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">라운지</h3>
          <p>음료와 간단한 다과를 즐기며 휴식을 취할 수 있는 편안한 공간입니다.</p>
          <p className="text-sm text-gray-600 mt-1">운영 시간: 10:00 - 23:00</p>
          <p className="text-sm text-gray-600">제공: 커피, 차, 음료, 간단한 스낵</p>
        </div>
      </section>

      {/* Additional Info */}
      <section className="mt-16 space-y-4">
        <h3 className="text-xl font-semibold">이용 안내</h3>
        <ul className="list-disc pl-5">
          <li>레스토랑은 예약 없이 이용 가능하나, 저녁 식사 시간대는 사전 예약을 권장합니다.</li>
          <li>스파는 반드시 사전 예약이 필요하며, 프론트 데스크를 통해 예약해 주세요.</li>
          <li>피트니스 센터 이용 시 적절한 운동복과 운동화를 착용해 주세요.</li>
          <li>라운지에서는 객실 키를 제시하시면 무료 음료 서비스를 이용하실 수 있습니다.</li>
        </ul>
      </section>
    </main>
  );
};
