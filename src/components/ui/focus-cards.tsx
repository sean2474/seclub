"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    gridNum,
  }: {
    card: Card;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    gridNum?: number;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={card.onClick}
      className={cn(
        "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-48 md:h-96 w-full transition-all duration-300 ease-out",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]",
        card.onClick && "cursor-pointer hover:shadow-lg",
        gridNum === 2 && "h-48 md:h-96",
        gridNum === 3 && "h-48 md:h-64",
      )}
    >
      <Image
        src={card.src}
        alt={card.title}
        className="object-cover absolute inset-0"
        fill
      />
      <div
        className={cn(
          "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )} 
      />
      <div className={cn(
        "absolute flex items-center justify-center transition-all duration-300 ease-out p-4 rounded-lg",
        hovered === index ? "bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2" : "bottom-4 left-4 bg-black/50"
      )}>
        <div className="flex flex-col">  
          <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
            {card.title}
          </div>
          {card.description && (
            <div className="text-sm md:text-base text-gray-300 mt-1">
              {card.description}
            </div>
          )}
        </div>
      </div>
    </div>
  )
);

Card.displayName = "Card";

type Card = {
  title: string;
  src: string;
  description?: string;
  onClick?: () => void;
  height?: string;
};

export function FocusCards({ cards, gridNum, className }: { cards: Card[]; gridNum?: number; className?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div 
      className={cn(
        gridNum === 2 && "grid-cols-1 md:grid-cols-2",
        gridNum === 3 && "grid-cols-2 md:grid-cols-3",
        "grid gap-4 md:gap-10 max-w-5xl mx-auto md:px-8 w-full", 
        className
      )}
    >
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
          gridNum={gridNum}
        />
      ))}
    </div>
  );
}
