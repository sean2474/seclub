import Link from "next/link";
import Image from "next/image";

interface CardProps {
  href: string;
  title: string;
  description: string;
  image: string;
}

export const Card = ({ href, title, description, image }: CardProps) => {
  return (
    <Link href={href} className="overflow-hidden rounded-lg bg-white/50"> 
      <div className="relative h-[150px] md:h-[300px] w-full">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="p-4 flex flex-col gap-1 md:gap-2 my-1 md:my-4 center text-center">
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <p className="text-sm md:text-base">{description}</p>
      </div>
    </Link>
  );
}