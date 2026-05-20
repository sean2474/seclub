"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Button } from "@seclub/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@seclub/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@seclub/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@seclub/ui/alert-dialog"
import { Badge } from "@seclub/ui/badge"
import { MoreHorizontal, PlusCircle, FileEdit, Trash2, Paperclip, Pin } from "lucide-react"

import { Switch } from "@seclub/ui/switch"
import { useToast } from "@seclub/ui/use-toast"
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
    // Dropdown이 unmount되며 body에 남기는 pointer-events:none이
    // Dialog 위에 그대로 적용되는 Radix UI 버그 회피용 미세 지연
    setTimeout(() => {
      setEditingNotice(notice)
      setIsModalOpen(true)
    }, 0)
  }

  // Dialog/Dropdown/Popover가 닫힐 때 body에 잔여로 남는 pointer-events:none 제거
  const handleModalOpenChange = useCallback((open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setEditingNotice(null)
      setTimeout(() => {
        if (typeof document !== "undefined") {
          document.body.style.pointerEvents = ""
        }
      }, 100)
    }
  }, [])

  // Alert dialog 닫힐 때도 동일 처리
  const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setDeletingId(null)
      setTimeout(() => {
        if (typeof document !== "undefined") {
          document.body.style.pointerEvents = ""
        }
      }, 100)
    }
  }, [])

  const handleSaveNotice = async (formData: {
    title: string
    content: string
    active: boolean
    category: string
    pinned: boolean
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
            pinned: formData.pinned,
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
          pinned: formData.pinned,
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

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    // optimistic update
    setNotices(notices.map((n) => (n.id === id ? { ...n, active: newStatus } : n)))
    const { success, error } = await updateNotice(id, { active: newStatus })
    if (!success) {
      // rollback
      setNotices(notices.map((n) => (n.id === id ? { ...n, active: currentStatus } : n)))
      toast({
        title: "❌ 상태 변경 실패",
        description: error || "상태를 변경하지 못했습니다.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: "✅ 상태 변경",
      description: `공지가 ${newStatus ? "게시 중" : "비게시"} 상태로 변경되었습니다.`,
    })
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
                  <TableHead className="w-[110px] whitespace-nowrap">카테고리</TableHead>
                  <TableHead className="w-[110px] whitespace-nowrap">게시일</TableHead>
                  <TableHead className="w-[90px] whitespace-nowrap">상태</TableHead>
                  <TableHead className="w-[80px] text-right whitespace-nowrap">조회수</TableHead>
                  <TableHead className="w-[60px]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        {item.pinned && <Pin className="h-4 w-4 text-primary shrink-0" />}
                        <span className="truncate" title={item.title}>{item.title}</span>
                        {item.images && item.images.length > 0 && (
                          <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={item.category === "중요" ? "destructive" : "outline"} className="whitespace-nowrap">{item.category}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{item.created_at.split("T")[0]}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={item.active ? "default" : "secondary"} className="whitespace-nowrap">{item.active ? "게시 중" : "비게시"}</Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">{item.view.toLocaleString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>작업</DropdownMenuLabel>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault()
                              handleOpenModal(item)
                            }}
                          >
                            <FileEdit className="mr-2 h-4 w-4" />
                            편집
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault()
                              handleToggleStatus(item.id, item.active)
                            }}
                            className="flex items-center gap-2"
                          >
                            <Switch
                              className="data-[state=checked]:bg-primary scale-75 origin-left"
                              checked={item.active}
                              tabIndex={-1}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className="whitespace-nowrap">{item.active ? "비게시로 변경" : "게시로 변경"}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500"
                            onSelect={(e) => {
                              e.preventDefault()
                              setTimeout(() => setDeletingId(item.id), 0)
                            }}
                          >
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
        onOpenChange={handleModalOpenChange}
        onSave={handleSaveNotice}
        notice={editingNotice}
      />

      <AlertDialog open={!!deletingId} onOpenChange={handleDeleteDialogOpenChange}>
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