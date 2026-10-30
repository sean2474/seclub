"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

const CHATBOT_URL = "https://chat.seclub.kr/";
// 로드가 이 시간을 넘으면 새 탭 fallback 안내 (cross-origin iframe 은 onError 가
// 신뢰성 있게 안 떠서 timeout 으로 방어).
const LOAD_TIMEOUT_MS = 12_000;

export function ChatbotWidget({ liftPx = 0 }: { liftPx?: number }) {
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
        className={`fixed z-50 transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none ${
          open
            ? "opacity-100 translate-y-0"
            : "pointer-events-none translate-y-4 opacity-0"
        } inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] top-[max(0.75rem,env(safe-area-inset-top))] sm:inset-x-auto sm:bottom-5 sm:right-20 sm:top-auto sm:h-[min(680px,calc(100dvh-2.5rem))] sm:w-[400px]`}
      >
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-[#d6ceac] shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          {/* shortcut: iframe의 80px 로고 헤더에 맞춤, 헤더 변경 시 닫기 위치도 조정. */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="챗봇 닫기"
            className="absolute right-3 top-[18px] z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#d6ceac] text-neutral-800 transition-colors hover:bg-[#c7bf9e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#d6ceac] motion-reduce:transition-none"
          >
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
          <div className="relative h-full">
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
                className="absolute inset-0 top-20 flex items-center justify-center bg-[#171717]"
                role="status"
                aria-live="polite"
              >
                <span
                  aria-hidden
                  className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-[#d6ceac] motion-reduce:animate-none"
                />
                <span className="sr-only">챗봇을 불러오는 중입니다</span>
              </div>
            )}
            {mounted && !loaded && loadTimedOut && (
              <div
                className="absolute inset-0 top-20 flex flex-col items-center justify-center gap-4 bg-[#171717] p-6 text-center"
                role="status"
              >
                <p className="text-sm text-neutral-300">
                  챗봇을 불러오지 못했습니다.
                </p>
                <a
                  href={CHATBOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 py-2 text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6ceac] motion-reduce:transition-none"
                >
                  새 탭에서 열기
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SNS 메뉴가 펼쳐지면 버튼을 위로 이동하고, 모바일에서 패널이 열리면 숨긴다. */}
      <div
        className="fixed bottom-20 right-5 z-50 transition-transform duration-300 ease-out motion-reduce:transition-none"
        style={{ transform: `translateY(${-liftPx}px)` }}
      >
        <button
          ref={fabRef}
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="chatbot-panel"
          aria-label={open ? "챗봇 닫기" : "챗봇 열기"}
          title={open ? "챗봇 닫기" : "SE CLUB 이용 문의"}
          className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#171717] text-[#d6ceac] shadow-[0_4px_16px_rgba(0,0,0,0.16)] transition-colors duration-200 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 motion-reduce:transition-none ${
            open ? "max-sm:hidden" : ""
          }`}
        >
          {open ? (
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          ) : (
            <MessageCircle className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          )}
        </button>
      </div>
    </>
  );
}
