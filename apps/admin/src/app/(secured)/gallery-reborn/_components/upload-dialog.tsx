"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LAYOUT_TYPES,
  LAYOUT_TYPE_LABELS,
  type GalleryRebornUploadInput,
  type LayoutType,
} from "@/types/gallery-reborn"

interface DraftItem {
  id: string
  file: File
  previewUrl: string
  title: string
  description: string
  captionEn: string
  layoutType: LayoutType
}

interface UploadDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (inputs: GalleryRebornUploadInput[]) => Promise<void>
  uploadProgress: number | null
}

export function UploadDialog({ open, onClose, onSubmit, uploadProgress }: UploadDialogProps) {
  const [drafts, setDrafts] = useState<DraftItem[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) {
      drafts.forEach((d) => URL.revokeObjectURL(d.previewUrl))
      setDrafts([])
      setBusy(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const next: DraftItem[] = []
    const limit = Math.min(files.length, 10 - drafts.length)
    for (let i = 0; i < limit; i++) {
      const f = files[i]
      next.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        title: "",
        description: "",
        captionEn: "",
        layoutType: "centered",
      })
    }
    setDrafts((prev) => [...prev, ...next].slice(0, 10))
  }

  const updateDraft = (id: string, patch: Partial<DraftItem>) => {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)))
  }

  const removeDraft = (id: string) => {
    setDrafts((prev) => {
      const target = prev.find((d) => d.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((d) => d.id !== id)
    })
  }

  const handleSubmit = async () => {
    if (drafts.length === 0) return
    setBusy(true)
    await onSubmit(
      drafts.map((d) => ({
        file: d.file,
        title: d.title || null,
        description: d.description || null,
        captionEn: d.captionEn || null,
        layoutType: d.layoutType,
      })),
    )
    setBusy(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !busy && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>환생 갤러리 작품 업로드 (최대 10장)</DialogTitle>
          <DialogDescription>
            이미지를 선택하고 작품별 제목·설명·레이아웃 타입을 입력한 뒤 업로드하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <label
            htmlFor="reborn-file-input"
            className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
          >
            <p className="text-sm text-muted-foreground">
              클릭하여 이미지 추가 ({drafts.length}/10)
            </p>
            <input
              id="reborn-file-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files)
                e.target.value = ""
              }}
            />
          </label>

          {drafts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drafts.map((d) => (
                <div key={d.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex gap-3">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded">
                      <Image
                        src={d.previewUrl}
                        alt={d.file.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-muted-foreground truncate">{d.file.name}</p>
                      <Input
                        value={d.title}
                        onChange={(e) => updateDraft(d.id, { title: e.target.value })}
                        placeholder="제목"
                      />
                      <Select
                        value={d.layoutType}
                        onValueChange={(v) => updateDraft(d.id, { layoutType: v as LayoutType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LAYOUT_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {LAYOUT_TYPE_LABELS[t]} ({t})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Textarea
                    value={d.description}
                    onChange={(e) => updateDraft(d.id, { description: e.target.value })}
                    rows={2}
                    placeholder="설명 (선택)"
                  />
                  <div className="flex gap-2">
                    <Input
                      value={d.captionEn}
                      onChange={(e) => updateDraft(d.id, { captionEn: e.target.value })}
                      placeholder="영문 캡션 (선택)"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeDraft(d.id)}
                      disabled={busy}
                    >
                      제외
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {uploadProgress !== null && (
            <div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-center mt-2 text-muted-foreground">
                업로드 중... {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            취소
          </Button>
          <Button onClick={handleSubmit} disabled={busy || drafts.length === 0}>
            {busy ? "업로드 중..." : `${drafts.length}장 업로드`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
