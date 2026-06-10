"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { ResizableImage } from "./resizable-image"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { TextStyle } from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { useEffect, useMemo } from "react"
import { FontSize } from "./tiptap/font-size-extension"
import { EditorToolbar } from "./tiptap/toolbar"

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
  /** notice id — passed to the toolbar so pasted/selected images upload under it. */
  uploadFolder: string
}

export function TiptapEditor({ content, onChange, uploadFolder }: TiptapEditorProps) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      ResizableImage,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      FontSize,
      Placeholder.configure({ placeholder: "내용을 입력하세요..." }),
    ],
    [],
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
        class:
          "tiptap prose prose-sm max-w-none min-h-[300px] p-4 bg-[#FAF5E9] text-[#020E1B] focus:outline-none [&_strong]:font-extrabold [&_em]:italic [&_u]:underline",
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || "", { emitUpdate: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, editor])

  if (!editor) {
    return <div className="border rounded-md min-h-[340px] bg-muted/30 animate-pulse" aria-hidden />
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <EditorToolbar editor={editor} uploadFolder={uploadFolder} />
      <EditorContent editor={editor} />
    </div>
  )
}
