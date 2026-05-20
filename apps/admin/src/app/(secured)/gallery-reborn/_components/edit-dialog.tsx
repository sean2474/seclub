"use client"

import { useEffect, useState } from "react"
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
import { Label } from "@/components/ui/label"
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
  type GalleryRebornItem,
  type GalleryRebornUpdatePatch,
  type LayoutType,
} from "@/types/gallery-reborn"

interface EditDialogProps {
  item: GalleryRebornItem | null
  onClose: () => void
  onSave: (id: string, patch: GalleryRebornUpdatePatch) => Promise<void>
}

export function EditDialog({ item, onClose, onSave }: EditDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [captionEn, setCaptionEn] = useState("")
  const [layoutType, setLayoutType] = useState<LayoutType>("centered")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (item) {
      setTitle(item.title ?? "")
      setDescription(item.description ?? "")
      setCaptionEn(item.captionEn ?? "")
      setLayoutType(item.layoutType)
    }
  }, [item])

  if (!item) return null

  const handleSave = async () => {
    setSaving(true)
    await onSave(item.id, {
      title: title || null,
      description: description || null,
      captionEn: captionEn || null,
      layoutType,
    })
    setSaving(false)
    onClose()
  }

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>작품 편집</DialogTitle>
          <DialogDescription>제목·설명·영문 캡션·레이아웃 타입을 수정합니다.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reborn-title">제목</Label>
            <Input
              id="reborn-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="작품 제목"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reborn-desc">설명</Label>
            <Textarea
              id="reborn-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="작품 설명"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reborn-caption-en">영문 캡션</Label>
            <Input
              id="reborn-caption-en"
              value={captionEn}
              onChange={(e) => setCaptionEn(e.target.value)}
              placeholder="Born Again"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reborn-layout">레이아웃 타입</Label>
            <Select value={layoutType} onValueChange={(v) => setLayoutType(v as LayoutType)}>
              <SelectTrigger id="reborn-layout">
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
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
