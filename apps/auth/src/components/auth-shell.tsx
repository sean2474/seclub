import Link from "next/link"
import Image from "next/image"
import { type ReactNode } from "react"
import { IS_AUTH_MOCK, MOCK_OTP } from "@/lib/auth-mode"

/**
 * Page chrome shared by login + signup. Two-column on desktop (brand panel +
 * form panel), single column on mobile.
 *
 * No hex colors in JSX — every shade resolves through the design tokens in
 * globals.css (text-ink, bg-cream-50, border-ink-soft, …).
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  formIntro,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  formIntro?: ReactNode
}) {
  return (
    <main className="relative isolate min-h-svh bg-background">
      {IS_AUTH_MOCK && (
        <div className="pointer-events-none fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-full border border-gold/40 bg-cream-50/95 px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.18em] text-ink shadow-[0_4px_18px_-8px_rgba(47,42,33,0.35)] backdrop-blur-sm">
          데모 모드 · OTP {MOCK_OTP}
        </div>
      )}
      <div className="grid min-h-svh lg:grid-cols-[0.96fr_1.04fr]">
        {/* ───────── Brand panel (desktop only) ───────── */}
        <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-14">
          {/* Resort photograph — original tone preserved */}
          <Image
            src="/brand-bg.webp"
            alt=""
            aria-hidden
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 0px"
            className="object-cover opacity-[0.36] [filter:saturate(0.92)_contrast(1.08)]"
          />
          {/* Warm dark overlay above the photo. Stops are expressed against
              the same token palette used for surfaces, with alpha applied via
              color-mix so the brand wash stays system-driven. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(165deg,color-mix(in_srgb,var(--color-ink-deep)_86%,transparent)_0%,color-mix(in_srgb,var(--color-ink-hover)_68%,transparent)_48%,color-mix(in_srgb,var(--color-ink-soft)_56%,transparent)_100%)]"
          />
          {/* Soft gold glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-40 -top-40 size-[560px] rounded-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, color-mix(in srgb, var(--color-gold-glow) 18%, transparent) 0%, transparent 60%)",
            }}
          />

          <Link
            href="/"
            className="relative inline-flex items-center gap-3 self-start text-[14px] font-medium tracking-[0.06em] text-cream"
          >
            <Image
              src="/se-mark.png"
              alt=""
              aria-hidden
              width={24}
              height={24}
              className="size-6 object-contain"
            />
            SE&nbsp;Club
          </Link>

          <div className="relative max-w-md">
            <p className="mb-[22px] text-[11px] uppercase tracking-[0.32em] text-cream/70">
              Membership · Est. 1998
            </p>
            <h2 className="text-[2.625rem] font-[380] leading-[1.2] tracking-[0.005em] text-cream">
              조용한 휴식이
              <br />
              가까이에서 시작됩니다.
            </h2>
            {/* Optical alignment: body indents 2px to line up visually with
                the heading (Korean glyphs carry more left bearing). */}
            <p className="ml-[2px] mt-5 max-w-[34ch] text-[15px] leading-[1.75] text-cream/80">
              회원만을 위한 객실 우선 예약, 시즌 한정 혜택, 멤버 라운지 초대를
              계정 하나로 누리세요.
            </p>
          </div>

          <div className="relative flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-cream-300/80">
            <span>© {new Date().getFullYear()} SE Club</span>
            <span>Taean · Republic of Korea</span>
          </div>
        </aside>

        {/* ───────── Form panel ───────── */}
        <section
          className="relative flex flex-col"
          style={{
            backgroundImage:
              "linear-gradient(180deg, var(--color-cream-50) 0%, var(--color-cream-100) 60%, var(--color-cream-200) 100%)",
          }}
        >
          {/* Mobile-only header. Top padding respects the notch via safe-area. */}
          <div className="relative flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top),24px)] lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-[15px] font-medium tracking-[0.04em] text-ink"
            >
              <Image
                src="/se-mark.png"
                alt=""
                aria-hidden
                width={24}
                height={24}
                className="size-6 object-contain"
              />
              SE&nbsp;Club
            </Link>
          </div>

          <div className="relative mx-auto flex w-full max-w-[min(420px,calc(100vw-40px))] flex-1 flex-col justify-center px-5 pb-[max(env(safe-area-inset-bottom),32px)] pt-8 sm:py-14 lg:max-w-[420px]">
            <div className="animate-(--animate-slide-up)">
              <div className="mb-8 space-y-2.5">
                <h1 className="text-[22px] font-[380] leading-[1.24] tracking-[0.005em] text-ink sm:text-[26px]">
                  {title}
                </h1>
                {/* Subtitle indents 2px for optical alignment with the heading. */}
                {subtitle && (
                  <p className="ml-[2px] text-[15px] leading-[1.55] text-muted-text">{subtitle}</p>
                )}
                {formIntro && <div className="ml-[2px] pt-1">{formIntro}</div>}
              </div>

              <div className="auth-card rounded-[10px] border border-ink-soft/10 bg-card/95 p-[22px_20px] shadow-[0_1px_0_rgba(255,255,255,0.42),_0_22px_50px_-42px_rgba(47,42,33,0.22)] backdrop-blur-[14px] backdrop-saturate-[1.05]">
                {children}
              </div>

              {footer && <div className="mt-6 text-center text-[14px] text-body">{footer}</div>}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
