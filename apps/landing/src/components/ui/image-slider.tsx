'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  PlayIcon,
  PauseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';

type Slide = {
  img: string;
  title: string;
  description: string;
  href?: string;
};

interface ImageSliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  autoPlayInterval?: number; // ms
}

export function ImageSlider({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
}: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Touch positions for swipe
  const touchStartX = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    if (isPlaying) {
      timeoutRef.current = setTimeout(
        () => setCurrent((prev) => (prev + 1) % slides.length),
        autoPlayInterval
      );
    }
    return resetTimeout;
  }, [current, isPlaying, autoPlayInterval, slides.length]);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % slides.length);

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
    <div className="w-full max-w-4xl mx-auto">
      {/* 이미지 영역 */}
      <div
        className="relative overflow-hidden h-[350px] sm:w-[400px] md:w-full mx-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`
              absolute inset-0
              transition-opacity duration-1000 ease-in-out md:flex
              ${idx === current ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <Image
              src={slide.img}
              alt={slide.title}
              fill
              className="object-cover"
              priority={idx === current}
            />
          </div>
        ))}

        {/* 컨트롤 바 */}
        <div className="absolute bottom-4 right-4 flex items-center px-3 py-1">
          {/* 진행바 */}
          <div className="relative h-1 w-24 bg-gray-400 overflow-hidden rounded-full mr-4">
            <div
              className="h-full bg-white"
              style={{
                width: `${((current + 1) / slides.length) * 100}%`,
              }}
            />
          </div>

          {/* 슬라이드 카운트 */}
          <span className="text-white text-sm mr-4 w-8">
            {current + 1} / {slides.length}
          </span>

          {/* 이전/다음 */}
          <button onClick={prevSlide} className="p-1 hidden md:block">
            <ChevronLeftIcon className="h-4 w-4 text-white" />
          </button>
          <button onClick={() => setIsPlaying((v) => !v)} className="p-1">
            {isPlaying ? (
              <PauseIcon className="h-4 w-4 text-white" />
            ) : (
              <PlayIcon className="h-4 w-4 text-white" />
            )}
          </button>
          <button onClick={nextSlide} className="p-1 hidden md:block">
            <ChevronRightIcon className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* 제목·설명 */}
      <div className="mt-6 ml-2 flex flex-col md:flex-row items-start sm:items-center md:items-start gap-1 md:gap-5">
        <h3 className="text-lg font-semibold text-nowrap">{slides[current].title}</h3>
        <p className="mt-2 text-sm -translate-y-1/8">
          {slides[current].description}
        </p>
      </div>
      {slides[current].href && (
        <Link
          href={slides[current].href}
          className="mt-6 flex items-center justify-start ml-2 text-sm"
        >
          자세히 보기 <ChevronRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
