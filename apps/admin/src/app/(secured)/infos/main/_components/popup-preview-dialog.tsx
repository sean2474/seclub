"use client"

import { Dialog, DialogContent } from "@seclub/ui/dialog"
import type { Popup } from "@/types/popup"

interface PopupPreviewDialogProps {
  popup: Popup | null
  onClose: () => void
}

export function PopupPreviewDialog({ popup, onClose }: PopupPreviewDialogProps) {
  return (
    <Dialog open={!!popup} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-transparent border-none shadow-none">
        <div className="bg-white rounded-sm max-w-sm w-full mx-auto overflow-hidden shadow-2xl">
          {popup?.image_url && (
            <img src={popup.image_url} alt={popup.title} className="w-full h-auto block" />
          )}
          {(popup?.title || popup?.content) && (
            <div className="p-5">
              {popup?.title && (
                <h3 className="text-lg font-medium text-gray-900">{popup.title}</h3>
              )}
              {popup?.content && (
                <p
                  className={`${popup?.title ? "mt-2 " : ""}text-sm text-gray-600 leading-relaxed`}
                >
                  {popup.content}
                </p>
              )}
            </div>
          )}
          <div className="flex border-t text-sm">
            <button
              className="flex-1 py-3 text-gray-500 hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              오늘 하루 보지 않기
            </button>
            <button
              className="flex-1 py-3 border-l text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
