import React from 'react';
import { IconClock, IconArtboard, IconUsers } from "@tabler/icons-react";
import Image from "next/image";

export const SpecialActivity = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[700px] w-full">
        <Image src="/images/room/camping-house.jpg" alt="조각공원" fill className="object-cover" />
        <div className="mt-6 absolute z-10 bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="mt-6 absolute z-20 bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <h1 className="text-5xl font-bold">조각공원</h1>
          <p className="mt-2">국내외 유명 작가들의 작품을 감상할 수 있는 야외 조각공원입니다.</p>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <IconClock size={48} />
          <span className="mt-2">관람 시간: 10:00 - 18:00</span>
        </div>
        <div className="flex flex-col items-center">
          <IconArtboard size={48} />
          <span className="mt-2">작품 수: 20여 점</span>
        </div>
        <div className="flex flex-col items-center">
          <IconUsers size={48} />
          <span className="mt-2">가이드 투어: 매일 11시, 15시</span>
        </div>
      </section>

      {/* Description */}
      <section className="mt-16 prose max-w-none">
        <h3>특징</h3>
        <p>
          자연과 예술이 조화롭게 어우러진 야외 조각공원에서 국내외 유명 작가들의 작품을 감상해보세요.
          넓은 잔디밭과 아름다운 조경 속에 설치된 다양한 조각 작품들이 방문객들에게 예술적 영감을 선사합니다.
        </p>
        <p>
          매일 두 차례 진행되는 전문 가이드의 투어 프로그램에 참여하시면 작품에 대한 더 깊은 이해와 
          작가의 의도를 알 수 있는 기회를 얻으실 수 있습니다.
        </p>
      </section>

      {/* Exhibition Zones */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold">메인 전시 구역</h3>
          <p>대형 조각 작품들이 전시된 넓은 잔디 공간으로 작품과 자연이 어우러진 풍경을 감상할 수 있습니다.</p>
          <p className="text-sm text-gray-600 mt-1">작품 수: 10점</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">숲속 갤러리</h3>
          <p>숲속 산책로를 따라 설치된 작품들로, 자연 속에서 예술을 발견하는 특별한 경험을 선사합니다.</p>
          <p className="text-sm text-gray-600 mt-1">작품 수: 8점</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">워터 가든</h3>
          <p>물과 조화를 이루는 작품들이 설치된 공간으로, 물의 움직임과 함께 변화하는 예술을 감상할 수 있습니다.</p>
          <p className="text-sm text-gray-600 mt-1">작품 수: 5점</p>
        </div>
      </section>

      {/* Guide Tour */}
      <section className="mt-16 space-y-4">
        <h3 className="text-xl font-semibold">가이드 투어 안내</h3>
        <ul className="list-disc pl-5">
          <li>운영 시간: 매일 오전 11시, 오후 3시 (약 50분 소요)</li>
          <li>출발 장소: 조각공원 입구</li>
          <li>예약 방법: 프론트 데스크에서 당일 예약 가능 (선착순 10명)</li>
          <li>투어 내용: 작품 설명, 작가 소개, 작품 제작 배경 및 예술적 의미 해석</li>
        </ul>
        <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">투어 예약하기</button>
      </section>
    </main>
  );
};
