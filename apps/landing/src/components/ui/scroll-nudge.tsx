"use client";

import { useEffect, useRef, useState } from "react";

type ScrollNudgeProps = {
  delayMs?: number;                 // 무활동 후 표시 지연
  position?: "bottom" | "top";      // 고정 위치
  direction?: "down" | "up";        // 화살표 방향 및 스크롤 방향
  className?: string;               // 사용자 정의 클래스
  hideOnScroll?: boolean;           // 스크롤 시 숨김
};

export function ScrollNudge({
  delayMs = 3000,
  position = "bottom",
  direction = "down",
  className = "",
  hideOnScroll = true,
}: ScrollNudgeProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const lastScrollY = useRef<number>(0);

  // 100svh 실제 px 측정 (지원 안 하면 innerHeight fallback)
  const measure100svh = () => {
    try {
      const probe = document.createElement("div");
      probe.style.cssText =
        "position:fixed;top:0;left:0;height:100svh;width:0;padding:0;margin:0;border:0;visibility:hidden;";
      document.body.appendChild(probe);
      const h = probe.getBoundingClientRect().height || window.innerHeight;
      document.body.removeChild(probe);
      return h;
    } catch {
      return window.innerHeight;
    }
  };

  const startIdleTimer = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setVisible(true), delayMs);
  };

  useEffect(() => {
    startIdleTimer();

    const onScroll = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastScrollY.current) === 0) return;
      lastScrollY.current = currentY;

      if (hideOnScroll && visible) setVisible(false);
      startIdleTimer();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayMs, hideOnScroll]);

  const isBottom = position === "bottom";
  const isDown = direction === "down";

  const handleClick = () => {
    const delta = measure100svh(); // 100svh px
    window.scrollBy({
      top: isDown ? delta : -delta,
      left: 0,
      behavior: "smooth",
    });
    if (hideOnScroll) setVisible(false);
    startIdleTimer();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      {/* 컨테이너 (클릭 가능) */}
      <div
        aria-hidden={!visible}
        role="button"
        tabIndex={0}
        aria-label={isDown ? "Scroll down by one screen" : "Scroll up by one screen"}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={[
          "fixed left-1/2 -translate-x-1/2 z-[100] cursor-pointer",
          isBottom ? "bottom-5" : "top-5",
          "transition-opacity duration-500",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-24 w-24 items-center justify-center rounded-full",
            "text-white",
            // 아래 라인은 Tailwind config에서 keyframes 정의가 없다면 동작하지 않음.
            // 필요 시 styled-jsx 또는 글로벌 CSS로 @keyframes 추가하세요.
            "animate-[nudge_2s_ease-in-out_infinite]",
            className,
          ].join(" ")}
        >
          <ArrowIcon className={["h-24 w-24", isDown ? "" : "rotate-180"].join(" ")} />
        </div>
      </div>
    </>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
