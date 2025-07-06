import React from 'react';
import { IconClock, IconRuler, IconSunglasses } from "@tabler/icons-react";
import Image from "next/image";

export const SwimmingPool = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[700px] w-full">
        <Image src="/images/room/ocean-condo.jpg" alt="수영장" fill className="object-cover" />
        <div className="mt-6 absolute z-10 bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="mt-6 absolute z-20 bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <h1 className="text-5xl font-bold">수영장</h1>
          <p className="mt-2">탁 트인 바다를 바라보며 즐길 수 있는 인피니티 풀입니다.</p>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <IconClock size={48} />
          <span className="mt-2">운영 시간: 07:00 - 22:00</span>
        </div>
        <div className="flex flex-col items-center">
          <IconRuler size={48} />
          <span className="mt-2">수심: 1.2m ~ 1.8m</span>
        </div>
        <div className="flex flex-col items-center">
          <IconSunglasses size={48} />
          <span className="mt-2">시설: 선베드, 파라솔, 수건 서비스</span>
        </div>
      </section>

      {/* Description */}
      <section className="mt-16 prose max-w-none">
        <h3>특징</h3>
        <p>
          끝없이 펼쳐진 바다와 맞닿은 듯한 인피니티 풀에서 특별한 수영 경험을 즐겨보세요.
          수영장 주변에는 편안한 선베드와 파라솔이 갖춰져 있어 휴식을 취하기에도 완벽합니다.
        </p>
        <p>
          투숙객을 위한 무료 수건 서비스를 제공하며, 간단한 음료와 스낵을 즐길 수 있는
          수영장 바도 함께 이용하실 수 있습니다.
        </p>
      </section>

      {/* Pool Types */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold">인피니티 풀</h3>
          <p>바다와 하늘이 만나는 듯한 환상적인 경험을 선사하는 메인 수영장입니다.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">어린이 풀</h3>
          <p>아이들이 안전하게 물놀이를 즐길 수 있는 얕은 수심의 키즈 풀입니다.</p>
        </div>
      </section>

      {/* Additional Info */}
      <section className="mt-16 space-y-4">
        <h3 className="text-xl font-semibold">이용 안내</h3>
        <ul className="list-disc pl-5">
          <li>수영장 이용 시 반드시 수영복을 착용해 주세요.</li>
          <li>안전을 위해 음식물 반입은 제한됩니다.</li>
          <li>12세 이하 어린이는 보호자 동반이 필요합니다.</li>
          <li>우천 시 안전을 위해 수영장 이용이 제한될 수 있습니다.</li>
        </ul>
      </section>
    </main>
  );
};
