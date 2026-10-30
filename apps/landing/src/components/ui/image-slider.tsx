'use client';

import Image from 'next/image';
import {
  PlayIcon,
  PauseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid';
import Link from 'next/link';
import { getAdjacentSlideIndices, useSlider } from '@/hooks/use-slider';

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
  const {
    current,
    isPlaying,
    togglePlaying,
    prev,
    next,
    onTouchStart,
    onTouchEnd,
  } = useSlider({ count: slides.length, autoPlay, autoPlayInterval });

  if (slides.length === 0) return null;
  const active = slides[current];
  const visibleIndices = getAdjacentSlideIndices(current, slides.length);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className="relative overflow-hidden h-[350px] sm:w-[400px] md:w-full mx-auto"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {visibleIndices.map((idx) => {
          const slide = slides[idx];
          return (
          <div
            key={idx}
            className={`
              absolute inset-0
              transition-opacity duration-1000 ease-in-out md:flex
              ${idx === current ? 'z-10 opacity-100' : 'z-0 opacity-0'}
            `}
          >
            <Image
              src={slide.img}
              alt={slide.title}
              fill
              sizes="(max-width: 640px) 400px, (max-width: 1024px) 50vw, 448px"
              quality={82}
              className="object-cover"
            />
          </div>
          );
        })}

        <div className="absolute bottom-4 right-4 z-20 flex items-center px-3 py-1">
          <div className="relative h-1 w-24 bg-gray-400 overflow-hidden rounded-full mr-4">
            <div
              className="h-full bg-white"
              style={{ width: `${((current + 1) / slides.length) * 100}%` }}
            />
          </div>

          <span className="text-white text-sm mr-4 w-8">
            {current + 1} / {slides.length}
          </span>

          <button onClick={prev} className="p-1 hidden md:block">
            <ChevronLeftIcon className="h-4 w-4 text-white" />
          </button>
          <button onClick={togglePlaying} className="p-1">
            {isPlaying ? (
              <PauseIcon className="h-4 w-4 text-white" />
            ) : (
              <PlayIcon className="h-4 w-4 text-white" />
            )}
          </button>
          <button onClick={next} className="p-1 hidden md:block">
            <ChevronRightIcon className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <div className="mt-6 ml-2 flex flex-col md:flex-row items-start sm:items-center md:items-start gap-1 md:gap-5">
        <h3 className="text-lg font-semibold text-nowrap">{active.title}</h3>
        <p className="mt-2 text-sm -translate-y-1/8">{active.description}</p>
      </div>
      {active.href && (
        <Link
          href={active.href}
          className="mt-6 flex items-center justify-start ml-2 text-sm"
        >
          자세히 보기 <ChevronRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
