"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

const CHATBOT_URL = "https://seclub.off2on.io/";

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  // iframe은 처음 열 때만 로드 (성능 + 3rd-party 쿠키를 불필요하게 일찍 만들지 않음)
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) setMounted(true);
      return next;
    });
  }, []);

  // Esc로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // 열릴 때 닫기 버튼에 포커스
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* 패널 */}
      <div
        role="dialog"
        aria-modal="false"
        aria-label="SE CLUB 챗봇"
        aria-hidden={!open}
        className={`fixed z-50 transition-all duration-300 ease-out ${
          open
            ? "opacity-100 translate-y-0"
            : "pointer-events-none translate-y-3 opacity-0"
        } inset-x-2 bottom-2 top-2 sm:inset-x-auto sm:bottom-24 sm:right-5 sm:top-auto sm:h-[min(640px,calc(100svh-7rem))] sm:w-[400px]`}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-2xl">
          {/* 헤더 */}
          <div className="flex items-center justify-between gap-2 bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              <span className="font-medium">SE CLUB 챗봇</span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="챗봇 닫기"
              className="rounded-full p-1.5 transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
          {/* iframe */}
          <div className="relative flex-1 bg-background">
            {mounted && (
              <iframe
                src={CHATBOT_URL}
                title="SE CLUB 챗봇"
                className="absolute inset-0 h-full w-full border-0"
                allow="microphone; clipboard-write"
              />
            )}
          </div>
        </div>
      </div>

      {/* 플로팅 버튼 */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "챗봇 닫기" : "챗봇 열기"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
      >
        {open ? (
          <X className="h-6 w-6" strokeWidth={2} aria-hidden />
        ) : (
          <MessageCircle className="h-6 w-6" strokeWidth={1.8} aria-hidden />
        )}
      </button>
    </>
  );
}
