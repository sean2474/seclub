"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, FileEdit, Trash2, Paperclip } from "lucide-react"

import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Notice } from "@/types/notices"
import { useNotices } from "@/hooks/use-notices"
import { getNotices, createNotice, updateNotice, deleteNotice } from "@/lib/action/notice"
import { NoticeFormModal } from "./notice-form-modal"

export function NoticesContent() {
  const { toast } = useToast()
  const { notices, setNotices } = useNotices()
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

  const handleSaveNotice = async (formData: {
    title: string
    content: string
    active: boolean
    category: string
    images?: string[]
  }) => {
    toast({
      title: "처리 중...",
      description: editingNotice ? "공지사항을 수정하는 중입니다." : "공지사항을 등록하는 중입니다.",
    })

    try {
      if (editingNotice) {
        // Update existing notice
        const { success, error } = await updateNotice(
          editingNotice.id,
          {
            title: formData.title,
            content: formData.content,
            category: formData.category,
            active: formData.active,
            images: formData.images || [],
          }
        )
        
        if (success) {
          // Refresh notices list
          const { data } = await getNotices()
          if (data) setNotices(data)
          toast({
            title: "✅ 수정 완료",
            description: "공지사항이 성공적으로 수정되었습니다."
          })
        } else {
          toast({
            title: "❌ 수정 실패",
            description: error || "공지사항 수정 중 오류가 발생했습니다.",
            variant: "destructive"
          })
        }
      } else {
        // Create new notice
        const { success, error } = await createNotice({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          active: formData.active,
          images: formData.images || []
        })
        
        if (success) {
          // Refresh notices list
          const { data } = await getNotices()
          if (data) setNotices(data)
          toast({
            title: "✅ 작성 완료",
            description: "새로운 공지사항이 등록되었습니다."
          })
        } else {
          toast({
            title: "❌ 등록 실패",
            description: error || "공지사항 등록 중 오류가 발생했습니다.",
            variant: "destructive"
          })
        }
      }
    } catch (error) {
      console.error("Notice save error:", error)
      toast({
        title: "❌ 오류 발생",
        description: "작업 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    } finally {
      // Close modal and reset state
      setIsModalOpen(false)
      setEditingNotice(null)
    }
  }

  const handleDeleteNotice = async () => {
    if (deletingId) {
      // Show loading toast
      toast({
        title: "삭제 중...",
        description: "공지사항을 삭제하는 중입니다.",
      })
      
      try {
        // Call the delete server action
        const { success, error } = await deleteNotice(deletingId)
        
        if (success) {
          // Refresh notices after successful deletion
          const { data } = await getNotices()
          if (data) setNotices(data)
          
          toast({ 
            title: "🗑️ 삭제 완료", 
            description: "공지사항이 삭제되었습니다." 
          })
        } else {
          toast({
            title: "❌ 삭제 실패",
            description: error || "공지사항 삭제 중 오류가 발생했습니다.",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Notice deletion error:", error)
        toast({
          title: "❌ 오류 발생",
          description: "삭제 중 오류가 발생했습니다.",
          variant: "destructive"
        })
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    const newStatus: boolean = !currentStatus
    setNotices(notices.map((n) => (n.id === id ? { ...n, active: newStatus } : n)))
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
                        {item.images && item.images.length > 0 && (
                          <Paperclip className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.category === "중요" ? "destructive" : "outline"}>{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.created_at.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge variant={item.active ? "default" : "secondary"}>{item.active ? "게시 중" : "비게시"}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{item.view.toLocaleString()}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleToggleStatus(item.id, item.active)}>
                            <Switch
                              className="mr-2 h-4 w-4 data-[state=checked]:bg-primary"
                              checked={item.active}
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