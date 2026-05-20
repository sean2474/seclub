export function getSmallFileName(fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase() || "jpg"
  const baseName = fileName.replace(/\.[^.]+$/, "")
  return `${baseName}_small.${ext}`
}

export async function resizeImage(file: File, maxWidth: number = 800): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    img.onload = () => {
      let { width, height } = img

      if (width <= maxWidth) {
        file.arrayBuffer().then((buffer) => {
          resolve(new Blob([buffer], { type: file.type }))
        })
        return
      }

      const ratio = maxWidth / width
      width = maxWidth
      height = Math.round(height * ratio)

      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (blob.size >= file.size) {
              file.arrayBuffer().then((buffer) => {
                resolve(new Blob([buffer], { type: file.type }))
              })
            } else {
              resolve(blob)
            }
          } else {
            reject(new Error("Failed to create blob"))
          }
        },
        file.type,
        1.0,
      )
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}
