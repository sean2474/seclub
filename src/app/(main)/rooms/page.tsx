import Image from "next/image";
import { roomData } from "@/const/room-data";
import { Card } from "@/components/ui/card";

export default function RoomsPage() {
  return (
    <main>
      <section className="relative h-[700px] w-full">
        <Image src={"/images/room/hero.jpg"} sizes="100vw" alt={"SE클럽 객실 전경"} fill className="object-cover" />
        <div className="z-10 absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      </section>
      
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">객실 안내</h2>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-10 mx-auto w-full max-w-5xl p-1 md:p-4">
          {roomData.map((room) => (
            <Card key={room.slug} href={`/rooms/${room.slug}`} title={room.title} description={room.description} image={room.image} />
          ))}
        </div>
      </section>
    </main>
  );
}