'use client';

import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { cn } from '@seclub/utils';
import { useSlider } from '@/hooks/use-slider';

interface ImageSliderProps {
  images: string[];
  color?: string;
}

export function MainImageSlider({ images, color = 'default' }: ImageSliderProps) {
  const { current, setCurrent, prev, next, onTouchStart, onTouchEnd } = useSlider({
    count: images.length,
  });

  if (images.length === 0) return null;

  return (
    <div className="w-full h-full">
      <div
        className="relative overflow-hidden h-full"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, idx) => (
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
              priority={idx === 0}
            />
          </div>
        ))}

        {/* 데스크톱 컨트롤 바 */}
        <div
          className={cn(
            'absolute bottom-4 right-4 items-center px-3 py-1 hidden md:flex',
            color === 'default' ? 'text-white' : 'text-black',
          )}
        >
          <div
            className={cn(
              'relative h-1 w-24 overflow-hidden rounded-full mr-4',
              color === 'default' ? 'bg-gray-400' : 'bg-gray-200',
            )}
          >
            <div
              className={cn(
                'h-full transition-all duration-500 ease-in-out',
                color === 'default' ? 'bg-white' : 'bg-black',
              )}
              style={{ width: `${((current + 1) / images.length) * 100}%` }}
            />
          </div>

          <span className="text-sm mr-4 w-8">
            {current + 1} / {images.length}
          </span>

          <button onClick={prev} className="p-1">
            <ChevronLeftIcon
              className={cn(
                'h-8 w-8 border rounded-full p-2 mr-2 hover:text-primary transition-colors duration-300',
                color === 'default'
                  ? 'hover:bg-white hover:text-black border-white'
                  : 'hover:bg-black hover:text-white border-black',
              )}
            />
          </button>
          <button onClick={next} className="p-1">
            <ChevronRightIcon
              className={cn(
                'h-8 w-8 border rounded-full p-2 transition-colors duration-300',
                color === 'default'
                  ? 'hover:bg-white hover:text-black border-white'
                  : 'hover:bg-black hover:text-white border-black',
              )}
            />
          </button>
        </div>

        {/* 모바일 슬라이드 카운트 */}
        <div className="w-full center absolute bottom-4 md:hidden">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={cn(
                'w-2 h-2 rounded-full mx-1',
                idx === current
                  ? color === 'default'
                    ? 'bg-white'
                    : 'bg-black'
                  : 'bg-gray-400',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
