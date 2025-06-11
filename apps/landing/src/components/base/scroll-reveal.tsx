"use client";

import React, { useRef, useEffect, PropsWithChildren } from "react";

type Side = "left" | "right" | "top" | "bottom";
type RevealType = "p" | "h1" | "h2" | "div";

interface ScrollRevealProps {
  side?: Side; // 기본값: "bottom"
  className?: string;
  delay?: string;
  revealHeight?: string;
  type?: RevealType;
}

/**
 * 스크롤로 화면에 들어올 때 한 번만 나타나는 컴포넌트
 * @param side 등장 방향 (left, right, top, bottom)
 * @param className
 * @param delay 단위: milliseconds
 * @param revealHeight IntersectionObserver rootMargin 조절
 * @param type 렌더링할 태그 (p, h1, default: div)
 * @param children 자식 요소
 */
export default function ScrollReveal({
  side = "bottom",
  className = "",
  delay = "0ms",
  revealHeight = "-10%",
  type = "div",
  children,
}: PropsWithChildren<ScrollRevealProps>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("scroll-reveal-show");
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: `0px 0px ${revealHeight} 0px`,
        threshold: 0,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [revealHeight]);

  // side에 따른 초기 transform 클래스
  let initialTransform = "";
  switch (side) {
    case "left":
      initialTransform = "-translate-x-10";
      break;
    case "right":
      initialTransform = "translate-x-10";
      break;
    case "top":
      initialTransform = "-translate-y-10";
      break;
    case "bottom":
    default:
      initialTransform = "translate-y-10";
      break;
  }

  // type에 따라 렌더링할 태그 결정
  const Tag = ((): React.ElementType => {
    switch (type) {
      case "p":
        return "p";
      case "h1":
        return "h1";
      case "h2":
        return "h2";
      default:
        return "div";
    }
  })();

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={`transition-all duration-[1300ms] opacity-0 delay-100 ease-[cubic-bezier(.14,.46,0,1.34)] ${initialTransform} ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </Tag>
  );
}
