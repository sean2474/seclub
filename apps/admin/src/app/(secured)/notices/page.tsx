"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, FileEdit, Trash2, Paperclip } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // 1. Select 컴포넌트 import

type NoticeCategory = "일반" | "이벤트" | "중요" // 2. NoticeCategory 타입 정의
type NoticeStatus = "게시 중" | "비게시"

interface Notice {
  id: string
  title: string
  category: NoticeCategory // 3. category 속성 추가
  author: string
  date: string
  status: NoticeStatus
  views: number
  content?: string
  imageUrls?: string[]
}

const initialNoticeItems: Notice[] = [
  {
    id: "n1",
    title: "7~8월 성수기 예약 안내",
    category: "중요", // 4. 샘플 데이터에 category 추가
    author: "관리자",
    date: "2024-07-15",
    status: "게시 중",
    views: 1024,
    content: "7월과 8월 성수기 예약이 시작되었습니다. 많은 관심 부탁드립니다.",
    imageUrls: ["/placeholder.svg?width=400&height=200", "/placeholder.svg?width=400&height=200"],
  },
  {
    id: "n2",
    title: "수영장 안전 수칙 안내",
    category: "일반",
    author: "관리자",
    date: "2024-07-10",
    status: "게시 중",
    views: 850,
    content: "수영장 이용 시 안전 수칙을 꼭 지켜주세요. 다이빙은 금지입니다.",
  },
  {
    id: "n3",
    title: "반려동물 동반 입실 규정 변경",
    category: "일반",
    author: "매니저",
    date: "2024-07-01",
    status: "비게시",
    views: 1532,
    content: "2024년 7월 1일부터 반려동물 동반 입실 규정이 변경됩니다. 자세한 내용은 홈페이지를 참고해주세요.",
  },
  {
    id: "n4",
    title: "분리수거 안내",
    category: "일반",
    author: "관리자",
    date: "2024-06-20",
    status: "게시 중",
    views: 2401,
    content: "깨끗한 캠핑장 환경을 위해 분리수거에 적극 협조해주시기 바랍니다.",
  },
]

export default function NoticesPage() {
  const { toast } = useToast()
  const [notices, setNotices] = useState<Notice[]>(initialNoticeItems)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get("new") === "true") {
      handleOpenModal(null)
      router.replace("/notices", { scroll: false })
    }
  }, [searchParams, router])

  const handleOpenModal = (notice: Notice | null) => {
    setEditingNotice(notice)
    setIsModalOpen(true)
  }

  // 5. handleSaveNotice 함수가 category를 받도록 수정
  const handleSaveNotice = (formData: {
    title: string
    content: string
    status: NoticeStatus
    category: NoticeCategory
    imageUrls?: string[]
  }) => {
    if (editingNotice) {
      setNotices(
        notices.map((n) =>
          n.id === editingNotice.id ? { ...n, ...formData, date: new Date().toISOString().split("T")[0] } : n,
        ),
      )
      toast({ title: "✅ 수정 완료", description: "공지사항이 성공적으로 수정되었습니다." })
    } else {
      const newNotice: Notice = {
        id: `n${Date.now()}`,
        author: "관리자",
        date: new Date().toISOString().split("T")[0],
        views: 0,
        ...formData,
      }
      setNotices([newNotice, ...notices])
      toast({ title: "✅ 작성 완료", description: "새로운 공지사항이 등록되었습니다." })
    }
    setIsModalOpen(false)
    setEditingNotice(null)
  }

  const handleDeleteNotice = () => {
    if (deletingId) {
      setNotices(notices.filter((n) => n.id !== deletingId))
      toast({ title: "🗑️ 삭제 완료", description: "공지사항이 삭제되었습니다." })
      setDeletingId(null)
    }
  }

  const handleToggleStatus = (id: string, currentStatus: NoticeStatus) => {
    const newStatus: NoticeStatus = currentStatus === "게시 중" ? "비게시" : "게시 중"
    setNotices(notices.map((n) => (n.id === id ? { ...n, status: newStatus } : n)))
    toast({ title: "상태 변경", description: `공지 상태가 '${newStatus}'(으)로 변경되었습니다.` })
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">공지사항 관리</h1>
          <div className="ml-auto">
            <Button onClick={() => handleOpenModal(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> 새 공지 작성
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>공지 목록</CardTitle>
            <CardDescription>등록된 공지사항 목록입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>제목</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>작성자</TableHead>
                  <TableHead>게시일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">조회수</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{item.title}</span>
                        {item.imageUrls && item.imageUrls.length > 0 && (
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.category === "중요" ? "destructive" : "outline"}>{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.author}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "게시 중" ? "default" : "secondary"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.views.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>작업</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenModal(item)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            편집
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(item.id, item.status)}>
                            <Switch
                              className="mr-2 h-4 w-4 data-[state=checked]:bg-primary"
                              checked={item.status === "게시 중"}
                            />
                            상태 변경
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500" onClick={() => setDeletingId(item.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <NoticeFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveNotice}
        notice={editingNotice}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 공지사항이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNotice}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface NoticeFormModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSave: (data: {
    title: string
    content: string
    status: NoticeStatus
    category: NoticeCategory
    imageUrls?: string[]
  }) => void
  notice: Notice | null
}

function NoticeFormModal({ isOpen, onOpenChange, onSave, notice }: NoticeFormModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<NoticeStatus>("게시 중")
  const [category, setCategory] = useState<NoticeCategory>("일반") // 8. category state 추가
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      if (notice) {
        setTitle(notice.title)
        setContent(notice.content || "")
        setStatus(notice.status)
        setCategory(notice.category) // 9. category 상태 설정
        setImagePreviews(notice.imageUrls || [])
      } else {
        setTitle("")
        setContent("")
        setStatus("게시 중")
        setCategory("일반") // 10. category 상태 초기화
        setImagePreviews([])
      }
    }
  }, [notice, isOpen])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    setImagePreviews((prev) => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleSubmit = () => {
    onSave({ title, content, status, category, imageUrls: imagePreviews }) // 11. 저장 시 category 전달
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{notice ? "공지 수정" : "새 공지 작성"}</DialogTitle>
          <DialogDescription>{notice ? "공지사항을 수정합니다." : "새로운 공지사항을 등록합니다."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">내용</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image-upload">첨부 이미지</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
              multiple
            />
            {imagePreviews.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imagePreviews.map((src, index) => (
                  <div key={index} className="relative w-fit">
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`미리보기 ${index + 1}`}
                      width={120}
                      height={67.5}
                      className="rounded-md object-cover aspect-video"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">{`이미지 ${index + 1} 제거`}</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={(value: NoticeCategory) => setCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="일반">일반</SelectItem>
                  <SelectItem value="이벤트">이벤트</SelectItem>
                  <SelectItem value="중요">중요</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>게시 상태</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="status"
                  checked={status === "게시 중"}
                  onCheckedChange={(checked) => setStatus(checked ? "게시 중" : "비게시")}
                />
                <Label htmlFor="status">{status}</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
