"use client"

import { type Editor } from "@tiptap/react"
import { useRef } from "react"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Redo,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react"
import { cn } from "@seclub/utils"
import { FONT_SIZE_OPTIONS } from "./font-size-extension"

const ICON_SIZE = 16
const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5MB

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void
  active?: boolean
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      // 버튼이 mousedown으로 포커스를 가져가면 editor selection이 사라져
      // toggleBold 등이 적용될 selection이 없어진다. 표준 TipTap 툴바 패턴으로 막는다.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded hover:bg-accent transition-colors",
        active && "bg-accent text-accent-foreground",
      )}
    >
      {children}
    </button>
  )
}

export function EditorToolbar({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const accepted = Array.from(files).filter((file) => {
      if (file.size > MAX_IMAGE_BYTES) {
        alert(`'${file.name}'은(는) 5MB를 초과하여 업로드할 수 없습니다.`)
        return false
      }
      return true
    })

    accepted.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        editor
          .chain()
          .focus()
          .insertContent({
            type: "resizableImage",
            attrs: { src: reader.result as string },
          })
          .run()
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ""
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="볼드"
      >
        <Bold size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="이탤릭"
      >
        <Italic size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="밑줄"
      >
        <UnderlineIcon size={ICON_SIZE} />
      </ToolbarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
        title="제목 (H2)"
      >
        <Heading2 size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
        title="소제목 (H3)"
      >
        <Heading3 size={ICON_SIZE} />
      </ToolbarButton>

      <select
        value={(editor.getAttributes("textStyle").fontSize as string) || ""}
        onChange={(e) => {
          const v = e.target.value
          if (!v) editor.chain().focus().unsetFontSize().run()
          else editor.chain().focus().setFontSize(v).run()
        }}
        className="ml-1 h-7 text-xs border rounded px-1 bg-background"
        title="글자 크기"
      >
        {FONT_SIZE_OPTIONS.map((opt) => (
          <option key={opt.value || "default"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="글머리 기호"
      >
        <List size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="번호 목록"
      >
        <ListOrdered size={ICON_SIZE} />
      </ToolbarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        title="왼쪽 정렬"
      >
        <AlignLeft size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        title="가운데 정렬"
      >
        <AlignCenter size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        title="오른쪽 정렬"
      >
        <AlignRight size={ICON_SIZE} />
      </ToolbarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton onClick={handleImageUpload} title="이미지 삽입">
        <ImagePlus size={ICON_SIZE} />
      </ToolbarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="실행 취소">
        <Undo size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="다시 실행">
        <Redo size={ICON_SIZE} />
      </ToolbarButton>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
