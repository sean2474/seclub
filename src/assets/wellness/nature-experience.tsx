import React from 'react';
import { IconClock, IconCalendarEvent, IconClockHour4 } from "@tabler/icons-react";
import Image from "next/image";

export const NatureExperience = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[700px] w-full">
        <Image src="/images/room/camping-house.jpg" alt="자연 체험 프로그램" fill className="object-cover" />
        <div className="mt-6 absolute z-10 bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
        <div className="mt-6 absolute z-20 bottom-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <h1 className="text-5xl font-bold">자연 체험 프로그램</h1>
          <p className="mt-2">자연과 교감할 수 있는 다양한 체험 프로그램을 제공합니다.</p>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <IconCalendarEvent size={48} />
          <span className="mt-2">예약 필요: 프론트 데스크 (최소 1일 전)</span>
        </div>
        <div className="flex flex-col items-center">
          <IconClock size={48} />
          <span className="mt-2">프로그램: 숲 명상, 가든 투어, 별 관측</span>
        </div>
        <div className="flex flex-col items-center">
          <IconClockHour4 size={48} />
          <span className="mt-2">소요 시간: 프로그램별 1~2시간</span>
        </div>
      </section>

      {/* Description */}
      <section className="mt-16 prose max-w-none">
        <h3>특징</h3>
        <p>
          자연 속에서 힐링과 배움을 동시에 경험할 수 있는 다양한 체험 프로그램을 제공합니다.
          전문 강사와 함께하는 프로그램을 통해 자연의 소중함을 느끼고 새로운 경험을 쌓아보세요.
        </p>
        <p>
          모든 프로그램은 환경을 보호하고 자연과 조화롭게 어우러지는 방식으로 진행되며,
          연령과 관계없이 모두가 즐길 수 있는 다양한 난이도의 프로그램이 준비되어 있습니다.
        </p>
      </section>

      {/* Programs */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold">숲 명상</h3>
          <p>울창한 숲속에서 전문 강사의 지도 아래 명상을 통해 마음의 평화를 찾는 시간입니다.</p>
          <p className="text-sm text-gray-600 mt-1">매일 오전 9시 / 소요시간 1시간</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">가든 투어</h3>
          <p>리조트 내 정원을 전문 가이드와 함께 둘러보며 다양한 식물에 대해 배워보는 시간입니다.</p>
          <p className="text-sm text-gray-600 mt-1">매일 오후 2시 / 소요시간 1시간 30분</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">별 관측</h3>
          <p>맑은 밤하늘 아래에서 전문가와 함께 별자리를 찾고 우주의 신비를 탐험해보세요.</p>
          <p className="text-sm text-gray-600 mt-1">맑은 날 밤 9시 / 소요시간 1시간 30분</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold">해변 요가</h3>
          <p>파도 소리를 들으며 해변에서 진행되는 요가 클래스로 심신의 안정을 찾아보세요.</p>
          <p className="text-sm text-gray-600 mt-1">매일 일출 시간 / 소요시간 1시간</p>
        </div>
      </section>

      {/* Reservation Info */}
      <section className="mt-16 space-y-4">
        <h3 className="text-xl font-semibold">예약 안내</h3>
        <ul className="list-disc pl-5">
          <li>모든 프로그램은 최소 1일 전 예약이 필요합니다.</li>
          <li>프로그램별 최소 인원(2명) 미달 시 취소될 수 있습니다.</li>
          <li>우천 시 일부 프로그램은 실내 활동으로 대체됩니다.</li>
          <li>예약 및 문의: 프론트 데스크 또는 객실 내 전화로 문의해 주세요.</li>
        </ul>
      </section>
    </main>
  );
};
