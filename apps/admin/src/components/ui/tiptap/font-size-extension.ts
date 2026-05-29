import { Extension } from "@tiptap/core"

type FontSizeOptions = {
  types: string[]
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => (element as HTMLElement).style.fontSize || null,
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {}
              return { style: `font-size: ${attrs.fontSize}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).run(),
    }
  },
})

/** Editor's default body size when no fontSize mark is applied (prose-sm). */
export const DEFAULT_FONT_SIZE = 14
export const MIN_FONT_SIZE = 1
export const MAX_FONT_SIZE = 200
/** −/+ buttons step by 1px (visible change); 0.1 fine-tuning via direct input. */
export const FONT_SIZE_STEP = 1
/** Smallest increment accepted by the direct-entry input. */
export const FONT_SIZE_PRECISION = 0.1
