import React from 'react';
import { IconRuler, IconClock, IconBarbell } from "@tabler/icons-react";
import Image from "next/image";

export const Walk = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[700px] w-full">
        <Image src="/images/room/pool-villa.jpg" alt="산책로" fill className="object-cover" />
        <div className="mt-6 absolute z-10 bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="mt-6 absolute z-20 bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <h1 className="text-5xl font-bold">산책로</h1>
          <p className="mt-2">아름다운 자연 속에서 여유롭게 산책을 즐길 수 있는 산책로입니다.</p>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <IconRuler size={48} />
          <span className="mt-2">총 길이: 약 2km</span>
        </div>
        <div className="flex flex-col items-center">
          <IconClock size={48} />
          <span className="mt-2">소요 시간: 약 30분</span>
        </div>
        <div className="flex flex-col items-center">
          <IconBarbell size={48} />
          <span className="mt-2">난이도: 쉬움</span>
        </div>
      </section>

      {/* Description */}
      <section className="mt-16 prose max-w-none">
        <h3>특징</h3>
        <p>
          계절마다 다른 매력을 느낄 수 있는 산책로는 자연과 함께 호흡하며 여유를 즐길 수 있는 공간입니다.
          다양한 식물과 꽃들로 둘러싸인 이 길은 가벼운 산책이나 조깅을 즐기기에 완벽합니다.
        </p>
        <p>
          산책로를 따라 벤치와 쉼터가 마련되어 있어 언제든 휴식을 취할 수 있으며,
          주변의 아름다운 자연 경관을 감상하며 힐링의 시간을 가질 수 있습니다.
        </p>
      </section>

      {/* Trail Course */}
      <section className="mt-16 space-y-12">
        <div>
          <h2 className="text-2xl font-semibold">A코스 - 숲속 산책로</h2>
          <p className="mt-2">시원한 그늘을 제공하는 울창한 숲속을 통과하는 코스</p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">B코스 - 바다 전망 코스</h2>
          <p className="mt-2">탁 트인 바다 전망을 감상할 수 있는 해안가 코스</p>
        </div>
      </section>

      {/* Best Time */}
      <section className="mt-16 space-y-4">
        <h3 className="text-xl font-semibold">추천 이용 시간</h3>
        <p>일출 시간대(오전 5-7시)와 일몰 시간대(오후 5-7시)에 가장 아름다운 풍경을 감상하실 수 있습니다.</p>
      </section>
    </main>
  );
};
