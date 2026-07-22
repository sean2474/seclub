"use client"

import { useEffect, useState } from "react"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@seclub/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@seclub/ui/tabs"
import { Input } from "@seclub/ui/input"
import { Label } from "@seclub/ui/label"
import { TiptapEditor } from "@/components/ui/tiptap-editor"
import { safeUuid } from "@/lib/client/notice-image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@seclub/ui/select"
import { useCategories } from "@/hooks/use-category"
import { Notice } from "@/types/notices"
import { useToast } from "@seclub/ui/use-toast"
import { Button } from "@seclub/ui/button"
import { Switch } from "@seclub/ui/switch"
import { CategoryManagerPopover } from "./category-manager-popover"

export interface NoticeFormModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (data: {
    id: string
    title: string
    content: string
    active: boolean
    category: string
    pinned: boolean
    images?: string[]
  }) => void
  notice: Notice | null
}

function isContentEmpty(html: string) {
  if (!html) return true
  if (/<(img|video|audio|iframe|embed|svg)[\s>]/i.test(html)) return false
  const stripped = html
    .replace(/<br\s*\/?\s*>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]+>/g, "")
    .trim()
  return stripped.length === 0
}

export function NoticeFormModal({ isOpen, onOpenChange, onSave, notice }: NoticeFormModalProps) {
  const { toast } = useToast()
  // 새 공지는 클라이언트에서 id를 미리 생성해 (1) 에디터 이미지 업로드 폴더와
  // (2) 생성될 row의 id를 일치시킨다 → deleteNotice의 폴더 단위 정리와 호환.
  const [noticeId, setNoticeId] = useState<string>("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [active, setActive] = useState<boolean>(true)
  const [pinned, setPinned] = useState<boolean>(false)
  const [category, setCategory] = useState<string>("")
  const { categories, setCategories } = useCategories()

  useEffect(() => {
    if (isOpen) {
      if (notice) {
        setNoticeId(notice.id)
        setTitle(notice.title)
        setContent(notice.content || "")
        setActive(notice.active)
        setPinned(notice.pinned || false)
        setCategory(notice.category)
      } else {
        setNoticeId(safeUuid())
        setTitle("")
        setContent("")
        setActive(true)
        setPinned(false)
        setCategory("")
      }
    }
  }, [notice, isOpen])

  const handleSubmit = () => {
    if (title === "" || isContentEmpty(content) || category === "") {
      toast({
        title: "❌ 오류 발생",
        description: "카테고리, 제목, 내용은 필수입니다.",
        variant: "destructive",
      })
      return
    }
    onSave({ id: noticeId, title, content, active, pinned, category })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>{notice ? "공지 수정" : "새 공지 작성"}</DialogTitle>
          <DialogDescription>
            {notice ? "공지사항을 수정합니다." : "새로운 공지사항을 등록합니다."}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">작성</TabsTrigger>
            <TabsTrigger value="preview">미리보기</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="mt-4">
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="title">제목</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>내용</Label>
                <TiptapEditor content={content} onChange={setContent} uploadFolder={noticeId} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center gap-2">
                    <Label htmlFor="category">카테고리</Label>
                    <CategoryManagerPopover
                      categories={categories}
                      setCategories={setCategories}
                      currentCategory={category}
                      onCategoryChange={setCategory}
                    />
                  </div>
                  <Select value={category} onValueChange={(value: string) => setCategory(value)}>
                    <SelectTrigger id="category">
                      <SelectValue
                        placeholder={
                          categories.length > 0
                            ? "카테고리 선택"
                            : "먼저 '카테고리 관리'에서 카테고리를 추가하세요"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>게시 상태</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="status" checked={active} onCheckedChange={setActive} />
                    <Label htmlFor="status">{active ? "게시 중" : "비게시"}</Label>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <Switch id="pinned" checked={pinned} onCheckedChange={setPinned} />
                    <Label htmlFor="pinned">{pinned ? "상단 고정" : "일반"}</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            {/* 에디터(작성 탭)와 동일한 크림 배경으로 맞춰 실제 게시 모습과 일치시킨다. */}
            <div className="border rounded-md p-6 min-h-[300px] bg-[#FAF5E9] text-[#020E1B]">
              <div className="border-b border-foreground pb-4 mb-4">
                <p className="text-sm text-foreground/80 mb-1">{category || "(카테고리 미선택)"}</p>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 flex-wrap">
                  {pinned && (
                    <span className="text-xs bg-foreground text-background px-1.5 py-0.5 align-middle">
                      고정
                    </span>
                  )}
                  <span>{title || "(제목 없음)"}</span>
                </h1>
                <div className="flex items-center gap-3 text-xs text-foreground/60 mt-2">
                  <span>상태: {active ? "게시 중" : "비게시"}</span>
                </div>
              </div>
              {content && !isContentEmpty(content) ? (
                <div
                  className="prose max-w-none [&_img]:max-w-full [&_img]:h-auto [&_strong]:font-extrabold [&_em]:italic [&_u]:underline"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p className="text-sm text-muted-foreground italic">(내용이 비어있습니다)</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
