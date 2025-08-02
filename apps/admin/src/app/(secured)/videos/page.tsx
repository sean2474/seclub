"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, PlusCircle, Trash2, Youtube, ExternalLink, PlayCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface VideoItem {
  id: string
  youtubeId: string
  title: string
  date: string
}

// Helper to extract YouTube ID from various URL formats
const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

const initialVideoItems: VideoItem[] = [
  {
    id: "v1",
    title: "캠핑장 드론 촬영 영상",
    youtubeId: "LXb3EKWsInQ",
    date: "2024-07-20",
  },
  {
    id: "v2",
    title: "여름맞이 계곡 소개",
    youtubeId: "3h0_v9QxGxA",
    date: "2024-07-18",
  },
  {
    id: "v3",
    title: "글램핑 A동 룸투어",
    youtubeId: "s_i5b0lJ_bI",
    date: "2024-07-15",
  },
  {
    id: "v4",
    title: "바베큐 파티 현장 스케치",
    youtubeId: "9bZkp7q19f0",
    date: "2024-07-12",
  },
]

export default function VideoGalleryPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<VideoItem[]>(initialVideoItems)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [urlError, setUrlError] = useState<string | null>(null)
  const [viewingVideoId, setViewingVideoId] = useState<string | null>(null)

  const handleAddVideo = () => {
    if (!videoTitle.trim()) {
      toast({
        title: "오류",
        description: "영상 제목을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    const videoId = getYouTubeId(youtubeUrl)
    if (!videoId) {
      setUrlError("유효하지 않은 YouTube URL입니다. 형식을 확인해주세요.")
      return
    }
    setUrlError(null)

    const newItem: VideoItem = {
      id: `v${Date.now()}`,
      youtubeId: videoId,
      title: videoTitle,
      date: new Date().toISOString().split("T")[0],
    }

    setItems((prev) => [newItem, ...prev])
    toast({
      title: "영상 추가 완료",
      description: "YouTube 영상이 목록에 추가되었습니다.",
    })
    setYoutubeUrl("")
    setVideoTitle("")
    setIsAddVideoDialogOpen(false)
  }

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelectedIds(checked ? items.map((item) => item.id) : [])
  }

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)))
  }

  const handleDelete = () => {
    if (deletingId) {
      setItems((prev) => prev.filter((item) => item.id !== deletingId))
      toast({ title: "삭제 완료", description: "영상이 삭제되었습니다." })
    }
    setDeletingId(null)
  }

  const handleBulkDelete = () => {
    if (isBulkDeleting) {
      setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
      toast({ title: "일괄 삭제 완료", description: `${selectedIds.length}개 영상이 삭제되었습니다.` })
      setSelectedIds([])
    }
    setIsBulkDeleting(false)
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">영상 갤러리 관리</h1>
          <div className="ml-auto">
            <Dialog open={isAddVideoDialogOpen} onOpenChange={setIsAddVideoDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> 새 영상 추가
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>YouTube 영상 추가</DialogTitle>
                  <DialogDescription>추가할 YouTube 영상의 제목과 URL을 입력하세요.</DialogDescription>
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
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddVideo}>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {items.map((item) => (
                <div key={item.id} className="relative group aspect-video">
                  <img
                    src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                    alt={`YouTube video thumbnail for ${item.title}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div
                    onClick={() => setViewingVideoId(item.youtubeId)}
                    className={cn(
                      "absolute inset-0 rounded-lg transition-all cursor-pointer flex items-center justify-center bg-black/20 group-hover:bg-black/50",
                      selectedIds.includes(item.id) && "ring-2 ring-primary ring-offset-2",
                    )}
                  >
                    <PlayCircle className="w-12 h-12 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1} />
                  </div>
                  <Checkbox
                    checked={selectedIds.includes(item.id)}
                    onCheckedChange={(checked) => handleSelect(item.id, !!checked)}
                    className="absolute top-3 left-3 h-5 w-5 bg-background/80 data-[state=checked]:bg-primary"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>작업</DropdownMenuLabel>
                        <DropdownMenuItem className="text-red-600" onClick={() => setDeletingId(item.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                    <p className="text-sm font-medium text-white truncate" title={item.title}>
                      {item.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-white/90 font-medium">{item.date}</p>
                      <a
                        href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white/90 hover:text-white transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Player Dialog */}
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
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>이 작업은 되돌릴 수 없습니다. 영상이 영구적으로 삭제됩니다.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleting} onOpenChange={setIsBulkDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 {selectedIds.length}개의 영상을 삭제하시겠습니까?</AlertDialogTitle>
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
