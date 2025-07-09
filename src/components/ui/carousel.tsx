'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * SlideLink represents a link under each carousel item.
 */
export type SlideLink = {
  label: string;
  href: string;
};

/**
 * CarouselSlide defines the content of one slide.
 */
export type CarouselSlide = {
  image: string;
  title: string;
  subtitle: string;
  links: SlideLink[];
};

interface RoomCarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

/**
 * RoomCarousel displays a horizontal sliding carousel of room categories.
 */
export default function RoomCarousel({
  slides,
  autoPlay = true,
  autoPlayInterval = 5000,
}: RoomCarouselProps) {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    if (autoPlay) {
      resetTimeout();
      timeoutRef.current = setTimeout(
        () => setCurrent((prevIndex) => (prevIndex + 1) % slides.length),
        autoPlayInterval
      );
      return resetTimeout;
    }
  }, [current, autoPlay, autoPlayInterval, slides.length]);

  const goNext = () => {
    resetTimeout();
    setCurrent((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goPrev = () => {
    resetTimeout();
    setCurrent((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="relative min-w-full h-72 md:h-96">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/30" />
            {/* Content overlay */}
            <div className="absolute inset-0 px-6 md:px-12 flex flex-col justify-center text-white">
              <h2 className="text-2xl md:text-4xl font-semibold">
                {slide.title}
              </h2>
              <p className="mt-1 text-sm md:text-lg">
                {slide.subtitle}
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                {slide.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="text-sm md:text-base underline hover:text-gray-200"
                  >
                    {link.label} &rarr;
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation buttons */}
      <button
        onClick={goPrev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 hover:bg-white"
      >
        <ArrowLeft size={20} />
      </button>
      <button
        onClick={goNext}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 hover:bg-white"
      >
        <ArrowRight size={20} />
      </button>
    </div>
  );
}

/**
 * Usage example (e.g. in rooms/page.tsx):
 *
 * import RoomCarousel, { CarouselSlide } from '@/components/RoomCarousel';
 *
 * const slides: CarouselSlide[] = [
 *   {
 *     image: '/images/rooms/suite.jpg',
 *     title: 'Suite',
 *     subtitle: '스위트',
 *     links: [
 *       { label: '디럭스 스위트 룸', href: '/rooms/suite/deluxe' },
 *       { label: '프리미어 스위트 룸', href: '/rooms/suite/premier' },
 *       // ...etc
 *     ],
 *   },
 *   // other categories: SIGNIEL Premier, Premier, Grand Deluxe...
 * ];
 *
 * export default function RoomsPage() {
 *   return (
 *     <main>
 *       <section className="py-16 px-4 text-center">
 *         <h1 className="text-4xl font-bold">Room & Suites</h1>
 *         <p className="mt-2 text-gray-600">
 *           환상적인 서울 도심의 파노라마뷰와 모던한 인테리어의 객실은 최상의 휴식을 제공합니다.
 *         </p>
 *       </section>
 *       <RoomCarousel slides={slides} autoPlay />
 *     </main>
 *   );
 * }
 */
