import Image from "next/image";
import { RoomGrid } from "@/assets/room-grid";

export default function RoomsPage() {
  return (
    <main>
      <section className="relative h-svh w-full">
        <Image src={"/images/room/hero.jpg"} alt={"SE클럽 객실 전경"} fill className="object-cover" />
        <div className="z-10 absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      </section>
      
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">객실 안내</h2>
        <RoomGrid />
      </section>
    </main>
  );
}