import { createClient } from "@/lib/supabase/client"
import { getSmallFileName, resizeImage } from "@/lib/util/image"

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
      if (file.id.endsWith('/')) return null
      
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
    // _small이 포함된 파일명 체크
    const invalidFile = images.find(img => img.file && /_small\./i.test(img.file.name))
    if (invalidFile) {
      throw new Error(`파일명에 '_small'을 포함할 수 없습니다: ${invalidFile.file?.name}`)
    }
    
    const supabase = createClient()
    const uploadedItems: GalleryItem[] = []
    
    // Upload each file to Supabase storage
    for (const image of images) {
      if (!image.file) continue
      
      // Generate unique file name (using timestamp + random)
      const fileExt = image.file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const smallFileName = getSmallFileName(fileName)
      
      // Upload original file
      const { error: originalError } = await supabase
        .storage
        .from('gallery')
        .upload(fileName, image.file)
        
      if (originalError) throw originalError
      
      // Create and upload _small version
      try {
        const smallBlob = await resizeImage(image.file, 800)
        const { error: smallError } = await supabase
          .storage
          .from('gallery')
          .upload(smallFileName, smallBlob, {
            contentType: image.file.type
          })
        
        if (smallError) {
          console.warn('Failed to upload small version:', smallError)
        }
      } catch (resizeError) {
        console.warn('Failed to create small version:', resizeError)
      }
      
      // Get thumbnail URL (_small 버전)
      const thumbnailUrl = supabase
        .storage
        .from('gallery')
        .getPublicUrl(smallFileName)
        .data
        .publicUrl
      
      // Get original URL
      const originalUrl = supabase
        .storage
        .from('gallery')
        .getPublicUrl(fileName)
        .data
        .publicUrl
      
      // Add to uploaded items
      uploadedItems.push({
        id: image.id,
        title: image.title,
        date: image.date,
        previewUrl: thumbnailUrl,
        originalUrl: originalUrl,
        path: fileName,
        smallPath: smallFileName
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
    const smallPath = getSmallFileName(path)
    
    // Delete original and _small files from Supabase storage
    const { error } = await supabase
      .storage
      .from('gallery')
      .remove([path, smallPath])
      
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
    
    // 원본과 _small 파일 경로 모두 수집
    const allPaths = paths.flatMap(path => [path, getSmallFileName(path)])
    
    // Delete files from Supabase storage
    const { error } = await supabase
      .storage
      .from('gallery')
      .remove(allPaths)
      
    if (error) throw error
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error bulk deleting images:', error)
    return { success: false, error: error as Error }
  }
}
