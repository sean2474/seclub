"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HamburgerIcon } from "@/components/icon/hamburger";
import { PlusMinusIcon } from "@/components/icon/plusminus";
import Link from "next/link";
import { desktopMenu, menuItems, singleItems } from "@/const/header-items";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 모바일 아코디언 (열려있는 섹션)
  const [prevOpenSection, setPrevOpenSection] = useState<number | null>(null);
  const [openSection, setOpenSection] = useState<number | null>(null);
  
  const pathname = usePathname();

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 모바일 메뉴 닫힐 때 아코디언 초기화
  useEffect(() => {
    if (!mobileMenuOpen) {
      setOpenSection(null);
      setPrevOpenSection(null);
    }
  }, [mobileMenuOpen]);

  // 모바일 메뉴 열릴 때 Body 스크롤 막기
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  // 아코디언 열고/닫기
  const toggleSection = (index: number) => {
    setPrevOpenSection(openSection);
    setOpenSection(openSection === index ? null : index);
  };

  if (pathname.includes("/auth")) return <></>;
  
  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9999] px-2 lg:pr-12 transition-all duration-300 ease-in text-font backdrop-blur-md bg-white h-[var(--header-height)]
        ${!scrolled && "h-[var(--header-height-expanded)]"}
        ${
          mobileMenuOpen
            ? "h-full bg-white/80 overflow-y-scroll overflow-x-hidden"
            : "bg-white/50 delay-300 lg:delay-0"
        }
      `}
    >
      {/* -------------- 상단 네비게이션 바 -------------- */}
      <nav
        className={`flex w-full items-start mt-6 lg:h-full lg:mt-0 lg:items-center justify-between`}
        aria-label="Global"
      >
        {/* 로고 */}
        <div className="flex items-center lg:gap-32 w-full">
          <Link
            className={`
              absolute lg:relative transition-all duration-500 ease-out
              flex cursor-pointer -mt-2 z-50
              ${
                mobileMenuOpen
                  ? "left-1/2 -translate-x-2/3 scale-[2] top-[72px]"
                  : "left-4 md:left-12 translate-x-0 scale-[1] top-1.5"
              }
              ${scrolled ? "lg:top-0" : "lg:-top-1"}
            `}
            href={"/"}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative w-[100px] h-[var(--header-height)]">
              <Image
                src={`/logos/logo.png`}
                className={`transition-all duration-300 delay-100 object-contain ${
                  scrolled ? "lg:scale-100" : "lg:scale-150"
                }`}
                alt="Main Logo"
                fill
              />
            </div>
          </Link>

          {/* -------------- 데스크톱 메뉴 -------------- */}
          <div className="hidden lg:flex lg:gap-x-4 -ml-4">
            {desktopMenu.map((item, idx) =>
              item.items ? (
                // 드롭다운 (하위 items 존재)
                <div className="relative group" key={idx}>
                  <Link href={item.href || ""} className="inline-flex items-center leading-6 px-3 py-2 hover:text-primary">
                    {item.name}
                  </Link>
                  <div
                    className={`
                      absolute left-0 top-full bg-background/70 divide-y px-3 py-2 divide-foreground/15
                      shadow-lg z-50 break-keep text-foreground
                      invisible opacity-0 group-hover:visible group-hover:opacity-100
                      transition-all duration-200
                    `}
                  >
                    {item.items.map((sub, subIdx) => (
                      <Link
                        href={sub.href}
                        key={subIdx}
                        className="block px-4 py-2 text-sm text-center hover:font-extrabold transition-all"
                      >
                        {sub.name.replaceAll(" ", "\u00A0")}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                // 단일 링크
                <Link
                  href={item.href || "#"}
                  key={idx}
                  className="leading-6 px-3 py-2 hover:text-primary"
                  target={item.target}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
        </div>

        {/* -------------- 모바일 햄버거 버튼 -------------- */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 px-4 pr-6 md:pr-12"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <HamburgerIcon className="" size={0.8} open={mobileMenuOpen} />
          </button>
        </div>
      </nav>

      {/* -------------- 모바일 메뉴(슬라이드+아코디언) -------------- */}
      <div
        className={`
          transform transition-all duration-500 ease-in-out
          ${
            mobileMenuOpen
              ? "translate-y-0 opacity-100 delay-300"
              : "translate-y-32 opacity-0 select-none pointer-events-none"
          }
          lg:hidden
        `}
      >
        <nav className="h-full pt-32 pb-6 px-4">
          <div className="container mx-auto max-w-md">
            {/* 모바일 아코디언 */}
            <div className="w-full">
              {menuItems.map((section, index) => (
                <div key={index} className="border-b border-foreground">
                  <button
                    type="button"
                    className="text-lg font-medium py-4 w-full text-left flex justify-between items-center px-4"
                    onClick={() => toggleSection(index)}
                  >
                    {section.title}
                    <PlusMinusIcon open={openSection === index} size={0.5} />
                  </button>

                  {/* 아코디언 영역 */}
                  <div
                    className={`overflow-hidden transition-all ease-out px-4
                      ${openSection === index
                        ? `max-h-[300px] duration-[1000ms] ${prevOpenSection !== null && "delay-200"}`
                        : "max-h-0 duration-300"}`}
                  >
                    <div className="flex flex-col space-y-3 px-4 pb-3">
                      {section.items?.map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className="text-base text-muted-foreground hover:text-primary hover:font-extrabold py-1"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 모바일 단일 링크들 */}
            <div className="mt-4 flex flex-col space-y-2">
              {singleItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-lg font-medium hover:text-primary hover:font-extrabold py-2 px-4"
                  onClick={() => setMobileMenuOpen(false)}
                  target={item.target}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
