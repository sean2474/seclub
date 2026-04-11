import Link from "next/link";
import Image from "next/image";
import { RoomCardProps } from "@/types";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "./button";
import { LinkEventTracker } from "../base/link-event-tracker";
import { VILLA_URL } from "@/const/urls";

interface CardProps extends RoomCardProps {
  className?: string;
}

export const RoomsLinkCard = ({slug, title, subtitle, images, features}: CardProps) => {
  return (
    <div className="w-full grid gap-4 grid-cols-1 md:grid-cols-[40%_60%]">
      <div className="relative aspect-video md:aspect-auto md:h-full w-full">
        <Image src={images[0]} alt={subtitle} fill className="object-cover" />
      </div>
      <div className="p-3 relative">
        <p className="mb-2">{subtitle}</p>
        <Link className="text-2xl md:text-3xl font-medium flex items-center mb-4" href={`/rooms/${slug}`}>
          {title}<ChevronRightIcon className="w-6 h-6" />
        </Link>
        <div className="flex flex-col gap-1 text-xs">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <p className="font-light text-foreground/80">{feature.label}</p>
              <div className="h-4 w-px bg-foreground/30" />
              <p className="font-light text-foreground">{feature.value}</p>
            </div>
          ))}
        </div>
        <LinkEventTracker 
          eventName={`reservation_room_list_${slug}`} 
          location={`room-link-card_${slug}_reservation_btn`} 
          href={VILLA_URL}
          target="_blank"
        >
          <Button className="mt-4 md:absolute md:bottom-3 md:right-3 text-white" size={"lg"} variant="primary">예약하기</Button>
        </LinkEventTracker>
      </div>
    </div>
  );
}