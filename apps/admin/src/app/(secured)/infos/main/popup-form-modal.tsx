"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Popup } from "@/types/popup"
import { Upload, X, ImageIcon } from "lucide-react"

interface PopupFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: {
    title: string
    content: string
    imageBase64: string | null
    imageContentType: string | null
    existingImageUrl: string | null
    link_url: string
    active: boolean
    priority: number
    start_date: string
    end_date: string
  }) => void
  popup: Popup | null
}

export function PopupFormModal({ isOpen, onOpenChange, onSave, popup }: PopupFormModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [active, setActive] = useState(false)
  const [priority, setPriority] = useState(0)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageContentType, setImageContentType] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (popup) {
      setTitle(popup.title)
      setContent(popup.content || "")
      setLinkUrl(popup.link_url || "")
      setActive(popup.active)
      setPriority(popup.priority)
      setStartDate(popup.start_date ? popup.start_date.split("T")[0] : "")
      setEndDate(popup.end_date ? popup.end_date.split("T")[0] : "")
      setImagePreview(popup.image_url)
      setExistingImageUrl(popup.image_url)
      setImageBase64(null)
      setImageContentType(null)
    } else {
      setTitle("")
      setContent("")
      setLinkUrl("")
      setActive(false)
      setPriority(0)
      setStartDate("")
      setEndDate("")
      setImagePreview(null)
      setImageBase64(null)
      setImageContentType(null)
      setExistingImageUrl(null)
    }
  }, [popup, isOpen])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setImagePreview(result)
      // base64 데이터 추출
      const base64 = result.split(",")[1]
      setImageBase64(base64)
      setImageContentType(file.type)
      setExistingImageUrl(null)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageBase64(null)
    setImageContentType(null)
    setExistingImageUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const [dateError, setDateError] = useState("")

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setDateError("시작일이 종료일보다 늦을 수 없습니다.")
    } else {
      setDateError("")
    }
  }, [startDate, endDate])

  const handleSubmit = () => {
    if (!title.trim() || dateError) return
    onSave({
      title: title.trim(),
      content: content.trim(),
      imageBase64,
      imageContentType,
      existingImageUrl,
      link_url: linkUrl.trim(),
      active,
      priority,
      start_date: startDate,
      end_date: endDate,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{popup ? "팝업 수정" : "새 팝업 등록"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="popup-title">제목 *</Label>
            <Input
              id="popup-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="팝업 제목"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="popup-content">내용</Label>
            <Textarea
              id="popup-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="팝업 내용 (선택사항)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>팝업 이미지</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="미리보기"
                  className="w-full max-h-48 object-contain rounded-md border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleRemoveImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">클릭하여 이미지 업로드</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="popup-link">링크 URL</Label>
            <Input
              id="popup-link"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com (선택사항)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="popup-priority">우선순위</Label>
              <Input
                id="popup-priority"
                type="number"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch checked={active} onCheckedChange={setActive} />
              <Label>게시 상태</Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="popup-start">시작일</Label>
              <Input
                id="popup-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="popup-end">종료일</Label>
              <Input
                id="popup-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          {dateError && (
            <p className="text-sm text-red-500">{dateError}</p>
          )}

          {/* 실시간 미리보기 */}
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-base font-semibold">팝업 미리보기</Label>
            <div className="bg-black/40 rounded-lg p-6 flex items-center justify-center min-h-[300px]">
              <div className="bg-white rounded-sm max-w-sm w-full overflow-hidden shadow-xl">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="w-full aspect-[4/3] object-cover"
                  />
                )}
                <div className={imagePreview ? "p-5" : "px-5 pt-7 pb-5"}>
                  <h3 className="text-lg font-medium text-gray-900">
                    {title || "팝업 제목"}
                  </h3>
                  {(content || !title) && (
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {content || "팝업 내용이 여기에 표시됩니다."}
                    </p>
                  )}
                  {linkUrl && (
                    <p className="mt-3 text-sm text-gray-900 font-medium">자세히 보기 →</p>
                  )}
                </div>
                <div className="flex border-t text-sm">
                  <button className="flex-1 py-3 text-gray-500 hover:bg-gray-50 transition-colors">
                    오늘 하루 보지 않기
                  </button>
                  <button className="flex-1 py-3 border-l text-gray-900 font-medium hover:bg-gray-50 transition-colors">
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={handleSubmit} disabled={!title.trim() || !!dateError}>
              {popup ? "수정" : "등록"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
