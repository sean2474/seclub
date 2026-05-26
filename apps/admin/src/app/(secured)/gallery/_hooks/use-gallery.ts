"use client"

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react"
import { toast } from "@seclub/ui/use-toast"
import {
  deleteGalleryImage,
  deleteGalleryImages,
  fetchGalleryImages,
  uploadGalleryImages,
  type GalleryItem,
} from "@/lib/client/gallery"

const SIMULATED_PROGRESS_STEP = 20
const SIMULATED_PROGRESS_INTERVAL = 200

function readFileAsDataURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const pendingItemsRef = useRef<GalleryItem[]>([])

  useEffect(() => {
    let active = true
    fetchGalleryImages()
      .then(({ items, error }) => {
        if (!active) return
        if (error) {
          toast({
            title: "이미지 로드 오류",
            description: "갤러리 이미지를 불러오는 중 오류가 발생했습니다.",
            variant: "destructive",
          })
          return
        }
        setItems(items)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const beginUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    e.target.value = ""
    if (!files || files.length === 0) return
    try {
      pendingItemsRef.current = await Promise.all(
        Array.from(files).map(async (file) => ({
          id: `g${Date.now()}-${Math.random()}`,
          title: file.name,
          date: new Date().toISOString().split("T")[0],
          file,
          previewUrl: await readFileAsDataURL(file),
        })),
      )
      setUploadProgress(0)
    } catch (error) {
      console.error("Error reading files:", error)
      toast({
        title: "파일 읽기 오류",
        description: "파일을 읽는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }, [])

  // Animate a fake progress bar then run the real upload at 100%.
  useEffect(() => {
    if (uploadProgress === null) return
    if (uploadProgress < 100) {
      const timer = setTimeout(() => {
        setUploadProgress((p) => (p !== null ? p + SIMULATED_PROGRESS_STEP : 0))
      }, SIMULATED_PROGRESS_INTERVAL)
      return () => clearTimeout(timer)
    }
    const upload = async () => {
      try {
        const itemsToUpload = pendingItemsRef.current.map((item) => ({
          id: item.id,
          title: item.title,
          date: item.date,
          file: item.file as File,
        }))
        const { uploadedItems, error } = await uploadGalleryImages(itemsToUpload)
        if (error) throw error
        setItems((prev) => [...uploadedItems, ...prev])
        toast({
          title: "업로드 완료",
          description: `${uploadedItems.length}개 이미지가 추가되었습니다.`,
        })
      } catch (error) {
        console.error("Error uploading images:", error)
        toast({
          title: "업로드 오류",
          description: "이미지 업로드 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      } finally {
        setUploadProgress(null)
        pendingItemsRef.current = []
      }
    }
    upload()
  }, [uploadProgress])

  const remove = useCallback(async (id: string) => {
    const target = items.find((i) => i.id === id)
    if (!target?.path) {
      toast({
        title: "삭제 오류",
        description: "삭제할 항목을 찾을 수 없습니다.",
        variant: "destructive",
      })
      return
    }
    const { success, error } = await deleteGalleryImage(target.path)
    if (error || !success) {
      toast({
        title: "삭제 오류",
        description: "이미지를 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      return
    }
    setItems((prev) => prev.filter((i) => i.id !== id))
    toast({ title: "삭제 완료", description: "이미지가 삭제되었습니다." })
  }, [items])

  const removeMany = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return false
    const paths = items
      .filter((i) => ids.includes(i.id))
      .map((i) => i.path)
      .filter((p): p is string => !!p)
    if (paths.length === 0) {
      toast({
        title: "삭제 오류",
        description: "선택된 이미지가 없습니다.",
        variant: "destructive",
      })
      return false
    }
    const { success, error } = await deleteGalleryImages(paths)
    if (error || !success) {
      toast({
        title: "일괄 삭제 오류",
        description: "이미지를 삭제하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      return false
    }
    setItems((prev) => prev.filter((i) => !ids.includes(i.id)))
    toast({
      title: "일괄 삭제 완료",
      description: `${ids.length}개 이미지가 삭제되었습니다.`,
    })
    return true
  }, [items])

  return { items, isLoading, uploadProgress, beginUpload, remove, removeMany }
}
