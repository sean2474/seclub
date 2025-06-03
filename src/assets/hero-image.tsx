"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroImage() {
  const images = [
    '/images/hero-1.jpeg',
    '/images/hero-2.jpeg',
    '/images/hero-3.jpeg',
    '/images/hero-4.jpeg',
    '/images/hero-5.jpeg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // 5초마다 다음 이미지로 전환

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {images.map((src, i) => (
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
          />
        </div>
      ))}
    </>
  );
}
