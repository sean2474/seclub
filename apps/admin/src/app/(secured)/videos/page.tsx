"use client"

import { useState, useEffect } from "react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Checkbox } from "@seclub/ui/checkbox"
import { Input } from "@seclub/ui/input"
import { PlusCircle, Trash2, ExternalLink, PlayCircle, Grip, Edit, Check, X, ChevronUp, ChevronDown, Loader2, VideoIcon } from "lucide-react"
import { useToast } from "@seclub/ui/use-toast"
import { cn } from "@seclub/utils"
import { Label } from "@seclub/ui/label"
import { fetchVideos, addVideo, updateVideo, deleteVideo, updateVideoOrder, getLastVideoOrder, extractYouTubeId } from "@/lib/action/video"
import { Video } from "@/lib/action/video"

// YouTube 비디오 ID가 유효한지 확인하는 함수
async function validateYouTubeId(videoId: string): Promise<boolean> {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    // 응답 상태가 200이면 비디오가 존재함
    return response.status === 200;
  } catch (error) {
    console.error("YouTube 비디오 확인 오류:", error);
    return false;
  }
}

interface VideoItem {
  id: string
  youtubeId: string
  title: string
  created_at: string
  order: number
}

// Helper to convert Video from backend to VideoItem for frontend
const videoToVideoItem = (video: Video): VideoItem => {
  return {
    id: video.id,
    youtubeId: video.link,
    title: video.title,
    created_at: video.created_at,
    order: video.order
  };
}

