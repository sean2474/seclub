"use client";

import { useState } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import Image from "next/image";

import { cn } from "@seclub/utils";
import { useMediaQuery } from "react-responsive";

export const BlurryImage = ({ src, alt }: { src: string; alt?: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-[3/2] overflow-hidden rounded-lg">
      <Image
        src={src}
        alt={alt ?? ""}
        fill
        quality={50}
        className={cn(
          "object-cover object-left-top transition-all duration-700 ease-out bg-gray-200",
          loaded
            ? "filter blur-0 scale-100"
            : "filter blur-sm scale-110"
        )}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export const ParallaxScroll = ({
  images,
  className,
  repeat = 1,
}: {
  images: string[];
  className?: string;
  /** Render the images list `repeat` times to fill the scroll surface. */
  repeat?: number;
}) => {
  const { scrollYProgress } = useScroll();

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const expanded = repeat > 1
    ? Array.from({ length: repeat }, () => images).flat()
    : images;

  const third = Math.floor(expanded.length / 3);
  const half = Math.floor(expanded.length / 2);
  const firstPart = isMobile ? expanded.slice(0, half) : expanded.slice(0, third);
  const secondPart = isMobile
    ? expanded.slice(half, expanded.length)
    : expanded.slice(third, 2 * third);
  const thirdPart = isMobile ? [] : expanded.slice(2 * third);

  return (
    <div className={cn("overflow-y-auto w-full", className)}>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-10 py-20 md:py-40 px-2 md:px-10 max-w-7xl mx-auto">
        {/* 1st column */}
        <div className="grid gap-2 md:gap-10">
          {firstPart.map((src, idx) => (
            <motion.div
              key={`col1-${idx}`}
              style={{ y: translateFirst }}
              className="w-full"
            >
              <BlurryImage src={src} alt={`image ${idx + 1}`} />
            </motion.div>
          ))}
        </div>

        {/* 2nd column */}
        <div className="grid gap-2 md:gap-10">
          {secondPart.map((src, idx) => (
            <motion.div
              key={`col2-${idx}`}
              style={{ y: translateSecond }}
              className="w-full"
            >
              <BlurryImage src={src} alt={`image ${idx + 1 + third}`} />
            </motion.div>
          ))}
        </div>

        {/* 3rd column */}
        <div className="grid gap-2 md:gap-10">
          {thirdPart.map((src, idx) => (
            <motion.div
              key={`col3-${idx}`}
              style={{ y: translateThird }}
              className="w-full"
            >
              <BlurryImage src={src} alt={`image ${idx + 1 + 2 * third}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
