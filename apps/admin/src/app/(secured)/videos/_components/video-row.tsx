"use client"

import { Button } from "@seclub/ui/button"
import { Checkbox } from "@seclub/ui/checkbox"
import { Input } from "@seclub/ui/input"
import { Label } from "@seclub/ui/label"
import { cn } from "@seclub/utils"
import {
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  ExternalLink,
  PlayCircle,
  Trash2,
  X,
} from "lucide-react"
import type { VideoItem } from "../_hooks/use-videos"

interface VideoRowProps {
  item: VideoItem
  index: number
  total: number
  reordering: boolean
  selected: boolean
  editing: boolean
  editTitle: string
  editUrl: string
  editUrlError: string | null
  onSelect: (checked: boolean) => void
  onPlay: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: () => void
  onEditTitleChange: (value: string) => void
  onEditUrlChange: (value: string) => void
  onRequestDelete: () => void
}

export function VideoRow({
  item,
  index,
  total,
  reordering,
  selected,
  editing,
  editTitle,
  editUrl,
  editUrlError,
  onSelect,
  onPlay,
  onMoveUp,
  onMoveDown,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditTitleChange,
  onEditUrlChange,
  onRequestDelete,
}: VideoRowProps) {
  return (
    <div
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
            onClick={onMoveUp}
            disabled={index === 0}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onMoveDown}
            disabled={index === total - 1}
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
            onClick={onPlay}
            className={cn(
              "absolute inset-0 cursor-pointer flex items-center justify-center bg-black/20 group-hover:bg-black/50",
              selected && "ring-2 ring-primary ring-offset-1",
            )}
          >
            <PlayCircle
              className="w-12 h-12 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
              strokeWidth={1}
            />
          </div>
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onSelect(!!checked)}
            className="absolute top-3 right-3 h-5 w-5 bg-background/80 data-[state=checked]:bg-primary cursor-pointer"
          />
        </div>

        <div className="flex flex-1 items-center justify-between gap-4">
          {editing ? (
            <div className="flex-1 space-y-3 grid grid-cols-2">
              <div>
                <Label htmlFor="edit-title" className="sr-only">제목</Label>
                <Input
                  id="edit-title"
                  value={editTitle}
                  onChange={(e) => onEditTitleChange(e.target.value)}
                  placeholder="영상 제목"
                  className="w-full mb-2"
                />
                <Label htmlFor="edit-url" className="sr-only">URL</Label>
                <Input
                  id="edit-url"
                  value={editUrl}
                  onChange={(e) => onEditUrlChange(e.target.value)}
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
                <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                  <X className="h-4 w-4 mr-1" /> 취소
                </Button>
                <Button variant="default" size="sm" onClick={onSaveEdit}>
                  <Check className="h-4 w-4 mr-1" /> 저장
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="flex-1 cursor-pointer h-32 flex flex-col justify-center p-4"
              onClick={() => onSelect(!selected)}
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
      {!editing && (
        <div className="flex items-center gap-2 relative z-50 mr-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onStartEdit}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onRequestDelete}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      )}
    </div>
  )
}
