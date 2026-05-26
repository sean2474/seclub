"use client"

import { useState } from "react"
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
import { Input } from "@seclub/ui/input"
import { Label } from "@seclub/ui/label"
import { cn } from "@seclub/utils"
import { Loader2, PlusCircle, VideoIcon } from "lucide-react"
import { useYouTubePreview } from "../_hooks/use-youtube-preview"

export function AddVideoDialog({
  onAdd,
}: {
  onAdd: (title: string, url: string) => Promise<boolean>
}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { previewVideoId, checking, error: validationError } = useYouTubePreview(url)

  const handleAdd = async () => {
    if (!title.trim()) {
      setError("영상 제목을 입력해주세요.")
      return
    }
    if (!url.trim()) {
      setError("YouTube URL을 입력해주세요.")
      return
    }
    setError(null)
    const ok = await onAdd(title, url)
    if (ok) {
      setTitle("")
      setUrl("")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="영상 제목"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="youtube-url">URL</Label>
            <Input
              id="youtube-url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError(null)
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              className={cn(error && "border-destructive focus-visible:ring-destructive")}
            />
            {error && <p className="text-sm text-destructive -mt-1">{error}</p>}
            {validationError && (
              <p className="text-sm text-destructive -mt-1">{validationError}</p>
            )}
            {checking && (
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
            onClick={handleAdd}
            disabled={!previewVideoId || !title.trim() || checking || !!validationError}
          >
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
