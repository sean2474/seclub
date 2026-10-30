"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';
import { getAdjacentSlideIndices } from '@/hooks/use-slider';

export default function HeroImage({ images, mbImages }: { images: string[]; mbImages: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const currentImages = isMobile ? mbImages : images;
  const visibleIndices = getAdjacentSlideIndices(currentIndex, currentImages.length);

  return (
    <>
      {visibleIndices.map((i) => (
        <div
          key={i}
          className={`
            absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${currentIndex === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}
          `}
        >
          <Image
            src={currentImages[i]}
            alt={`hero-${i + 1}`}
            fill
            sizes="100vw"
            className="object-cover"
            preload={i === currentIndex}
            quality={85}
          />
        </div>
      ))}
    </>
  );
}
