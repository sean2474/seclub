"use client"

import { Node, mergeAttributes } from "@tiptap/core"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { useCallback, useEffect, useRef, useState } from "react"

// ===== NodeView Component =====
function ResizableImageComponent({ node, updateAttributes, selected }: {
  node: { attrs: { src: string; width: number | null; alt: string | null } }
  updateAttributes: (attrs: Record<string, unknown>) => void
  selected: boolean
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [resizing, setResizing] = useState(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setResizing(true)
    startX.current = e.clientX
    startWidth.current = imgRef.current?.offsetWidth || 300
  }, [])

  useEffect(() => {
    if (!resizing) return

    const onMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX.current
      const newWidth = Math.max(100, startWidth.current + diff)
      updateAttributes({ width: newWidth })
    }

    const onMouseUp = () => {
      setResizing(false)
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup", onMouseUp)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup", onMouseUp)
    }
  }, [resizing, updateAttributes])

  return (
    <NodeViewWrapper className="relative inline-block my-2" data-drag-handle>
      <div className={`relative inline-block ${selected ? "ring-2 ring-primary ring-offset-2" : ""}`}>
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          style={{ width: node.attrs.width ? `${node.attrs.width}px` : "auto" }}
          className="max-w-full h-auto rounded block"
          draggable={false}
        />
        {selected && (
          <>
            {/* 우하단 리사이즈 핸들 */}
            <div
              onMouseDown={onMouseDown}
              className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize rounded-tl-sm"
              style={{ touchAction: "none" }}
            />
            {/* 사이즈 표시 */}
            <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
              {node.attrs.width ? `${Math.round(node.attrs.width)}px` : "auto"}
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  )
}

// ===== TipTap Extension =====
export const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      width: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: "img[src]" }]
  },

  renderHTML({ HTMLAttributes }) {
    const attrs: Record<string, string> = {
      ...HTMLAttributes,
      class: "max-w-full h-auto rounded",
    }
    if (HTMLAttributes.width) {
      attrs.style = `width: ${HTMLAttributes.width}px`
    }
    return ["img", mergeAttributes(attrs)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent as unknown as Parameters<typeof ReactNodeViewRenderer>[0])
  },

  addCommands() {
    return {
      setResizableImage:
        (attrs: { src: string; alt?: string; width?: number }) =>
        ({ commands }: { commands: { insertContent: (content: unknown) => boolean } }) => {
          return commands.insertContent({
            type: this.name,
            attrs,
          })
        },
    } as Record<string, (...args: unknown[]) => unknown>
  },
})
