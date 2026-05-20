"use client"

import { useCallback } from "react"

/**
 * Radix UI sometimes leaves `pointer-events: none` on `<body>` when a dropdown
 * unmounts while a dialog/alert opens on top. Wrap the dialog's `onOpenChange`
 * with this so the leftover style is cleared shortly after close.
 *
 * @see https://github.com/radix-ui/primitives/issues/2122
 */
export function useRadixDialogCleanup<T>(
  setOpen: (open: boolean) => void,
  onClose?: () => void,
) {
  return useCallback(
    (open: boolean) => {
      setOpen(open)
      if (!open) {
        onClose?.()
        setTimeout(() => {
          if (typeof document !== "undefined") {
            document.body.style.pointerEvents = ""
          }
        }, 100)
      }
    },
    [setOpen, onClose],
  ) as (open: boolean) => void & ((value: T) => void)
}
