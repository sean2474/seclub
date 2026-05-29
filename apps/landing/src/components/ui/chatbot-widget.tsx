"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

const CHATBOT_URL = "https://seclub.off2on.io/";
// 로드가 이 시간을 넘으면 새 탭 fallback 안내 (cross-origin iframe 은 onError 가
// 신뢰성 있게 안 떠서 timeout 으로 방어).
const LOAD_TIMEOUT_MS = 12_000;

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  // iframe 은 처음 열 때만 마운트. 세션 유지를 위해 이후 닫아도 unmount 하지 않음
  // (재방문 시 대화 이어짐). 트레이드오프: 백그라운드 iframe 1개 상주.
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);

  const fabRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  const toggle = useCallback(() => {
    setMounted(true); // 한 번 열면 계속 mount 유지 (idempotent)
    setOpen((prev) => !prev);
  }, []);

  // Esc 로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // 포커스 관리: 열리면 닫기 버튼, 닫히면 FAB 로 복원.
  // 이 effect 는 re-render(=DOM 커밋) 후 실행되므로, 닫힐 때 FAB 의
  // max-sm:hidden 이 이미 해제돼 있어 모바일에서도 focus 가 동작한다.
  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    } else if (wasOpenRef.current) {
      fabRef.current?.focus();
    }
    wasOpenRef.current = open;
  }, [open]);

  // 로딩 타임아웃 (최초 mount 시점부터 측정; iframe 은 계속 살아있음)
  useEffect(() => {
    if (!mounted || loaded) return;
    const t = setTimeout(() => setLoadTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [mounted, loaded]);

  return (
    <>
      {/* 패널 */}
      <div
        id="chatbot-panel"
        role="dialog"
        aria-modal="false"
        aria-label="SE CLUB 챗봇"
        inert={!open}
        className={`fixed z-50 transition-all duration-300 ease-out motion-reduce:transition-none ${
          open
            ? "opacity-100 translate-y-0"
            : "pointer-events-none translate-y-3 opacity-0"
        } inset-x-2 bottom-2 top-2 sm:inset-x-auto sm:bottom-24 sm:right-5 sm:top-auto sm:h-[min(640px,calc(100svh-7rem))] sm:w-[400px]`}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-background shadow-2xl">
          {/* 헤더 */}
          <div className="flex items-center justify-between gap-2 bg-primary px-4 py-2 text-primary-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" strokeWidth={1.8} aria-hidden />
              <span className="font-medium">SE CLUB 챗봇</span>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="챗봇 닫기"
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 motion-reduce:transition-none"
            >
              <X className="h-5 w-5" strokeWidth={2} aria-hidden />
            </button>
          </div>
          {/* iframe + 로딩/실패 상태 */}
          <div className="relative flex-1 bg-background">
            {mounted && (
              <iframe
                src={CHATBOT_URL}
                title="SE CLUB 챗봇"
                onLoad={() => {
                  setLoaded(true);
                  setLoadTimedOut(false);
                }}
                className="absolute inset-0 h-full w-full border-0"
                allow="microphone; clipboard-write"
              />
            )}
            {mounted && !loaded && !loadTimedOut && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-background"
                role="status"
                aria-live="polite"
              >
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-primary motion-reduce:animate-none" />
                <span className="sr-only">챗봇을 불러오는 중입니다</span>
              </div>
            )}
            {mounted && !loaded && loadTimedOut && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background p-6 text-center">
                <p className="text-sm text-foreground/70">
                  챗봇을 불러오지 못했습니다.
                </p>
                <a
                  href={CHATBOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                  새 탭에서 열기
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 플로팅 버튼 — 모바일에서 패널 열리면 숨김 (패널 헤더의 X 로 닫음) */}
      <button
        ref={fabRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="chatbot-panel"
        aria-label={open ? "챗봇 닫기" : "챗봇 열기"}
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
          open ? "max-sm:hidden" : ""
        }`}
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
