import { createClient } from "@seclub/supabase/client"
import { getSmallFileName } from "@/lib/util/image"
import {
  assertNoSmallSuffix,
  removeOriginalAndSmall,
  uploadOriginalAndSmall,
} from "@/lib/util/storage-image"

const BUCKET = "gallery"

// Define the GalleryItem type
export interface GalleryItem {
  id: string
  title: string
  date: string
  file?: File
  previewUrl?: string
  originalUrl?: string
  path?: string
  smallPath?: string
}

/**
 * Fetches all images from the gallery bucket
 */
export async function fetchGalleryImages(): Promise<{ items: GalleryItem[], error: Error | null }> {
  try {
    const supabase = createClient()
    
    // Get list of files in the gallery bucket
    const { data: files, error } = await supabase
      .storage
      .from("gallery")
      .list("", {
        offset: 0,
        sortBy: { column: "name", order: "asc" }
      })

      
    if (error) {
      throw error
    }
    
    if (!files || files.length === 0) {
      return { items: [], error: null }
    }

    // _small 파일 제외하고 원본만 필터링
    const originalFiles = files.filter(file => !/_small\./i.test(file.name))
    
    // Get public URLs for all files
    const galleryItems = originalFiles.map(file => {
      // Skip folders
      if (file.id?.endsWith('/')) return null
      
      const smallFileName = getSmallFileName(file.name)
      const hasSmall = files.some(f => f.name === smallFileName)
      
      // 썸네일용: _small 버전이 있으면 사용, 없으면 원본 사용
      const thumbnailUrl = supabase
        .storage
        .from("gallery")
        .getPublicUrl(hasSmall ? smallFileName : file.name)
        .data
        .publicUrl
      
      // Get original URL without size parameters (원본 이미지용)
      const originalUrl = supabase
        .storage
        .from("gallery")
        .getPublicUrl(file.name)
        .data
        .publicUrl
        
      // Create a gallery item
      return {
        id: file.id,
        title: file.name.split('/').pop() || file.name,
        date: new Date(file.created_at || Date.now()).toISOString().split('T')[0],
        previewUrl: thumbnailUrl,
        originalUrl: originalUrl,
        path: file.name,
        smallPath: hasSmall ? smallFileName : undefined
      }
    }).filter(Boolean) as GalleryItem[]
    
    return { items: galleryItems, error: null }
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return { items: [], error: error as Error }
  }
}

/**
 * Uploads images to the gallery bucket (원본 + _small 버전 함께 업로드)
 */
export async function uploadGalleryImages(images: { file: File, id: string, title: string, date: string }[]):
  Promise<{ uploadedItems: GalleryItem[], error: Error | null }> {
  try {
    assertNoSmallSuffix(images.map((i) => i.file).filter((f): f is File => !!f))

    const supabase = createClient()
    const uploadedItems: GalleryItem[] = []

    for (const image of images) {
      if (!image.file) continue

      const fileExt = image.file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`

      const { smallPath } = await uploadOriginalAndSmall(supabase, BUCKET, fileName, image.file)

      const thumbnailUrl = supabase.storage
        .from(BUCKET)
        .getPublicUrl(smallPath ?? fileName).data.publicUrl
      const originalUrl = supabase.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl

      uploadedItems.push({
        id: image.id,
        title: image.title,
        date: image.date,
        previewUrl: thumbnailUrl,
        originalUrl,
        path: fileName,
        smallPath: smallPath ?? undefined,
      })
    }

    return { uploadedItems, error: null }
  } catch (error) {
    console.error('Error uploading images:', error)
    return { uploadedItems: [], error: error as Error }
  }
}

/**
 * Deletes an image from the gallery bucket (원본 + _small 함께 삭제)
 */
export async function deleteGalleryImage(path: string): Promise<{ success: boolean, error: Error | null }> {
  try {
    if (!path) {
      throw new Error('Path is required for deletion')
    }
    const supabase = createClient()
    const { error } = await removeOriginalAndSmall(supabase, BUCKET, [
      { path, smallPath: getSmallFileName(path) },
    ])
    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: error as Error }
  }
}

/**
 * Deletes multiple images from the gallery bucket (원본 + _small 함께 삭제)
 */
export async function deleteGalleryImages(paths: string[]): Promise<{ success: boolean, error: Error | null }> {
  try {
    if (!paths.length) {
      throw new Error('No paths provided for deletion')
    }
    const supabase = createClient()
    const { error } = await removeOriginalAndSmall(
      supabase,
      BUCKET,
      paths.map((p) => ({ path: p, smallPath: getSmallFileName(p) })),
    )
    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error('Error bulk deleting images:', error)
    return { success: false, error: error as Error }
  }
}
