"use client"

import { useState, useMemo, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
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
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, Upload, VideoIcon, Trash2, Eye, EyeOff, PlayCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type VideoStatus = "Published" | "Unpublished"

interface VideoItem {
  id: string
  title: string
  date: string
  status: VideoStatus
  file?: File
}

const initialVideoItems: VideoItem[] = [
  { id: "v1", title: "캠핑장 드론 촬영 영상", date: "2024-07-20", status: "Published" },
  { id: "v2", title: "여름맞이 계곡 소개", date: "2024-07-18", status: "Published" },
  { id: "v3", title: "글램핑 A동 룸투어", date: "2024-07-15", status: "Unpublished" },
  { id: "v4", title: "바베큐 파티 현장 스케치", date: "2024-07-12", status: "Published" },
]

export default function VideoGalleryPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<VideoItem[]>(initialVideoItems)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const filteredItems = useMemo(() => {
    if (activeTab === "all") return items
    const status = activeTab === "published" ? "Published" : "Unpublished"
    return items.filter((item) => item.status === status)
  }, [items, activeTab])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setUploadProgress(0)

    const newVideoItem: VideoItem = {
      id: `v${Date.now()}`,
      title: file.name,
      date: new Date().toISOString().split("T")[0],
      status: "Unpublished",
      file: file,
    }

    let progress = 0
    const interval = setInterval(() => {
      progress += 20
      setUploadProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setItems((prev) => [newVideoItem, ...prev])
        setTimeout(() => setUploadProgress(null), 500)
        toast({ title: "업로드 완료", description: `${file.name} 영상이 추가되었습니다.` })
      }
    }, 200)
  }

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelectedIds(checked ? filteredItems.map((item) => item.id) : [])
  }

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)))
  }

  const handleUpdateStatus = (ids: string[], status: VideoStatus) => {
    setItems((prev) => prev.map((item) => (ids.includes(item.id) ? { ...item, status } : item)))
    toast({ title: "상태 변경 완료", description: `${ids.length}개 영상의 상태가 변경되었습니다.` })
    setSelectedIds([])
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
            <Button onClick={() => document.getElementById("video-upload")?.click()}>
              <PlusCircle className="mr-2 h-4 w-4" /> 새 영상 추가
            </Button>
            <input type="file" id="video-upload" className="hidden" accept="video/*" onChange={handleFileChange} />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>영상 업로드</CardTitle>
            <CardDescription>영상을 드래그 앤 드롭하거나 파일을 선택하여 업로드하세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <label
              htmlFor="video-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                </p>
                <p className="text-xs text-muted-foreground">MP4, MOV, AVI</p>
              </div>
            </label>
            {uploadProgress !== null && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center mt-2 text-muted-foreground">업로드 중... {uploadProgress}%</p>
              </div>
            )}
          </CardContent>
        </Card>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="published">공개</TabsTrigger>
            <TabsTrigger value="unpublished">비공개</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>영상 목록</CardTitle>
                  <CardDescription>
                    {selectedIds.length > 0
                      ? `${selectedIds.length}개 영상 선택됨`
                      : `${filteredItems.length}개의 영상이 있습니다.`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedIds.length === filteredItems.length && filteredItems.length > 0
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
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedIds, "Published")}
                      disabled={selectedIds.length === 0}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      선택 공개
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(selectedIds, "Unpublished")}
                      disabled={selectedIds.length === 0}
                    >
                      <EyeOff className="mr-2 h-4 w-4" />
                      선택 숨김
                    </Button>
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
                  {filteredItems.map((item) => (
                    <div key={item.id} className="relative group aspect-video">
                      <div className="w-full h-full rounded-lg bg-muted flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-muted-foreground" strokeWidth={1} />
                      </div>
                      <div
                        onClick={() => handleSelect(item.id, !selectedIds.includes(item.id))}
                        className={cn(
                          "absolute inset-0 rounded-lg transition-all cursor-pointer",
                          selectedIds.includes(item.id)
                            ? "ring-2 ring-primary ring-offset-2"
                            : "group-hover:bg-black/50",
                        )}
                      />
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
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <VideoIcon className="mr-2 h-4 w-4" />
                                상태 변경
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem onClick={() => handleUpdateStatus([item.id], "Published")}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    공개로 변경
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUpdateStatus([item.id], "Unpublished")}>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    비공개로 변경
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => setDeletingId(item.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-2 bg-linear-to-t from-black/80 to-transparent rounded-b-lg">
                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant={item.status === "Published" ? "default" : "secondary"}>
                            {item.status === "Published" ? "공개" : "비공개"}
                          </Badge>
                          <p className="text-xs text-white/90 font-medium">{item.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

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
