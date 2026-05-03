"use client"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Extension } from "@tiptap/core"
import { ResizableImage } from "./resizable-image"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { TextStyle } from "@tiptap/extension-text-style"
import { useMemo, useRef } from "react"

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] as string[] }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types as string[],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attrs: { fontSize: string | null }) => {
              if (!attrs.fontSize) return {}
              return { style: `font-size: ${attrs.fontSize}` }
            },
          },
        },
      },
    ] as unknown as never
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: { chain: () => { setMark: (name: string, attrs: Record<string, unknown>) => { run: () => boolean }; focus: () => { setMark: (name: string, attrs: Record<string, unknown>) => { run: () => boolean } } } }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => { setMark: (name: string, attrs: Record<string, unknown>) => { run: () => boolean }; focus: () => { setMark: (name: string, attrs: Record<string, unknown>) => { run: () => boolean } } } }) =>
          chain().setMark("textStyle", { fontSize: null }).run(),
    } as Record<string, (...args: unknown[]) => unknown>
  },
})

const FONT_SIZE_OPTIONS: { label: string; value: string }[] = [
  { label: "기본", value: "" },
  { label: "아주 작게 (12)", value: "12px" },
  { label: "작게 (14)", value: "14px" },
  { label: "보통 (16)", value: "16px" },
  { label: "크게 (20)", value: "20px" },
  { label: "아주 크게 (24)", value: "24px" },
  { label: "초대형 (32)", value: "32px" },
]
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImagePlus,
  Undo,
  Redo,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
}

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
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded hover:bg-accent transition-colors",
        active && "bg-accent text-accent-foreground"
      )}
    >
      {children}
    </button>
  )
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      ResizableImage,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontSize,
      Placeholder.configure({ placeholder: "내용을 입력하세요..." }),
    ],
    []
  )

  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
  })

  if (!editor) {
    return (
      <div className="border rounded-md min-h-[340px] bg-muted/30 animate-pulse" aria-hidden />
    )
  }

  return <EditorBody editor={editor} />
}

function EditorBody({ editor }: { editor: Editor }) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const MAX_BYTES = 5 * 1024 * 1024 // 5MB
    const accepted = Array.from(files).filter((file) => {
      if (file.size > MAX_BYTES) {
        alert(`'${file.name}'은(는) 5MB를 초과하여 업로드할 수 없습니다.`)
        return false
      }
      return true
    })

    accepted.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        editor.chain().focus().insertContent({
          type: "resizableImage",
          attrs: { src: reader.result as string },
        }).run()
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ""
  }

  const iconSize = 16

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b bg-muted/30">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="볼드"
        >
          <Bold size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="이탤릭"
        >
          <Italic size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="밑줄"
        >
          <UnderlineIcon size={iconSize} />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="제목 (H2)"
        >
          <Heading2 size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="소제목 (H3)"
        >
          <Heading3 size={iconSize} />
        </ToolbarButton>

        <select
          value={(editor.getAttributes("textStyle").fontSize as string) || ""}
          onChange={(e) => {
            const v = e.target.value
            const chain = editor.chain().focus()
            if (!v) {
              ;(chain as unknown as { unsetFontSize: () => { run: () => boolean } }).unsetFontSize().run()
            } else {
              ;(chain as unknown as { setFontSize: (s: string) => { run: () => boolean } }).setFontSize(v).run()
            }
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
          <List size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="번호 목록"
        >
          <ListOrdered size={iconSize} />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="왼쪽 정렬"
        >
          <AlignLeft size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="가운데 정렬"
        >
          <AlignCenter size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="오른쪽 정렬"
        >
          <AlignRight size={iconSize} />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton onClick={handleImageUpload} title="이미지 삽입">
          <ImagePlus size={iconSize} />
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="실행 취소"
        >
          <Undo size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="다시 실행"
        >
          <Redo size={iconSize} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Hidden file input */}
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
