'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';

interface ImageSliderProps {
  imgs: string[];
}

export function MainImageSlider({
  imgs,
}: ImageSliderProps) {
  const [current, setCurrent] = useState(0);

  // Touch positions for swipe
  const touchStartX = useRef<number | null>(null);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + imgs.length) % imgs.length);
  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % imgs.length);

  // Handlers for touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    // Minimum swipe distance threshold
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left → next slide
        nextSlide();
      } else {
        // Swiped right → previous slide
        prevSlide();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="w-full h-full">
      {/* 이미지 영역 */}
      <div
        className="relative overflow-hidden h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {imgs.map((img, idx) => (
          <div
            key={idx}
            className={`
              absolute inset-0 mb-16 md:mb-20
              transition-opacity duration-1000 ease-in-out
              ${idx === current ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <Image
              src={img}
              alt={idx.toString()}
              fill
              className="object-cover"
              priority={idx === current}
            />
          </div>
        ))}

        {/* 데스크톱 컨트롤 바 */}
        <div className="absolute bottom-4 right-4 items-center px-3 py-1 hidden md:flex">
          {/* 진행바 */}
          <div className="relative h-1 w-24 bg-gray-400 overflow-hidden rounded-full mr-4">
            <div
              className="h-full bg-white"
              style={{
                width: `${((current + 1) / imgs.length) * 100}%`,
              }}
            />
          </div>

          {/* 슬라이드 카운트 */}
          <span className="text-white text-sm mr-4 w-8">
            {current + 1} / {imgs.length}
          </span>

          {/* 이전/다음 */}
          <button onClick={prevSlide} className="p-1">
            <ChevronLeftIcon className="h-8 w-8 text-white border rounded-full p-2 mr-2 hover:bg-white hover:text-primary transition-colors duration-300" />
          </button>
          <button onClick={nextSlide} className="p-1">
            <ChevronRightIcon className="h-8 w-8 text-white border border-white rounded-full p-2 hover:bg-white hover:text-primary transition-colors duration-300" />
          </button>
        </div>

        {/* 모바일 슬라이트 카운트 */}
        <div className="w-full center absolute bottom-4 md:hidden">
          {imgs.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full mx-1 ${
                idx === current ? 'bg-white' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
        
      </div>
    </div>
  );
}
