"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import { Badge } from "@seclub/ui/badge"
import { Button } from "@seclub/ui/button"
import { Checkbox } from "@seclub/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@seclub/ui/dropdown-menu"
import { GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { LAYOUT_TYPE_LABELS, type GalleryRebornItem } from "@/types/gallery-reborn"
import { cn } from "@seclub/utils"

interface SortableCardProps {
  item: GalleryRebornItem
  selected: boolean
  onToggleSelect: (checked: boolean) => void
  onEdit: () => void
  onRequestDelete: () => void
}

export function SortableCard({ item, selected, onToggleSelect, onEdit, onRequestDelete }: SortableCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group border rounded-lg overflow-hidden bg-background",
        selected && "ring-2 ring-primary",
      )}
      data-testid={`reborn-card-${item.id}`}
    >
      <div className="relative aspect-[4/3] bg-muted">
        <Image
          src={item.previewUrl}
          alt={item.title || "환생 갤러리 작품"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        <button
          type="button"
          aria-label="순서 변경 손잡이"
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 h-8 w-8 inline-flex items-center justify-center rounded-md bg-background/90 hover:bg-background border cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <Checkbox
          checked={selected}
          onCheckedChange={(c) => onToggleSelect(!!c)}
          className="absolute top-3 right-12 h-5 w-5 bg-background/90 data-[state=checked]:bg-primary"
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>작업</DropdownMenuLabel>
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" /> 편집
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={onRequestDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> 삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium truncate" title={item.title || "(제목 없음)"}>
            {item.title || <span className="text-muted-foreground">(제목 없음)</span>}
          </p>
          <Badge variant="outline" className="shrink-0">
            #{item.displayOrder}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{LAYOUT_TYPE_LABELS[item.layoutType]}</Badge>
          {item.captionEn && (
            <span className="text-xs italic text-muted-foreground truncate">{item.captionEn}</span>
          )}
        </div>
      </div>
    </div>
  )
}
