import Image from "next/image";
import { WellnessGrid } from "@/assets/wellness-grid";

export default function Page() {
  return (
    <main>
      <section className="relative h-svh w-full">
        <Image src={"/images/wellness/hero.jpg"} sizes="100vw" alt={"SE클럽 객실 전경"} fill className="object-cover" />
        {/* <div className="z-10 absolute bottom-0 left-0 w-full h-1/8 bg-gradient-to-b from-transparent from-75% to-background pointer-events-none" /> */}
        <div className="z-10 absolute top-1/2 left-1/2 md:left-1/4 transform -translate-x-1/2 -translate-y-1/2 text-background whitespace-nowrap">
          <h1> SE클럽 웰니스 </h1>
          <p className="text-xl md:text-2xl mt-4"> 아름다운 경관과 함께하는 힐링 </p>
        </div>
      </section>
      
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12"> OVERVIEW </h2>
        <WellnessGrid />
      </section>
    </main>
  );
}