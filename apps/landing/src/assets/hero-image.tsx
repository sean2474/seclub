"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useMediaQuery } from 'react-responsive';

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

  return (
    <>
      {currentImages.map((src, i) => (
        <div
          key={i}
          className={`
            absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${currentIndex === i ? 'opacity-100 z-0' : 'opacity-0 z-0'}
          `}
        >
          <Image
            src={src}
            alt={`hero-${i + 1}`}
            fill
            className="object-cover"
            priority={i === 0}
            quality={100}
          />
        </div>
      ))}
    </>
  );
}
