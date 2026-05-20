"use client"

import { useEffect, useState } from "react"
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { Button } from "@seclub/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Checkbox } from "@seclub/ui/checkbox"
import { Label } from "@seclub/ui/label"
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
import { useToast } from "@seclub/ui/use-toast"
import { PlusCircle, Trash2 } from "lucide-react"
import {
  deleteGalleryRebornItem,
  deleteGalleryRebornItems,
  fetchGalleryRebornItems,
  reorderGalleryRebornItems,
  updateGalleryRebornItem,
  uploadGalleryRebornItems,
} from "@/lib/action/gallery-reborn"
import type {
  GalleryRebornItem,
  GalleryRebornUpdatePatch,
  GalleryRebornUploadInput,
} from "@/types/gallery-reborn"
import { SortableCard } from "./_components/sortable-card"
import { EditDialog } from "./_components/edit-dialog"
import { UploadDialog } from "./_components/upload-dialog"

export default function GalleryRebornPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<GalleryRebornItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingItem, setEditingItem] = useState<GalleryRebornItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const load = async () => {
    setIsLoading(true)
    const { items, error } = await fetchGalleryRebornItems()
    if (error) {
      toast({
        title: "불러오기 오류",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setItems(items)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpload = async (inputs: GalleryRebornUploadInput[]) => {
    setUploadProgress(10)
    const tick = setInterval(() => {
      setUploadProgress((p) => (p === null || p >= 90 ? p : p + 10))
    }, 250)
    const { uploadedItems, error } = await uploadGalleryRebornItems(inputs)
    clearInterval(tick)
    setUploadProgress(100)
    if (uploadedItems.length > 0) {
      setItems((prev) => [...prev, ...uploadedItems])
    }
    if (error) {
      toast({
        title: "업로드 오류",
        description:
          uploadedItems.length > 0
            ? `${uploadedItems.length}장 성공 / 일부 실패: ${error.message}`
            : error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "업로드 완료",
        description: `${uploadedItems.length}장 추가되었습니다.`,
      })
      setUploadOpen(false)
    }
    setTimeout(() => setUploadProgress(null), 400)
  }

  const handleEditSave = async (id: string, patch: GalleryRebornUpdatePatch) => {
    const { success, error } = await updateGalleryRebornItem(id, patch)
    if (!success) {
      toast({
        title: "저장 오류",
        description: error?.message || "수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      return
    }
    toast({ title: "저장 완료" })
    await load()
  }

  const handleDelete = async () => {
    if (!deletingId) return
    const target = items.find((i) => i.id === deletingId)
    const id = deletingId
    setDeletingId(null)
    if (!target) return
    setItems((prev) => prev.filter((i) => i.id !== id))
    const { success, error } = await deleteGalleryRebornItem(id)
    if (!success) {
      toast({
        title: "삭제 오류",
        description: error?.message || "삭제 실패",
        variant: "destructive",
      })
      setItems((prev) => [...prev, target].sort((a, b) => a.displayOrder - b.displayOrder))
    } else {
      toast({ title: "삭제 완료" })
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    const ids = [...selectedIds]
    setBulkDeleting(false)
    const removed = items.filter((i) => ids.includes(i.id))
    setItems((prev) => prev.filter((i) => !ids.includes(i.id)))
    setSelectedIds([])
    const { success, error } = await deleteGalleryRebornItems(ids)
    if (!success) {
      toast({
        title: "일괄 삭제 오류",
        description: error?.message || "일부 항목 삭제 실패",
        variant: "destructive",
      })
      setItems((prev) => [...prev, ...removed].sort((a, b) => a.displayOrder - b.displayOrder))
    } else {
      toast({ title: "삭제 완료", description: `${ids.length}개 항목 삭제됨` })
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return
    const previous = items
    const reordered = arrayMove(items, oldIndex, newIndex).map((it, idx) => ({
      ...it,
      displayOrder: idx,
    }))
    setItems(reordered)
    const { success, error } = await reorderGalleryRebornItems(reordered.map((it) => it.id))
    if (!success) {
      toast({
        title: "순서 저장 오류",
        description: error?.message || "다시 시도해주세요.",
        variant: "destructive",
      })
      setItems(previous)
    }
  }

  const allSelected = items.length > 0 && selectedIds.length === items.length

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">환생 갤러리 관리</h1>
          <div className="ml-auto">
            <Button onClick={() => setUploadOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> 새 작품 추가
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>작품 목록</CardTitle>
              <CardDescription>
                {selectedIds.length > 0
                  ? `${selectedIds.length}개 선택됨`
                  : `${items.length}개의 작품이 있습니다. 카드를 드래그하여 전시 순서를 변경하세요.`}
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="reborn-select-all"
                  checked={
                    allSelected
                      ? true
                      : selectedIds.length > 0
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={(c) =>
                    setSelectedIds(c ? items.map((i) => i.id) : [])
                  }
                />
                <Label htmlFor="reborn-select-all" className="whitespace-nowrap">전체 선택</Label>
              </div>
              <div className="flex items-center gap-2 md:border-l md:pl-4">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setBulkDeleting(true)}
                  disabled={selectedIds.length === 0}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> 선택 삭제
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">불러오는 중...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                등록된 작품이 없습니다. 새 작품을 추가하세요.
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items.map((i) => i.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map((item) => (
                      <SortableCard
                        key={item.id}
                        item={item}
                        selected={selectedIds.includes(item.id)}
                        onToggleSelect={(checked) =>
                          setSelectedIds((prev) =>
                            checked ? [...prev, item.id] : prev.filter((id) => id !== item.id),
                          )
                        }
                        onEdit={() => setEditingItem(item)}
                        onRequestDelete={() => setDeletingId(item.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>

      <UploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSubmit={handleUpload}
        uploadProgress={uploadProgress}
      />

      <EditDialog
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleEditSave}
      />

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이 작품을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              되돌릴 수 없으며, Storage 의 이미지 파일도 함께 제거됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleting} onOpenChange={setBulkDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedIds.length}개 작품을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              되돌릴 수 없으며, Storage 의 이미지 파일들도 함께 제거됩니다.
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
