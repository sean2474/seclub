"use client"

import { type Editor, useEditorState } from "@tiptap/react"
import { useEffect, useRef, useState } from "react"
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
  Minus,
  Plus,
  Redo,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react"
import { cn } from "@seclub/utils"
import {
  DEFAULT_FONT_SIZE,
  FONT_SIZE_PRECISION,
  FONT_SIZE_STEP,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
} from "./font-size-extension"

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

/** Round to one decimal so 0.1 steps don't accumulate float noise (14.0000001). */
function round1(n: number) {
  return Math.round(n * 10) / 10
}

/** "14" for integers, "14.5" otherwise — no trailing ".0". */
function formatSize(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}

/**
 * Font-size control: − [14px] + . The middle shows the current size and turns
 * into a number input on click for direct entry. Steps by 0.1px, clamped to
 * [MIN_FONT_SIZE, MAX_FONT_SIZE]. When no fontSize mark is set we treat the
 * editor's body size (DEFAULT_FONT_SIZE) as the starting point.
 */
function FontSizeStepper({ editor }: { editor: Editor }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Subscribe to editor transactions so the displayed size tracks the current
  // selection AND the stored mark (collapsed cursor) — without this the number
  // wouldn't update when you change size with nothing selected.
  const current = useEditorState({
    editor,
    selector: ({ editor }) => {
      const raw = editor.getAttributes("textStyle").fontSize as string | undefined
      const parsed = raw ? parseFloat(raw) : NaN
      return Number.isFinite(parsed) ? parsed : DEFAULT_FONT_SIZE
    },
  })

  const apply = (size: number) => {
    const clamped = round1(Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, size)))
    // Google Docs semantics: apply only to the selected range. With a collapsed
    // cursor this sets a stored mark so the next typed text uses the size —
    // existing text is left untouched.
    editor.chain().focus().setFontSize(`${clamped}px`).run()
  }

  const startEditing = () => {
    setDraft(formatSize(current))
    setEditing(true)
  }

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  const commit = () => {
    const n = parseFloat(draft)
    if (Number.isFinite(n)) apply(n)
    setEditing(false)
  }

  return (
    <div className="ml-1 flex items-center rounded border bg-background" title="글자 크기">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => apply(current - FONT_SIZE_STEP)}
        className="grid h-7 w-6 place-items-center rounded-l hover:bg-accent transition-colors"
        title="작게"
      >
        <Minus size={12} />
      </button>
      {editing ? (
        <input
          ref={inputRef}
          type="number"
          inputMode="decimal"
          step={FONT_SIZE_PRECISION}
          min={MIN_FONT_SIZE}
          max={MAX_FONT_SIZE}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              commit()
            } else if (e.key === "Escape") {
              setEditing(false)
            }
          }}
          className="h-7 w-12 border-x text-center text-xs tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
      ) : (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={startEditing}
          className="h-7 w-12 border-x text-center text-xs tabular-nums hover:bg-accent transition-colors"
          title="클릭하여 직접 입력"
        >
          {formatSize(current)}px
        </button>
      )}
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => apply(current + FONT_SIZE_STEP)}
        className="grid h-7 w-6 place-items-center rounded-r hover:bg-accent transition-colors"
        title="크게"
      >
        <Plus size={12} />
      </button>
    </div>
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

      <FontSizeStepper editor={editor} />

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
