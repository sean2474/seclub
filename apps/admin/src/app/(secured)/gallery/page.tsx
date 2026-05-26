"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Button } from "@seclub/ui/button"
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
import { Checkbox } from "@seclub/ui/checkbox"
import { PlusCircle, Trash2 } from "lucide-react"
import { Label } from "@seclub/ui/label"

import { useGallery } from "./_hooks/use-gallery"
import { UploadCard } from "./_components/upload-card"
import { GalleryGrid } from "./_components/gallery-grid"

const FILE_INPUT_ID = "file-upload"

export default function GalleryPage() {
  const { items, isLoading, uploadProgress, beginUpload, remove, removeMany } = useGallery()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelectedIds(checked ? items.map((i) => i.id) : [])
  }

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((i) => i !== id)))
  }

  const handleDelete = async () => {
    if (deletingId) await remove(deletingId)
    setDeletingId(null)
  }

  const handleBulkDelete = async () => {
    if (isBulkDeleting && selectedIds.length > 0) {
      const ok = await removeMany(selectedIds)
      if (ok) setSelectedIds([])
    }
    setIsBulkDeleting(false)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">갤러리 관리</h1>
          <div className="ml-auto">
            <Button onClick={() => document.getElementById(FILE_INPUT_ID)?.click()}>
              <PlusCircle className="mr-2 h-4 w-4" /> 새 이미지 추가
            </Button>
            <input
              type="file"
              id={FILE_INPUT_ID}
              className="hidden"
              accept="image/*"
              onChange={beginUpload}
              multiple
            />
          </div>
        </div>

        <UploadCard uploadProgress={uploadProgress} inputId={FILE_INPUT_ID} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>이미지 목록</CardTitle>
              <CardDescription>
                {selectedIds.length > 0
                  ? `${selectedIds.length}개 이미지 선택됨`
                  : `${items.length}개의 이미지가 있습니다.`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={
                    selectedIds.length === items.length && items.length > 0
                      ? true
                      : selectedIds.length > 0
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all">전체 선택</Label>
              </div>
              <div className="flex items-center gap-2 border-l pl-4">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setIsBulkDeleting(true)}
                  disabled={selectedIds.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  선택 삭제
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <GalleryGrid
              items={items}
              isLoading={isLoading}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onRequestDelete={setDeletingId}
            />
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 이미지가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleting} onOpenChange={setIsBulkDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              정말로 {selectedIds.length}개의 이미지를 삭제하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 선택된 이미지들이 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
