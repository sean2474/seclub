import React from 'react';
import { IconSun, IconMapPin } from "@tabler/icons-react";
import Image from "next/image";

export const PhotoSpot = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[700px] w-full">
        <Image src="/images/room/spa-villa.jpg" alt="포토스팟" fill className="object-cover" />
        <div className="mt-6 absolute z-10 bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="mt-6 absolute z-20 bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <h1 className="text-5xl font-bold">포토스팟</h1>
          <p className="mt-2">인생 사진을 남길 수 있는 다양한 포토존이 마련되어 있습니다.</p>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <IconSun size={48} />
          <span className="mt-2">추천 시간: 일출, 일몰</span>
        </div>
        <div className="flex flex-col items-center">
          <IconMapPin size={48} />
          <span className="mt-2">위치: 해변가, 정원, 수영장</span>
        </div>
      </section>

      {/* Description */}
      <section className="mt-16 prose max-w-none">
        <h3>특징</h3>
        <p>
          리조트 내 다양한 장소에 마련된 포토스팟에서 잊지 못할 추억을 사진으로 남겨보세요.
          자연과 어우러진 아름다운 배경에서 인생샷을 건질 수 있습니다.
        </p>
        <p>
          일출과 일몰 시간대에는 더욱 환상적인 분위기를 연출할 수 있으며,
          계절별로 변화하는 자연 환경이 다양한 매력을 선사합니다.
        </p>
      </section>

      {/* Photo Zones */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold">바다 전망대</h3>
          <p>탁 트인 바다를 배경으로 멋진 사진을 촬영할 수 있는 공간입니다.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">자쿠지 포토존</h3>
          <p>로맨틱한 분위기를 연출할 수 있는 자쿠지 포토존입니다.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">플라워 가든</h3>
          <p>계절마다 다른 꽃들로 둘러싸인 아름다운 가든 포토존입니다.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">인피니티 풀</h3>
          <p>바다와 하나가 된 듯한 인피니티 풀에서 환상적인 사진을 남겨보세요.</p>
        </div>
      </section>

      {/* Photography Tips */}
      <section className="mt-16 space-y-4">
        <h3 className="text-xl font-semibold">촬영 팁</h3>
        <ul className="list-disc pl-5">
          <li>일출 시간대(오전 5-7시)와 일몰 시간대(오후 5-7시)에 황금빛 조명이 가장 아름답습니다.</li>
          <li>구름이 약간 있는 날씨에 더 극적인 사진을 촬영할 수 있습니다.</li>
          <li>셀프 촬영이 어려운 경우 프론트 데스크에서 촬영 도움을 요청하실 수 있습니다.</li>
        </ul>
      </section>
    </main>
  );
};
