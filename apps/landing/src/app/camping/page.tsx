"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Ban } from "lucide-react"
import Link from "next/link"
import { Modal, ModalBody, ModalTrigger } from "@/components/ui/animated-modal"
import { ScrollReveal } from "@/components/base/scroll-reveal"
import { siteCategories, siteData } from "@/const/camping-data"

export default function SeclubElegantGuidePage() {
  const [activeCategory, setActiveCategory] = useState("S")
  const [openedSite, setOpenedSite] = useState<string | null>(null)

  const filteredSites =
    activeCategory === "All"
      ? siteData
      : siteData.filter(
          (site) => site.id === activeCategory || (activeCategory === "반려견" && site.id === "반려견 캠핑장"),
        )

  return (
    <div className="min-h-screen font-sans overflow-x-hidden">
      <section className="fixed -z-10 top-0 h-svh w-full">
        <Image src={"/images/landing/hero-4.jpeg"} sizes="100vw" alt={"SE클럽 객실 전경"} fill className="object-cover" />
        <div className="z-10 absolute w-full h-full top-0 left-0 bg-black/30" />
        <div className="z-10 absolute top-1/2 left-1/2 md:left-20 lg:left-1/4 transform -translate-x-1/2 md:-translate-x-0 lg:-translate-x-1/2 -translate-y-1/2 text-background whitespace-nowrap">
          <ScrollReveal side="top" type="h1"> SE클럽 캠핑 사이트 </ScrollReveal>
          <ScrollReveal side="bottom" type="p" className="text-xl md:text-2xl mt-4"> 아름다운 경관과 함께하는 힐링 </ScrollReveal>
        </div>
      </section>
      <main className="">
        <div className="h-svh" />
        <Modal>
          <section id="sites" className="px-2 md:px-6 pb-12 pt-4 md:pt-8 bg-background">
            <div className="flex justify-between items-end mb-8">
              <h2 className="font-serif text-3xl md:text-4xl">Site Information</h2>
            </div>

            <div className="flex space-x-2 mb-8 pb-2 -mx-8 px-8 flex-wrap gap-y-2">
              {siteCategories.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors duration-200 whitespace-nowrap ${
                    activeCategory === category
                      ? "bg-stone-800 text-white hover:bg-stone-700"
                      : "bg-white text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {category === "반려견" ? "반려견 전용" : category}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredSites.map((site) => (
                <div key={site.id} className="group relative">
                  <div className="overflow-hidden mb-4">
                    <Image
                      src={site.image}
                      alt={site.title}
                      width={600}
                      height={700}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-2xl">{site.title}</h3>
                  <p className="mt-1 mb-3">{site.features.join(" · ")}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {site.allowed &&
                      site.allowed.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full"
                        >
                          <Check className="w-3 h-3" /> {item}
                        </div>
                      ))}
                    {site.disallowed &&
                      site.disallowed.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full"
                        >
                          <Ban className="w-3 h-3" /> {item}
                        </div>
                      ))}
                  </div>
                  <ModalTrigger className="mt-4 justify-start h-auto flex items-center cursor-pointer" onClick={() => setOpenedSite(site.id)}>
                    사이트 및 주차 배치도 보기 <ArrowRight className="w-4 h-4 ml-2" />
                  </ModalTrigger>
                </div>
              ))}
            </div>
            <ModalBody>
              <Image src={"/images/site/map/" + openedSite + " site.png"} alt={openedSite || ""} width={800} height={600} />
            </ModalBody>
          </section>
        </Modal>
        <Modal>
          <section id="overview" className="bg-beige px-8 md:px-12 pb-16 md:pb-20 pt-12">
            <ScrollReveal type="h2" side="left" className="text-3xl md:text-4xl mb-8 font-serif">Overview & Packages</ScrollReveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ScrollReveal side="left" delay="100ms" className="relative group overflow-hidden text-white cursor-pointer">
                <ModalTrigger className="w-full h-full">
                  <Image
                    src="/images/wellness/store/hero.jpg"
                    alt="공용 수영장"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute top-0 left-0 h-full w-full p-6 pt-8 text-start">
                    <h3 className="text-2xl mb-4">공통 편의시설</h3>
                    <p className=" mb-4">
                      모든 사이트에서 전기(3kW), 냉·온수, Wi-Fi를 자유롭게 이용하실 수 있습니다. 샤워장, 개수대 등
                      공용시설이 완비되어 있습니다.
                    </p>
                  </div>
                  <div className="justify-start h-auto flex items-center absolute bottom-0 right-0 p-6">
                    이용안내 자세히 보기 <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </ModalTrigger>
              </ScrollReveal>
              <ModalBody>
                <main className="px-0 md:px-12 overflow-y-auto">
                  <div className="max-w-4xl mx-auto p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                      <div className="space-y-6">
                        <h2 className="text-2xl border-b border-stone-200 pb-3">체크인 · 체크아웃</h2>
                        <div>
                          <h3 className="text-xl mb-2">시간 안내</h3>
                          <p className="text-lg">체크인: 오후 2시 이후</p>
                          <p className="text-lg">체크아웃: 낮 12시 이전</p>
                          <p className="text-sm mt-2">
                            * 전일 예약 없을 시 얼리 체크인 가능 (문의 필요)
                            <br />* 레이트 체크아웃은 별도 옵션으로 운영됩니다.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl mb-2">입 · 퇴장 절차</h3>
                          <ol className="list-decimal list-inside space-y-1">
                            <li>관리동에서 고객안내 및 체크인</li>
                            <li>쓰레기봉투 수령 및 위치 확인</li>
                            <li>퇴장 전 쓰레기 분리배출</li>
                            <li>깔판 및 대여용품 정돈</li>
                          </ol>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h2 className="text-2xl border-b border-stone-200 pb-3">편의시설 및 서비스</h2>
                        <div>
                          <h3 className="text-xl mb-2">공용 시설</h3>
                          <ul className="list-disc list-inside">
                            <li>샤워장 · 탈의실 (4개소)</li>
                            <li>개수대 · 화장실 (5개소)</li>
                            <li>공용 수영장 (시즌 운영)</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xl mb-2">주차 안내</h3>
                          <p className="text-base">
                            사이트별 지정 위치에 주차해야 합니다. 대부분 사이트 내 직접 주차가 가능하나, 일부 사이트는 짐을 내린
                            후 지정 장소로 이동해야 합니다.
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xl mb-2">인터넷</h3>
                          <p className="text-base">
                            네트워크: SECLUB_1 / 2 / 3
                            <br />
                            비밀번호: 12345678
                          </p>
                        </div>
                      </div>

                      <div className="md:col-span-2 border-t border-stone-200 pt-8 mt-4">
                        <h2 className="text-2xl mb-4">비상 연락처</h2>
                        <div className="flex flex-col md:flex-row md:gap-8">
                          <p>
                            <strong>관리실 (현장 문의):</strong> 010-6343-1711
                          </p>
                          <p>
                            <strong>예약 담당:</strong> 010-9703-1711
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>      
              </ModalBody>
              <ScrollReveal side="left" delay="200ms" className="overflow-hidden">
                <Link href="/wellness/camping-pool" className="relative group overflow-hidden">
                  <Image
                    src="/images/wellness/swimming-pool/1.jpg"
                    alt="공용 수영장"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl text-white">#여름시즌 #공용수영장</h3>
                    <p className="text-white/90 mt-1">운영: 6/14 ~ 9/8</p>
                  </div>
                  <div className="justify-start h-auto flex items-center absolute bottom-0 right-0 p-6 text-white">
                    자세히 보기 <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              </ScrollReveal>
              <ScrollReveal side="left" delay="300ms" className="overflow-hidden">
                <Link href="/wellness/walk" className="relative group overflow-hidden">
                  <Image
                    src="/images/wellness/walk/hero.jpg"
                    alt="바다 체험"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl text-white">#바다체험 #독살체험</h3>
                    <p className="text-white/90 mt-1">생태체험 및 바다낚시</p>
                  </div>
                  <div className="justify-start h-auto flex items-center absolute bottom-0 right-0 p-6 text-white">
                    자세히 보기 <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </section>
        </Modal>
      </main>
    </div>
  )
}
