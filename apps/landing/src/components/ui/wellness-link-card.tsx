import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { WellnessCardProps } from "@/types";

interface CardProps extends WellnessCardProps {
  className?: string;
}

export const WellnessLinkCard = ({ title, type, location, hours, image, slug, className }: CardProps) => {
  return (
    <Link href={`/wellness/${slug}`} className={cn("overflow-hidden rounded-lg bg-white/50 group", className)}> 
      <div className="relative h-[250px] sm:h-[350px] md:h-[300px] w-full overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-110 transition-all duration-300" />
      </div>
      <div className="p-4 flex justify-start items-start flex-col">
        <div className="flex flex-col md:gap-1">
          <p className="text-sm md:text-base ml-0.5">{type}</p>
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        </div>
        <div className="flex sm:gap-2 flex-col items-start mt-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="font-light text-foreground/80">위치</div>
            <div className="h-4 w-px bg-foreground/30" />
            <div className="font-light text-foreground">{location}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-light text-foreground/80">운영시간</div>
            <div className="h-4 w-px bg-foreground/30" />
            <div className="font-light text-foreground">{hours}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}