"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Button } from "@seclub/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@seclub/ui/dialog"
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
import { Grip, Trash2 } from "lucide-react"
import { Label } from "@seclub/ui/label"
import { useVideos } from "./_hooks/use-videos"
import { useVideoEdit } from "./_hooks/use-video-edit"
import { AddVideoDialog } from "./_components/add-video-dialog"
import { VideoRow } from "./_components/video-row"

export default function VideoGalleryPage() {
  const { items, loading, add, remove, removeMany, save, move } = useVideos()
  const edit = useVideoEdit(save)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [viewingVideoId, setViewingVideoId] = useState<string | null>(null)
  const [reordering, setReordering] = useState(false)

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelectedIds(checked ? items.map((item) => item.id) : [])
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
      await removeMany(selectedIds)
      setSelectedIds([])
    }
    setIsBulkDeleting(false)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">영상 갤러리 관리</h1>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              onClick={() => setReordering(!reordering)}
              className={reordering ? "bg-muted" : ""}
            >
              <Grip className="mr-2 h-4 w-4" /> {reordering ? "순서변경 완료" : "순서변경"}
            </Button>
            <AddVideoDialog onAdd={add} />
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>영상 목록</CardTitle>
              <CardDescription>
                {selectedIds.length > 0
                  ? `${selectedIds.length}개 영상 선택됨`
                  : `${items.length}개의 영상이 있습니다.`}
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
            {loading ? (
              <div className="flex justify-center py-8">
                <p>비디오를 불러오는 중...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex justify-center py-8">
                <p>등록된 비디오가 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                  <VideoRow
                    key={item.id}
                    item={item}
                    index={index}
                    total={items.length}
                    reordering={reordering}
                    selected={selectedIds.includes(item.id)}
                    editing={edit.editingId === item.id}
                    editTitle={edit.title}
                    editUrl={edit.url}
                    editUrlError={edit.error}
                    onSelect={(checked) => handleSelect(item.id, checked)}
                    onPlay={() => setViewingVideoId(item.youtubeId)}
                    onMoveUp={() => move(item.id, "up")}
                    onMoveDown={() => move(item.id, "down")}
                    onStartEdit={() => edit.start(item)}
                    onCancelEdit={edit.cancel}
                    onSaveEdit={edit.commit}
                    onEditTitleChange={edit.setTitle}
                    onEditUrlChange={edit.setUrl}
                    onRequestDelete={() => setDeletingId(item.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!viewingVideoId} onOpenChange={() => setViewingVideoId(null)}>
        <DialogHeader className="hidden">
          <DialogTitle>영상 재생</DialogTitle>
        </DialogHeader>
        <DialogContent className="max-w-3xl p-0">
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${viewingVideoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 영상이 영구적으로 삭제됩니다.
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
              정말로 {selectedIds.length}개의 영상을 삭제하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 선택된 영상들이 영구적으로 삭제됩니다.
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
