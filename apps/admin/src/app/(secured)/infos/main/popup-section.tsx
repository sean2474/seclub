"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Button } from "@seclub/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@seclub/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@seclub/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@seclub/ui/alert-dialog"
import { Switch } from "@seclub/ui/switch"
import { Eye, FileEdit, MoreHorizontal, PlusCircle, Trash2 } from "lucide-react"

import { Popup } from "@/types/popup"
import { usePopups } from "@/hooks/use-popups"
import { PopupFormModal } from "./popup-form-modal"
import { PopupPreviewDialog } from "./_components/popup-preview-dialog"
import { usePopupMutations } from "./_hooks/use-popup-mutations"

const formatDate = (dateStr: string | null) => (dateStr ? dateStr.split("T")[0] : "-")

export function PopupSection() {
  const { popups, setPopups } = usePopups()
  const { toggleActive, save, remove } = usePopupMutations(popups, setPopups)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [previewPopup, setPreviewPopup] = useState<Popup | null>(null)

  const handleOpenModal = (popup: Popup | null) => {
    setEditingPopup(popup)
    setIsModalOpen(true)
  }

  const handleSavePopup = async (formData: Parameters<typeof save>[0]) => {
    await save(formData, editingPopup)
    setIsModalOpen(false)
    setEditingPopup(null)
  }

  const handleDeletePopup = async () => {
    if (!deletingId) return
    await remove(deletingId)
    setDeletingId(null)
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
                          {item.image_url && (
                            <img src={item.image_url} alt="" className="h-8 w-8 rounded object-cover" />
                          )}
                          <span>{item.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.active}
                          onCheckedChange={() => toggleActive(item)}
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
                            <DropdownMenuItem
                              className="text-red-500"
                              onClick={() => setDeletingId(item.id)}
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

      <PopupPreviewDialog popup={previewPopup} onClose={() => setPreviewPopup(null)} />
    </>
  )
}
