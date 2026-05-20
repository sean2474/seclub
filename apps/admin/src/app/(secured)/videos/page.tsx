"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@seclub/ui/card"
import { Button } from "@seclub/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Input } from "@seclub/ui/input"
import {
  PlusCircle,
  Trash2,
  ExternalLink,
  PlayCircle,
  Grip,
  Edit,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Loader2,
  VideoIcon,
} from "lucide-react"
import { cn } from "@seclub/utils"
import { Label } from "@seclub/ui/label"
import { extractYouTubeId } from "@/lib/client/video"
import { useVideos, type VideoItem } from "./_hooks/use-videos"
import { useYouTubePreview } from "./_hooks/use-youtube-preview"

export default function VideoGalleryPage() {
  const { items, loading, add, remove, removeMany, save, move } = useVideos()

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [urlError, setUrlError] = useState<string | null>(null)
  const [viewingVideoId, setViewingVideoId] = useState<string | null>(null)
  const [reordering, setReordering] = useState(false)

  const {
    previewVideoId,
    checking: checkingVideo,
    error: videoValidationError,
  } = useYouTubePreview(youtubeUrl)

  // 편집 관련 상태
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const [editUrlError, setEditUrlError] = useState<string | null>(null)

  const handleAddVideo = async () => {
    if (!videoTitle.trim()) {
      setUrlError("영상 제목을 입력해주세요.")
      return
    }
    if (!youtubeUrl.trim()) {
      setUrlError("YouTube URL을 입력해주세요.")
      return
    }
    setUrlError(null)
    const ok = await add(videoTitle, youtubeUrl)
    if (ok) {
      setYoutubeUrl("")
      setVideoTitle("")
      setIsAddVideoDialogOpen(false)
    }
  }

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

  const startEditing = (item: VideoItem) => {
    setEditingId(item.id)
    setEditTitle(item.title)
    setEditUrl(
      item.youtubeId.startsWith("http")
        ? item.youtubeId
        : `https://www.youtube.com/watch?v=${item.youtubeId}`,
    )
    setEditUrlError(null)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle("")
    setEditUrl("")
    setEditUrlError(null)
  }

  const saveEditing = async () => {
    if (!editingId) return
    if (!editTitle.trim()) {
      setEditUrlError("제목을 입력해주세요.")
      return
    }
    if (!editUrl.trim() && !extractYouTubeId(editUrl)) {
      setEditUrlError("유효한 YouTube URL을 입력하거나 직접 영상 ID를 입력해주세요.")
      return
    }
    const ok = await save(editingId, editTitle, editUrl)
    if (ok) cancelEditing()
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
            <Dialog open={isAddVideoDialogOpen} onOpenChange={setIsAddVideoDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> 새 영상 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>YouTube 영상 추가</DialogTitle>
                  <DialogDescription>
                    추가할 YouTube 영상의 제목과 URL을 입력하세요.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="video-title">제목</Label>
                    <Input
                      id="video-title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="영상 제목"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="youtube-url">URL</Label>
                    <Input
                      id="youtube-url"
                      value={youtubeUrl}
                      onChange={(e) => {
                        setYoutubeUrl(e.target.value)
                        if (urlError) setUrlError(null)
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className={cn(urlError && "border-destructive focus-visible:ring-destructive")}
                    />
                    {urlError && <p className="text-sm text-destructive -mt-1">{urlError}</p>}
                    {videoValidationError && (
                      <p className="text-sm text-destructive -mt-1">{videoValidationError}</p>
                    )}
                    {checkingVideo && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>YouTube 영상 확인 중...</span>
                      </div>
                    )}
                  </div>

                  {previewVideoId && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <VideoIcon className="h-4 w-4 text-red-600" /> 미리보기
                      </h3>
                      <div className="aspect-video w-full border rounded-md overflow-hidden">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${previewVideoId}`}
                          title="YouTube video preview"
                          frameBorder="0"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleAddVideo}
                    disabled={
                      !previewVideoId || !videoTitle.trim() || checkingVideo || !!videoValidationError
                    }
                  >
                    추가
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                  <div
                    key={item.id}
                    className={cn(
                      "relative group flex border rounded-md h-32 justify-end",
                      reordering && "justify-between",
                    )}
                  >
                    <div
                      className={cn(
                        "transition-all duration-300 absolute top-2 left-2 bg-black/70 text-white rounded px-2 py-1 text-xs font-medium z-10",
                        reordering && "translate-x-12",
                      )}
                    >
                      {index + 1}
                    </div>

                    {reordering && (
                      <div className="flex flex-col justify-center border-r px-2 bg-muted/10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 mb-1"
                          onClick={() => move(item.id, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => move(item.id, "down")}
                          disabled={index === items.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <div
                      className={cn(
                        "flex gap-2 absolute transition-all duration-300 w-full",
                        reordering && "translate-x-12",
                      )}
                    >
                      <div className="flex-shrink-0 w-48 h-32 relative">
                        <img
                          src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                          alt={`YouTube video thumbnail for ${item.title}`}
                          className="w-full h-full object-cover"
                        />
                        <div
                          onClick={() => setViewingVideoId(item.youtubeId)}
                          className={cn(
                            "absolute inset-0 cursor-pointer flex items-center justify-center bg-black/20 group-hover:bg-black/50",
                            selectedIds.includes(item.id) && "ring-2 ring-primary ring-offset-1",
                          )}
                        >
                          <PlayCircle
                            className="w-12 h-12 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                            strokeWidth={1}
                          />
                        </div>
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={(checked) => handleSelect(item.id, !!checked)}
                          className="absolute top-3 right-3 h-5 w-5 bg-background/80 data-[state=checked]:bg-primary cursor-pointer"
                        />
                      </div>

                      <div className="flex flex-1 items-center justify-between gap-4">
                        {editingId === item.id ? (
                          <div className="flex-1 space-y-3 grid grid-cols-2">
                            <div>
                              <Label htmlFor="edit-title" className="sr-only">제목</Label>
                              <Input
                                id="edit-title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="영상 제목"
                                className="w-full mb-2"
                              />
                              <Label htmlFor="edit-url" className="sr-only">URL</Label>
                              <Input
                                id="edit-url"
                                value={editUrl}
                                onChange={(e) => {
                                  setEditUrl(e.target.value)
                                  if (editUrlError) setEditUrlError(null)
                                }}
                                placeholder="YouTube URL 또는 영상 ID"
                                className={cn(
                                  editUrlError && "border-destructive focus-visible:ring-destructive",
                                )}
                              />
                              {editUrlError && (
                                <p className="text-sm text-destructive mt-1">{editUrlError}</p>
                              )}
                            </div>
                            <div
                              className={cn(
                                "flex justify-end gap-2 mt-2 px-4 transition-all duration-300",
                                reordering && "-translate-x-12",
                              )}
                            >
                              <Button variant="ghost" size="sm" onClick={cancelEditing}>
                                <X className="h-4 w-4 mr-1" /> 취소
                              </Button>
                              <Button variant="default" size="sm" onClick={saveEditing}>
                                <Check className="h-4 w-4 mr-1" /> 저장
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="flex-1 cursor-pointer h-32 flex flex-col justify-center p-4"
                            onClick={() =>
                              editingId !== item.id &&
                              handleSelect(item.id, !selectedIds.includes(item.id))
                            }
                          >
                            <h3 className="font-medium" title={item.title}>
                              {item.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span>생성일: {new Date(item.created_at).toLocaleDateString()}</span>
                              <a
                                href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-blue-600 hover:underline"
                              >
                                <ExternalLink className="h-3.5 w-3.5" /> 유튜브 바로가기
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {editingId !== item.id && (
                      <div className="flex items-center gap-2 relative z-50 mr-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => startEditing(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setDeletingId(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </div>
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
