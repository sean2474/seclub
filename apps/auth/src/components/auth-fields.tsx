"use client"

import {
  forwardRef,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@seclub/utils"

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  /** Render to the right of the label (e.g. "forgot password?" link). */
  labelAdornment?: ReactNode
  error?: string | null
}

// All colors come from globals.css design tokens (text-ink, bg-cream-50, …).
const inputBase =
  "block h-11 w-full rounded-lg border border-gold/30 bg-cream-50/70 px-3.5 text-[14px] text-ink outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-placeholder focus-visible:border-gold focus-visible:shadow-[0_0_0_2px_var(--color-gold)/18] disabled:cursor-not-allowed disabled:opacity-60"

const inputError =
  "border-error-border bg-error-bg focus-visible:border-error-border focus-visible:shadow-[0_0_0_2px_var(--color-error-border)/16]"

const labelClass =
  "inline-block text-[11px] font-medium uppercase tracking-[0.08em] text-label"

export const TextField = forwardRef<HTMLInputElement, FieldProps>(function TextField(
  { label, hint, labelAdornment, error, className, id, ...props },
  ref,
) {
  const reactId = useId()
  const fieldId = id ?? reactId
  const describedBy = error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <label htmlFor={fieldId} className={labelClass}>
          {label}
        </label>
        {labelAdornment}
      </div>
      <input
        id={fieldId}
        ref={ref}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy}
        className={cn(inputBase, error && inputError, className)}
        {...props}
      />
      {error ? (
        <p
          id={`${fieldId}-err`}
          role="alert"
          className="mt-2 text-[12px] leading-[1.45] tracking-[0.01em] text-error-text"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="mt-1.5 text-[13px] leading-5 text-body">
          {hint}
        </p>
      ) : null}
    </div>
  )
})

export function PasswordField({
  label,
  hint,
  labelAdornment,
  error,
  className,
  id,
  ...props
}: FieldProps) {
  const reactId = useId()
  const fieldId = id ?? reactId
  const [visible, setVisible] = useState(false)
  const describedBy = error ? `${fieldId}-err` : hint ? `${fieldId}-hint` : undefined
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <label htmlFor={fieldId} className={labelClass}>
          {label}
        </label>
        {labelAdornment}
      </div>
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          className={cn(inputBase, "pr-12", error && inputError, className)}
          {...props}
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation()
            setVisible((v) => !v)
          }}
          aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
          aria-pressed={visible}
          className="absolute right-0.5 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-label transition-colors hover:bg-gold/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/55"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error ? (
        <p
          id={`${fieldId}-err`}
          role="alert"
          className="mt-2 text-[12px] leading-[1.45] tracking-[0.01em] text-error-text"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${fieldId}-hint`} className="mt-1.5 text-[13px] leading-5 text-body">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingLabel?: string
  children: ReactNode
}

/**
 * Primary CTA. Follows landing's `Button variant="primary"` interaction:
 * filled dark on idle → fill drops to transparent on hover/active, text + 1px
 * border take the brand color. No scale, no transform — copy never moves.
 */
export function PrimaryButton({
  children,
  loading,
  loadingLabel,
  className,
  disabled,
  type,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type={type || "submit"}
      disabled={disabled || loading}
      className={cn(
        "inline-flex h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-[14px] font-medium tracking-[0.05em] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-gold/35 disabled:cursor-not-allowed disabled:opacity-70",
        loading
          ? "cursor-progress border-ink-loading bg-ink-loading text-cream-soft"
          : "border-ink bg-ink text-cream hover:bg-transparent hover:text-ink active:bg-transparent active:text-ink",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 animate-spin" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2.5" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function FormError({ children }: { children: ReactNode }) {
  if (!children) return null
  return (
    <div
      role="alert"
      className="animate-(--animate-shake) rounded-lg border border-error-border/40 bg-error-bg px-3 py-2 text-[12px] leading-[1.5] tracking-[0.005em] text-error-text"
    >
      {children}
    </div>
  )
}
