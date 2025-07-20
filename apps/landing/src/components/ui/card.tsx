import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CardData } from "@/types";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface CardProps extends CardData {
  className?: string;
}

export const Card = ({ items, title, description, image, className }: CardProps) => {
  return (
    <div className={cn("overflow-hidden rounded-lg bg-white/50", className)}> 
      <div className="relative h-[350px] md:h-[300px] w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4 flex justify-between items-center">
        <div className="flex flex-col gap-1 md:gap-2">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          <p className="text-sm md:text-base">{description}</p>
        </div>
        <div className="flex gap-2 flex-col items-end">
          {items.map((item, idx) => (
            <Link key={idx} href={item.href} className="flex items-center gap-2 hover:scale-105 active:translate-x-2 active:scale-105 transition-all duration-300 ease-in-out">{item.title} <ChevronRightIcon className="w-4 h-4" /></Link>
          ))}
        </div>
      </div>
    </div>
  );
}