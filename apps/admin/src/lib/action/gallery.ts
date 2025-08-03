import { createClient } from "@/lib/supabase/client"

// Define the GalleryItem type
export interface GalleryItem {
  id: string
  title: string
  date: string
  file?: File
  previewUrl?: string
  originalUrl?: string // 원본 URL 추가
  path?: string
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

    // Get public URLs for all files
    const galleryItems = files.map(file => {
      // Skip folders
      if (file.id.endsWith('/')) return null
      
      // Get thumbnailUrl with size parameters (작은 썸네일용)
      const thumbnailUrl = supabase
        .storage
        .from("gallery")
        .getPublicUrl(file.name)
        .data
        .publicUrl + '?width=150&height=150&quality=30'
      
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
        path: file.name
      }
    }).filter(Boolean) as GalleryItem[]
    
    return { items: galleryItems, error: null }
  } catch (error) {
    console.error('Error fetching gallery images:', error)
    return { items: [], error: error as Error }
  }
}

/**
 * Uploads images to the gallery bucket
 */
export async function uploadGalleryImages(images: { file: File, id: string, title: string, date: string }[]): 
  Promise<{ uploadedItems: GalleryItem[], error: Error | null }> {
  try {
    const supabase = createClient()
    const uploadedItems: GalleryItem[] = []
    
    // Upload each file to Supabase storage
    for (const image of images) {
      if (!image.file) continue
      
      // Generate unique file name (using timestamp + random)
      const fileExt = image.file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      
      // Upload the file
      const { error } = await supabase
        .storage
        .from('gallery')
        .upload(fileName, image.file)
        
      if (error) throw error
      
      // Get thumbnail URL with size parameters
      const thumbnailUrl = supabase
        .storage
        .from('gallery')
        .getPublicUrl(fileName)
        .data
        .publicUrl + '?width=150&height=150&quality=30'
      
      // Get original URL without size parameters
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
        path: fileName
      })
    }
    
    return { uploadedItems, error: null }
  } catch (error) {
    console.error('Error uploading images:', error)
    return { uploadedItems: [], error: error as Error }
  }
}

/**
 * Deletes an image from the gallery bucket
 */
export async function deleteGalleryImage(path: string): Promise<{ success: boolean, error: Error | null }> {
  try {
    if (!path) {
      throw new Error('Path is required for deletion')
    }
    
    const supabase = createClient()
    
    // Delete file from Supabase storage
    const { error } = await supabase
      .storage
      .from('gallery')
      .remove([path])
      
    if (error) throw error
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { success: false, error: error as Error }
  }
}

/**
 * Deletes multiple images from the gallery bucket
 */
export async function deleteGalleryImages(paths: string[]): Promise<{ success: boolean, error: Error | null }> {
  try {
    if (!paths.length) {
      throw new Error('No paths provided for deletion')
    }
    
    const supabase = createClient()
    
    // Delete files from Supabase storage
    const { error } = await supabase
      .storage
      .from('gallery')
      .remove(paths)
      
    if (error) throw error
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error bulk deleting images:', error)
    return { success: false, error: error as Error }
  }
}
