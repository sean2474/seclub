"use client"

import Image from "next/image"
import { Button } from "@seclub/ui/button"
import { Checkbox } from "@seclub/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@seclub/ui/dropdown-menu"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { cn } from "@seclub/utils"
import type { GalleryItem } from "@/lib/client/gallery"

interface GalleryGridProps {
  items: GalleryItem[]
  isLoading: boolean
  selectedIds: string[]
  onSelect: (id: string, checked: boolean) => void
  onRequestDelete: (id: string) => void
}

export function GalleryGrid({
  items,
  isLoading,
  selectedIds,
  onSelect,
  onRequestDelete,
}: GalleryGridProps) {
  if (isLoading) {
    return (
      <div className="col-span-full flex justify-center py-12">
        <p className="text-muted-foreground">이미지를 불러오는 중입니다...</p>
      </div>
    )
  }
  if (items.length === 0) {
    return (
      <div className="col-span-full flex justify-center py-12">
        <p className="text-muted-foreground">갤러리에 이미지가 없습니다. 새 이미지를 추가하세요.</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <div key={item.id} className="relative group aspect-square">
          <Image
            src={item.previewUrl || `/placeholder.svg?width=200&height=200&query=${item.title}`}
            alt={item.title}
            width={200}
            height={200}
            className="object-cover w-full h-full rounded-lg"
          />
          <div
            onClick={() => onSelect(item.id, !selectedIds.includes(item.id))}
            className={cn(
              "absolute inset-0 rounded-lg transition-all cursor-pointer",
              selectedIds.includes(item.id)
                ? "ring-2 ring-primary ring-offset-2"
                : "group-hover:bg-black/20",
            )}
          />
          <Checkbox
            checked={selectedIds.includes(item.id)}
            onCheckedChange={(checked) => onSelect(item.id, !!checked)}
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
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onRequestDelete(item.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg">
            <div className="flex items-center justify-end w-full">
              <p className="text-xs text-white/90 font-medium">{item.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
