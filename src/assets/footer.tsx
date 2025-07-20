import { Arrow } from "@/components/icon/arrow"
import Image from "next/image"

export const Footer = () => {
  return (
    <footer className="p-4 md:p-10 bg-[#111] text-white relative">
      {/* <div className="z-10 absolute -top-32 left-0 w-full h-32 bg-gradient-to-b from-transparent to-background pointer-events-none" /> */}
      <div className="flex flex-col items-center md:flex-row md:items-start justify-between h-full mt-8 gap-2">
        <div className="order-2 md:order-1 w-full md:w-auto mt-5 md:mt-0 text-xs md:text-sm">
          <div className="ml-1">
            주소 <b className="ml-2">충청남도 태안군 이원면 내리 503 - 8 번지</b>
          </div>
          <div className="mt-2 ml-1">
            문의 <b className="ml-2">010-9703-1711, 010-4668-1704</b>
          </div>
          <div className="flex flex-col mt-4 gap-2 py-4">
            <div>
              <div className="font-bold mb-1">SE클럽(태안둘레길캠핑장)</div>
              <div className="ml-2">대표자 : 정상은 외 2인</div>
              <div className="ml-2">사업자번호 : 362-13-00683</div>
              <div className="ml-2">통신판매번호 : 제 2017-충남태안-0105 호</div>
            </div>
            <div>
              <div className="font-bold mb-1">에스이(SE)클럽 관광농원</div>
              <div className="ml-2">대표자 : 정상은</div>
              <div className="ml-2">사업자번호 : 272-29-00682</div>
              <div className="ml-2">통신판매번호 : 제 2022-충남태안-0058 호</div>
            </div>
            <div>
              <div className="font-bold mb-1">담은</div>
              <div className="ml-2">대표자 : 정재원</div>
              <div className="ml-2">사업자번호 : 316-04-46248</div>
              <div className="ml-2">통신판매번호 : 제 2022-충남태안-0061 호</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center order-1 md:order-2">
          <div className="w-full max-w-[500px] md:max-w-[320px] text-7xl font-medium">
            SECLUB
          </div>
          <div className="hidden md:block md:text-lg lg:text-xl mt-5">
            &copy; {new Date().getFullYear()} SECLUB. All rights reserved.
          </div>
        </div>
        <div className="flex flex-col gap-5 relative z-20 justify-start w-full md:w-auto md:h-1/2 mt-1 order-3 text-sm md:text-base">
          <div className="flex items-center justify-start md:justify-end gap-2 cursor-pointer group">찾아오시는 길 <Arrow side="right" size={5} /> </div>
          <div className="flex items-center justify-start md:justify-end gap-2 cursor-pointer group">이용안내 <Arrow side="right" size={5} /> </div>
          <div className="flex items-center justify-start md:justify-end gap-2 cursor-pointer group">예약안내 <Arrow side="right" size={5} /> </div>
          <div className="flex items-center justify-start md:justify-end gap-2 cursor-pointer group">개인정보처리방침 <Arrow side="right" size={5} /> </div>
          <div className="mt-3 md:mt-10">
            <div className="flex gap-4 h-10">
              <div className="bg-background/50 rounded-full size-6 center">
                <Image src="/icons/instagram.png" alt="logo" width={16} height={16} className="cursor-pointer aspect-square hover:scale-110 transition-all duration-500"/>
              </div>
              <div className="bg-background/50 rounded-full size-6 center">
                <Image src="/icons/kakao.svg" alt="logo" width={16} height={16} className="cursor-pointer aspect-square hover:scale-110 transition-all duration-500"/>
              </div>
              <div className="bg-background/50 rounded-full size-6 center">
                <Image src="/icons/youtube.png" alt="logo" width={16} height={16} className="cursor-pointer aspect-square hover:scale-110 transition-all duration-500"/>
              </div>
              <div className="bg-background/50 rounded-full size-6 center">
                <Image src="/icons/twitter.avif" alt="logo" width={16} height={16} className="cursor-pointer aspect-square rounded hover:scale-110 transition-all duration-500"/>
              </div>
            </div>
          </div>
          <div className="md:hidden text-xs mb-10">
            &copy; {new Date().getFullYear()} SECLUB. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}