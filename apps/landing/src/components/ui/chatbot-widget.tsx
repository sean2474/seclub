"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Leaf, MessageCircle, X } from "lucide-react";

const CHATBOT_URL = "https://chat.seclub.kr/";
// 로드가 이 시간을 넘으면 새 탭 fallback 안내 (cross-origin iframe 은 onError 가
// 신뢰성 있게 안 떠서 timeout 으로 방어).
const LOAD_TIMEOUT_MS = 12_000;
// 그리팅 말풍선이 뜨기까지 지연.
const TEASER_DELAY_MS = 2_200;

export function ChatbotWidget({ liftPx = 0 }: { liftPx?: number }) {
  const [open, setOpen] = useState(false);
  // iframe 은 처음 열 때만 마운트. 세션 유지를 위해 이후 닫아도 unmount 하지 않음
  // (재방문 시 대화 이어짐). 트레이드오프: 백그라운드 iframe 1개 상주.
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const [teaser, setTeaser] = useState(false);

  const fabRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  const toggle = useCallback(() => {
    setMounted(true); // 한 번 열면 계속 mount 유지 (idempotent)
    setTeaser(false);
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

  // 첫 진입 후 한 번 그리팅 말풍선 노출 (열어본 적 없을 때만)
  useEffect(() => {
    if (mounted) return;
    const t = setTimeout(() => setTeaser(true), TEASER_DELAY_MS);
    return () => clearTimeout(t);
  }, [mounted]);

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
            : "pointer-events-none translate-y-4 opacity-0"
        } inset-x-2 bottom-2 top-2 sm:inset-x-auto sm:bottom-5 sm:right-20 sm:top-auto sm:h-[min(660px,calc(100svh-7.5rem))] sm:w-[396px]`}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-background shadow-[0_24px_60px_-12px_rgba(13,84,43,0.45),0_8px_24px_-8px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
          {/* 헤더 */}
          <div className="relative flex items-center gap-3 bg-gradient-to-br from-[#0d542b] to-[#08381c] px-4 py-3.5 text-[#FAF5E9]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background/15 ring-1 ring-white/20 backdrop-blur-sm">
              <Leaf className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden />
            </span>
            <div className="min-w-0 leading-tight">
              <p className="font-semibold tracking-tight">SE CLUB</p>
              <p className="flex items-center gap-1.5 text-xs text-[#FAF5E9]/70">
                <span
                  aria-hidden
                  className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300"
                />
                AI 컨시어지
              </p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="챗봇 닫기"
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 motion-reduce:transition-none"
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
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/15 border-t-primary motion-reduce:animate-none" />
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
                  className="rounded-full bg-primary px-4 py-2 text-sm text-[#FAF5E9]"
                >
                  새 탭에서 열기
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 그리팅 말풍선 — 데스크탑에서 패널 닫혀있고 아직 안 열어봤을 때.
          SNS 가 열리면 FAB 와 함께 위로 올라간다 (liftPx). */}
      <div
        inert={!teaser || open}
        style={{ transform: `translateY(${-liftPx}px)` }}
        className={`fixed bottom-[8.75rem] right-6 z-50 hidden transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none sm:block ${
          teaser && !open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="relative flex max-w-[248px] items-start gap-2 rounded-2xl rounded-br-md border border-black/5 bg-background py-3 pl-4 pr-9 shadow-[0_16px_40px_-12px_rgba(13,84,43,0.4)] ring-1 ring-black/5">
          <button
            type="button"
            onClick={toggle}
            className="text-left text-sm leading-snug text-foreground focus-visible:outline-none"
          >
            안녕하세요! SE CLUB AI 컨시어지예요.
            <span className="mt-0.5 block text-foreground/60">
              예약·시설·이용 안내, 무엇이든 물어보세요.
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTeaser(false)}
            aria-label="안내 닫기"
            className="absolute cursor-pointer right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/70 motion-reduce:transition-none"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>

      {/* 플로팅 버튼 — 모바일에서 패널 열리면 숨김 (패널 헤더의 X 로 닫음).
          위치 이동(SNS 열림 시 위로)은 래퍼의 translateY 로 처리해 버튼 자체의
          hover scale 변환과 충돌하지 않게 한다. */}
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
          className={`cursor-pointer group relative flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#0d542b] to-[#08381c] text-[#FAF5E9] shadow-[0_10px_30px_-8px_rgba(13,84,43,0.65)] ring-1 ring-white/10 transition-[transform,box-shadow] duration-200 hover:scale-105 hover:shadow-[0_14px_36px_-8px_rgba(13,84,43,0.75)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:scale-100 ${
            open ? "max-sm:hidden" : ""
          }`}
        >
          {/* idle 어텐션 펄스 (열기 전, 모션 허용 시) */}
          {!open && !mounted && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full bg-primary/30 motion-safe:animate-ping"
            />
          )}
          <span className="relative">
            {open ? (
              <X className="h-6 w-6" strokeWidth={2} aria-hidden />
            ) : (
              <MessageCircle className="h-6 w-6" strokeWidth={1.9} aria-hidden />
            )}
          </span>
        </button>
      </div>
    </>
  );
}
