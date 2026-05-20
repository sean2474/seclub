"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, PlusCircle, FileEdit, Trash2, Eye } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Popup } from "@/types/popup"
import { usePopups } from "@/hooks/use-popups"
import { getPopups, createPopup, updatePopup, deletePopup, uploadPopupImage } from "@/lib/action/popup"
import { PopupFormModal } from "./popup-form-modal"

export function PopupSection() {
  const { toast } = useToast()
  const { popups, setPopups } = usePopups()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [previewPopup, setPreviewPopup] = useState<Popup | null>(null)

  const handleOpenModal = (popup: Popup | null) => {
    setEditingPopup(popup)
    setIsModalOpen(true)
  }

  const handleToggleActive = async (popup: Popup) => {
    const newActive = !popup.active
    // 낙관적 UI 업데이트
    setPopups(popups.map(p => p.id === popup.id ? { ...p, active: newActive } : p))

    const { success, error } = await updatePopup(popup.id, { active: newActive })
    if (success) {
      toast({
        title: newActive ? "팝업 활성화" : "팝업 비활성화",
        description: `"${popup.title}" 팝업이 ${newActive ? "활성화" : "비활성화"}되었습니다.`,
      })
    } else {
      // 실패 시 롤백
      setPopups(popups.map(p => p.id === popup.id ? { ...p, active: popup.active } : p))
      toast({
        title: "상태 변경 실패",
        description: error || "상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const handleSavePopup = async (formData: {
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
  }) => {
    toast({
      title: "처리 중...",
      description: editingPopup ? "팝업을 수정하는 중입니다." : "팝업을 등록하는 중입니다.",
    })

    const basePopupData = {
      title: formData.title,
      content: formData.content || null,
      link_url: formData.link_url || null,
      active: formData.active,
      priority: formData.priority,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
    }

    try {
      if (editingPopup) {
        // 수정: 이미지 교체가 있으면 기존 id 폴더에 업로드. updatePopup이 이전 파일 정리.
        let imageUrl: string | null = formData.existingImageUrl
        if (formData.imageBase64 && formData.imageContentType) {
          const up = await uploadPopupImage(editingPopup.id, formData.imageBase64, formData.imageContentType)
          if (!up.success) {
            toast({
              title: "이미지 업로드 실패",
              description: up.error || "이미지 업로드 중 오류가 발생했습니다.",
              variant: "destructive",
            })
            return
          }
          imageUrl = up.data
        }
        const { success, error } = await updatePopup(editingPopup.id, { ...basePopupData, image_url: imageUrl })
        if (success) {
          const { data } = await getPopups()
          if (data) setPopups(data)
          toast({ title: "수정 완료", description: "팝업이 성공적으로 수정되었습니다." })
        } else {
          toast({ title: "수정 실패", description: error || "팝업 수정 중 오류가 발생했습니다.", variant: "destructive" })
        }
      } else {
        // 신규: popup row 먼저 생성 → 실제 DB id 폴더로 이미지 업로드 → image_url 갱신
        const { success: createSuccess, data: created, error: createError } = await createPopup({
          ...basePopupData,
          image_url: null,
        })
        if (!createSuccess || !created) {
          toast({ title: "등록 실패", description: createError || "팝업 등록 중 오류가 발생했습니다.", variant: "destructive" })
          return
        }
        if (formData.imageBase64 && formData.imageContentType) {
          const up = await uploadPopupImage(created.id, formData.imageBase64, formData.imageContentType)
          if (up.success && up.data) {
            await updatePopup(created.id, { image_url: up.data })
          } else {
            toast({
              title: "이미지 업로드 실패",
              description: up.error || "팝업은 등록됐지만 이미지 업로드에 실패했습니다.",
              variant: "destructive",
            })
          }
        }
        const { data } = await getPopups()
        if (data) setPopups(data)
        toast({ title: "등록 완료", description: "새로운 팝업이 등록되었습니다." })
      }
    } catch (error) {
      console.error("Popup save error:", error)
      toast({ title: "오류 발생", description: "작업 처리 중 오류가 발생했습니다.", variant: "destructive" })
    } finally {
      setIsModalOpen(false)
      setEditingPopup(null)
    }
  }

  const handleDeletePopup = async () => {
    if (!deletingId) return

    toast({ title: "삭제 중...", description: "팝업을 삭제하는 중입니다." })

    try {
      const { success, error } = await deletePopup(deletingId)
      if (success) {
        const { data } = await getPopups()
        if (data) setPopups(data)
        toast({ title: "삭제 완료", description: "팝업이 삭제되었습니다." })
      } else {
        toast({ title: "삭제 실패", description: error || "팝업 삭제 중 오류가 발생했습니다.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Popup deletion error:", error)
      toast({ title: "오류 발생", description: "삭제 중 오류가 발생했습니다.", variant: "destructive" })
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-"
    return dateStr.split("T")[0]
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">팝업/배너 관리</h2>
          <div className="ml-auto">
            <Button onClick={() => handleOpenModal(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> 새 팝업 등록
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>팝업 목록</CardTitle>
            <CardDescription>등록된 팝업/배너 목록입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {popups.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">등록된 팝업이 없습니다.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>제목</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>우선순위</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {popups.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.image_url && <img src={item.image_url} alt="" className="h-8 w-8 rounded object-cover" />}
                          <span>{item.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.active}
                          onCheckedChange={() => handleToggleActive(item)}
                        />
                      </TableCell>
                      <TableCell>{item.priority}</TableCell>
                      <TableCell className="text-sm">
                        {item.start_date || item.end_date
                          ? `${formatDate(item.start_date)} ~ ${formatDate(item.end_date)}`
                          : "상시"}
                      </TableCell>
                      <TableCell>{item.created_at.split("T")[0]}</TableCell>
                      <TableCell>
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>작업</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setPreviewPopup(item)}>
                              <Eye className="mr-2 h-4 w-4" />
                              미리보기
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenModal(item)}>
                              <FileEdit className="mr-2 h-4 w-4" />
                              편집
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
            )}
          </CardContent>
        </Card>
      </div>

      <PopupFormModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSavePopup}
        popup={editingPopup}
      />

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 팝업이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePopup}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 팝업 미리보기 다이얼로그 */}
      <Dialog open={!!previewPopup} onOpenChange={() => setPreviewPopup(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-transparent border-none shadow-none">
          <div className="bg-white rounded-sm max-w-sm w-full mx-auto overflow-hidden shadow-2xl">
            {previewPopup?.image_url && (
              <img
                src={previewPopup.image_url}
                alt={previewPopup.title}
                className="w-full h-auto block"
              />
            )}
            {(previewPopup?.title || previewPopup?.content) && (
              <div className="p-5">
                {previewPopup?.title && (
                  <h3 className="text-lg font-medium text-gray-900">
                    {previewPopup.title}
                  </h3>
                )}
                {previewPopup?.content && (
                  <p className={`${previewPopup?.title ? "mt-2 " : ""}text-sm text-gray-600 leading-relaxed`}>
                    {previewPopup.content}
                  </p>
                )}
              </div>
            )}
            <div className="flex border-t text-sm">
              <button
                className="flex-1 py-3 text-gray-500 hover:bg-gray-50 transition-colors"
                onClick={() => setPreviewPopup(null)}
              >
                오늘 하루 보지 않기
              </button>
              <button
                className="flex-1 py-3 border-l text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                onClick={() => setPreviewPopup(null)}
              >
                닫기
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
