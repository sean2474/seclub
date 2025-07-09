import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageSlider } from "@/components/ui/image-slider";
import { roomData } from "@/const/room-data";
import { BedDouble, Car, Clock, Dog, User2, Users } from "lucide-react";
import Image from "next/image"

export const PoolVilla = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="fixed -z-10 h-[500px] top-0 md:h-svh w-full">
        <Image
          src="/images/room/pool-villa/hero.jpg"
          alt="Pool Villa Hero Image"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className="text-white font-mono font-light text-xl">
            101-106 객채
          </div>
          <h1 className="text-white font-mono font-light text-7xl mt-8">
            海水 <span className="font-pretendard font-thin">풀빌라</span>
          </h1>
        </div>
      </section>
      <main className="mx-auto">
        <section className="space-y-8 pt-16 center relative mt-[100svh] bg-background">
          <div className="text-end space-y-4 flex justify-between items-center max-w-6xl p-5">
            <h2 className="text-5xl font-serif">Overview</h2>
            <p className="text-xl">각 독채별로 <span className="text-green-900 font-semibold">프라이빗 가든</span>과 <span className="text-green-900 font-semibold">풀·스파</span>가 완비되어 있어 외부 방해 없이 온전한 휴식을 취할 수 있습니다. 3동과 6동은 직영으로 운영되어 더욱 <span className="text-green-900 font-semibold">깐깐한 </span>관리가 이루어지며, 평일과 주말 모두 <span className="text-green-900 font-semibold">장기 숙박</span>이 가능합니다.</p>
          </div>
          {/* <div className="absolute z-10 -bottom-1/8 left-0 w-full h-1/4 bg-gradient-to-b from-background to-beige pointer-events-none" /> */}
        </section>
        <section className="bg-background center w-full relative pb-28">
          {/* <div className="center flex-col">
            <h3 className="text-5xl font-serif">Private Pool</h3>
            <h4 className="text-2xl mt-2">SECLUB</h4>
          </div> */}
          <div className="absolute h-[500px] bottom-0 w-full bg-green-900" />
          <div className="w-full max-w-6xl p-5">
            <div className="relative w-full h-[700px]">
              <Image
                src="/images/room/pool-villa/pool.jpg"
                alt="전용 해수 풀장 이미지"
                fill
                className="w-full h-auto object-cover"
              />
            </div>
            {/* <div className="mt-4 ml-3 flex flex-col gap-0.5">
              <div><strong>크기:</strong> 4.5 × 2.5 × 0.9 m (바닷물 사용)</div>
              <div><strong>이용 기간:</strong> 7월 ~ 8월 (2024.06.14 ~ 09.08)</div>
              <div><strong>수위:</strong> 0.75 m 이하 (체크인 시 물 교체)</div>
              <div><strong>안전 수칙:</strong> 어린이는 안전 장비 착용, 다이빙·점프·뜀박질 금지</div>
            </div> */}
          </div>
        </section>
        <section className="bg-beige center py-32 grid grid-cols-2 relative text-black">
          <div className="center flex-col">
            <h3 className="text-5xl font-serif">Amenities</h3>
            <h4 className="text-2xl mt-2">SECLUB</h4>
          </div>
          <div className="pr-48">
            <ImageSlider slides={[{
              img: "/images/room/pool-villa/grill.jpg",
              title: "바비큐 그릴",
              description: "개별 바비큐 그릴 (숯·번개탄·장갑 등 무료 제공)",
            }, {
              img: "/images/room/pool-villa/kitchen.jpg",
              title: "주방",
              description: "개별 주방 (냉장고, 전자레인지, 전기밥솥, 커피포트 등)",
            }, {
              img: "/images/room/pool-villa/spa.jpg",
              title: "월풀 스파",
              description: "월풀 스파 (입욕제 사용 불가, 2회 사용 후 4시간 대기)",
            }]} />
          </div>
        </section>
        <section className="bg-background py-16">
          <div className="flex justify-between items-start max-w-6xl p-5 m-auto">
            <div className="center flex-col w-1/5">
              <BedDouble size={40} strokeWidth={1} />
              <div>침대 개수</div>
              <strong>2개</strong>
            </div>
            <div className="w-[1px] h-12 bg-gray-400/50 self-center" />
            <div className="center flex-col w-1/5">
              <Users size={40} strokeWidth={1} />
              <div>인원</div>
              <strong>4~6인</strong>
            </div>
            <div className="w-[1px] h-12 bg-gray-400/50 self-center" />
            <div className="center flex-col w-1/5">
              <Dog size={40} strokeWidth={1} />
              <div>반려견 동반</div>
              <strong>최대 2마리</strong>
            </div>
            <div className="w-[1px] h-12 bg-gray-400/50 self-center" />
            <div className="center flex-col w-1/5">
              <Car size={40} strokeWidth={1} />
              <div>차량 주차</div>
              <strong>독채당 1대 무료</strong>
            </div>
            <div className="w-[1px] h-12 bg-gray-400/50 self-center" />
            <div className="center flex-col w-1/5">
              <Clock size={40} strokeWidth={1} />
              <div>체크인/아웃</div>
              <strong>15:00 / 11:00</strong>
            </div>
          </div>
          <div className="center mt-10">
            <Button variant={"primary"} size={"xl"} className="text-white">예약하기</Button>
          </div>
        </section>
        <section>
          <div className="bg-background w-full">
            <div className="max-w-6xl pb-16 mx-auto border-b border-gray-400/50">
              <h2>
                추가 정보
              </h2>
              <ol className="border border-gray-400/50 p-5 mt-5 space-y-4 list-decimal pl-10">
                <li className="space-y-2">
                  <div className="font-medium">추가 요금 안내</div>
                  <ul className="space-y-1">
                    <li> - 최대 인원(4인)을 초과하여 투숙 시 1인당 20,000원의 추가 요금이 부과됩니다.</li>
                    <li> - 반려견은 1마리당 10,000원이며, 최대 2마리까지 입실 가능합니다. (맹견·중대형견은 출입이 제한됩니다.)</li>
                    <li> - 주차는 독채당 1대 무료 제공되며, 추가 1대부터 1박당 10,000원이 청구됩니다.</li>
                  </ul>
                </li>
                <li className="space-y-2">
                  <div className="font-medium">체크인·체크아웃 &amp; 요금 안내</div>
                  <ul className="space-y-1">
                    <li> - 요금(비수기/성수기)은 웹사이트 요금표를 참고해 주세요.</li>
                    <li> - 얼리 체크인: 오후 3시 이전 체크인 시 20,000원 추가</li>
                    <li> - 레이트 체크아웃: 3시간 연장 시 55,000원, 6시간 연장 시 70,000원</li>
                    <li> - 기본 체크인 오후 3시, 체크아웃 오전 11시입니다.</li>
                  </ul>
                </li>
                <li className="space-y-2">
                  <div className="font-medium">시설 이용 안내</div>
                  <ul className="space-y-1">
                    <li> - 정부의 ‘일회용품 사용 자제’ 시책에 따라 치약·칫솔 등 욕실용품은 제공되지 않으니 개인 준비를 부탁드립니다.</li>
                    <li> - 스파 설비 고장 위험으로 인해 입욕제 사용은 불가합니다.</li>
                    <li> - 전기 온수 탱크 특성상, 연속 2회 사용 후에는 최소 4시간의 재충전 시간이 필요합니다.</li>
                    <li> - 수영장 이용 시 어린이는 반드시 구명조끼 등 안전 장구를 착용하고 보호자와 함께 이용해 주시기 바라며, 다이빙·점프·뜀박질 등 위험 행위는 절대 금지됩니다.</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </section>
        <section className="bg-background py-12">
          <div className="max-w-6xl mx-auto">
            <h2>다른 객실 추천</h2>
            <div className="grid grid-cols-3 gap-5 mt-10">
              {roomData.map((room) => (
                room.slug !== "pool-villa" && <Card href={`/rooms/${room.slug}`} title={room.title} description={room.description} image={room.image} key={room.slug} />
              ))}
            </div>
            <div className="center pt-10">
              <Button variant={"outline"} size={"xl"} className="">객실 목록</Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};