export default function VideoGalleryPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [isAddVideoDialogOpen, setIsAddVideoDialogOpen] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [videoTitle, setVideoTitle] = useState("")
  const [urlError, setUrlError] = useState<string | null>(null)
  const [previewVideoId, setPreviewVideoId] = useState<string | null>(null)
  const [viewingVideoId, setViewingVideoId] = useState<string | null>(null)
  const [reordering, setReordering] = useState(false)
  const [checkingVideo, setCheckingVideo] = useState(false)
  const [videoValidationError, setVideoValidationError] = useState<string | null>(null)
  
  // 편집 관련 상태
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const [editUrlError, setEditUrlError] = useState<string | null>(null)

  // 비디오 데이터 로드
  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const { videos, error } = await fetchVideos();
        if (error) {
          toast({
            title: "비디오 로드 실패",
            description: error.message,
            variant: "destructive",
          });
        } else {
          // Videos를 VideoItem으로 변환
          const videoItems = videos.map(videoToVideoItem);
          // order 기준으로 정렬
          videoItems.sort((a, b) => a.order - b.order);
          setItems(videoItems);
        }
      } catch (error) {
        console.error("Error loading videos:", error);
        toast({
          title: "비디오 로드 실패",
          description: "비디오를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [toast]);

  const handleAddVideo = async () => {
    if (!videoTitle.trim()) {
      toast({
        title: "오류",
        description: "영상 제목을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!youtubeUrl.trim()) {
      setUrlError("YouTube URL을 입력해주세요.");
      return;
    }
    setUrlError(null);

    try {
      // 마지막 순서 번호 가져오기
      const { order: lastOrder } = await getLastVideoOrder();
      
      // 비디오 추가
      const { video, error } = await addVideo({
        title: videoTitle,
        link: youtubeUrl,
        order: lastOrder + 1
      });

      if (error) {
        toast({
          title: "영상 추가 실패",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (video) {
        // 새 비디오를 목록에 추가
        setItems((prev) => [...prev, videoToVideoItem(video)].sort((a, b) => a.order - b.order));

        toast({
          title: "영상 추가 완료",
          description: "YouTube 영상이 목록에 추가되었습니다.",
        });
      }

      // 입력 필드 초기화
      setYoutubeUrl("");
      setVideoTitle("");
      setPreviewVideoId(null);
      setIsAddVideoDialogOpen(false);
    } catch (error) {
      console.error("Error adding video:", error);
      toast({
        title: "영상 추가 실패",
        description: "영상을 추가하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  }

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelectedIds(checked ? items.map((item) => item.id) : [])
  }

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)))
  }

  const handleDelete = async () => {
    if (deletingId) {
      try {
        const { success, error } = await deleteVideo(deletingId);
        if (error) {
          toast({ 
            title: "삭제 실패", 
            description: error.message,
            variant: "destructive"
          });
        } else if (success) {
          setItems((prev) => prev.filter((item) => item.id !== deletingId));
          toast({ title: "삭제 완료", description: "영상이 삭제되었습니다." });
        }
      } catch (error) {
        console.error("Error deleting video:", error);
        toast({ 
          title: "삭제 실패", 
          description: "영상을 삭제하는 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      }
    }
    setDeletingId(null);
  }

  const handleBulkDelete = async () => {
    if (isBulkDeleting) {
      try {
        const deletePromises = selectedIds.map(id => deleteVideo(id));
        const results = await Promise.all(deletePromises);
        
        // 실패한 삭제가 있는지 확인
        const hasErrors = results.some(result => result.error);
        
        if (hasErrors) {
          toast({ 
            title: "일부 삭제 실패", 
            description: "일부 영상을 삭제하는 중 문제가 발생했습니다.",
            variant: "destructive"
          });
        } else {
          setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
          toast({ title: "일괄 삭제 완료", description: `${selectedIds.length}개 영상이 삭제되었습니다.` });
        }
        setSelectedIds([]);
      } catch (error) {
        console.error("Error bulk deleting videos:", error);
        toast({ 
          title: "일괄 삭제 실패", 
          description: "영상을 삭제하는 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      }
    }
    setIsBulkDeleting(false);
  }
  
  // 편집 시작
  const startEditing = (item: VideoItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditUrl(item.youtubeId.startsWith('http') ? item.youtubeId : `https://www.youtube.com/watch?v=${item.youtubeId}`);
    setEditUrlError(null);
  };
  
  // 편집 취소
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditUrl("");
    setEditUrlError(null);
  };
  
  // 편집 저장
  const saveEditing = async () => {
    if (!editingId) return;
    
    if (!editTitle.trim()) {
      toast({
        title: "제목 오류",
        description: "제목을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    // 유튜브 URL에서 ID 추출 또는 입력된 URL 사용
    let videoLink = editUrl;
    const youtubeId = extractYouTubeId(editUrl);
    if (!youtubeId && !editUrl.trim()) {
      setEditUrlError("유효한 YouTube URL을 입력하거나 직접 영상 ID를 입력해주세요.");
      return;
    }
    
    try {
      // 업데이트 호출
      const { video, error } = await updateVideo(editingId, {
        title: editTitle,
        link: youtubeId || videoLink
      });
      
      if (error) {
        toast({
          title: "업데이트 실패",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      if (video) {
        // 항목 업데이트
        setItems(prev => prev.map(item => 
          item.id === editingId 
            ? videoToVideoItem(video)
            : item
        ));
        
        toast({
          title: "영상 업데이트 완료",
          description: "영상 정보가 성공적으로 업데이트되었습니다.",
        });
      }
      
      // 편집 모드 종료
      cancelEditing();
    } catch (error) {
      console.error("Error updating video:", error);
      toast({
        title: "업데이트 실패",
        description: "영상 정보를 업데이트하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };
  
  // 순서 변경 함수
  const moveVideo = async (id: string, direction: "up" | "down") => {
    const currentIndex = items.findIndex(item => item.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    
    const updatedItems = [...items];
    const currentItem = { ...updatedItems[currentIndex] };
    const targetItem = { ...updatedItems[newIndex] };
    
    // 순서 교환
    const tempOrder = currentItem.order;
    currentItem.order = targetItem.order;
    targetItem.order = tempOrder;
    
    // 배열에서 아이템 위치 교환
    updatedItems[currentIndex] = targetItem;
    updatedItems[newIndex] = currentItem;
    
    // 상태 업데이트
    setItems(updatedItems);
    
    try {
      // 백엔드에 순서 변경 저장
      const { success, error } = await updateVideoOrder([
        { id: currentItem.id, order: currentItem.order },
        { id: targetItem.id, order: targetItem.order }
      ]);
      
      if (error) {
        toast({
          title: "순서 변경 실패",
          description: error.message,
          variant: "destructive"
        });
        // 실패시 원래 상태로 되돌림
        setItems([...items]);
      }
    } catch (error) {
      console.error("Error updating video order:", error);
      toast({
        title: "순서 변경 실패",
        description: "영상 순서를 변경하는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
      // 실패시 원래 상태로 되돌림
      setItems([...items]);
    }
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
                      onChange={async (e) => {
                        setYoutubeUrl(e.target.value)
                        if (urlError) setUrlError(null)
                        if (videoValidationError) setVideoValidationError(null)
                        
                        // YouTube ID 추출 시도
                        try {
                          const videoId = extractYouTubeId(e.target.value);
                          if (videoId) {
                            // 비디오 ID 유효성 검사 시작
                            setCheckingVideo(true);
                            setPreviewVideoId(null); // 검사 중에는 미리보기 숨김
                            
                            const isValid = await validateYouTubeId(videoId);
                            
                            if (isValid) {
                              setPreviewVideoId(videoId);
                              setVideoValidationError(null);
                            } else {
                              setPreviewVideoId(null);
                              setVideoValidationError("존재하지 않는 YouTube 영상입니다.");
                            }
                            setCheckingVideo(false);
                          } else {
                            setPreviewVideoId(null);
                          }
                        } catch (err) {
                          setPreviewVideoId(null);
                          setCheckingVideo(false);
                        }
                      }}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className={cn(urlError && "border-destructive focus-visible:ring-destructive")}
                    />
                    {urlError && <p className="text-sm text-destructive -mt-1">{urlError}</p>}
                    {videoValidationError && <p className="text-sm text-destructive -mt-1">{videoValidationError}</p>}
                    {checkingVideo && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>YouTube 영상 확인 중...</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 미리보기 영역 */}
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
                        ></iframe>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddVideo} disabled={!previewVideoId || !videoTitle.trim() || checkingVideo || !!videoValidationError}>
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
                    className={cn("relative group flex border rounded-md h-32 justify-end", reordering && "justify-between")}
                  >
                    {/* 순서 표시 */}
                    <div className={cn("transition-all duration-300 absolute top-2 left-2 bg-black/70 text-white rounded px-2 py-1 text-xs font-medium z-10", reordering && "translate-x-12")}>
                      {index + 1}
                    </div>
                    
                    {/* 순서 변경 버튼 영역 (왼쪽) */}
                    {reordering && (
                      <div className="flex flex-col justify-center border-r px-2 bg-muted/10">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 mb-1"
                          onClick={() => moveVideo(item.id, "up")} 
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => moveVideo(item.id, "down")} 
                          disabled={index === items.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    <div className={cn("flex gap-2 absolute transition-all duration-300 w-full", reordering && "translate-x-12")}>
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
                            selectedIds.includes(item.id) && "ring-2 ring-primary ring-offset-1"
                          )}
                        >
                          <PlayCircle className="w-12 h-12 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1} />
                        </div>
                        <Checkbox
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={(checked) => handleSelect(item.id, !!checked)}
                          className="absolute top-3 right-3 h-5 w-5 bg-background/80 data-[state=checked]:bg-primary cursor-pointer"
                        />
                      </div>
                      
                      {/* 내용 영역 */}
                      <div className="flex flex-1 items-center justify-between gap-4">
                        {editingId === item.id ? (
                          <div className="flex-1 space-y-3 grid grid-cols-2">
                            {/* 편집 모드 UI */}
                            <div>
                              <div>
                                <Label htmlFor="edit-title" className="sr-only">제목</Label>
                                <Input
                                  id="edit-title"
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  placeholder="영상 제목"
                                  className="w-full mb-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-url" className="sr-only">URL</Label>
                                <Input
                                  id="edit-url"
                                  value={editUrl}
                                  onChange={(e) => {
                                    setEditUrl(e.target.value);
                                    if (editUrlError) setEditUrlError(null);
                                  }}
                                  placeholder="YouTube URL 또는 영상 ID"
                                  className={cn(editUrlError && "border-destructive focus-visible:ring-destructive")}
                                />
                                {editUrlError && <p className="text-sm text-destructive mt-1">{editUrlError}</p>}
                              </div>
                            </div>
                            <div className={cn("flex justify-end gap-2 mt-2 px-4 transition-all duration-300", reordering && "-translate-x-12")}>
                              <Button variant="ghost" size="sm" onClick={cancelEditing}>
                                <X className="h-4 w-4 mr-1" /> 취소
                              </Button>
                              <Button variant="default" size="sm" onClick={saveEditing}>
                                <Check className="h-4 w-4 mr-1" /> 저장
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 cursor-pointer h-32 flex flex-col justify-center p-4" onClick={() => editingId !== item.id && handleSelect(item.id, !selectedIds.includes(item.id))}>
                            {/* 일반 보기 모드 UI */}
                            <h3 className="font-medium" title={item.title}>{item.title}</h3>
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
                      {/* 액션 버튼 영역 */}
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
