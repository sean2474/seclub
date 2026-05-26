import { createClient } from "@seclub/supabase/client"
import type { TablesUpdate } from "@seclub/supabase/types"
import {
  assertNoSmallSuffix,
  removeOriginalAndSmall,
  uploadOriginalAndSmall,
} from "@/lib/util/storage-image"
import type {
  GalleryRebornItem,
  GalleryRebornUpdatePatch,
  GalleryRebornUploadInput,
  LayoutType,
} from "@/types/gallery-reborn"
import { LAYOUT_TYPES } from "@/types/gallery-reborn"

const BUCKET = "gallery-reborn"
const TABLE = "gallery_reborn_items"

interface DbRow {
  id: string
  image_path: string
  small_path: string | null
  title: string | null
  description: string | null
  caption_en: string | null
  layout_type: LayoutType
  display_order: number
  created_at: string
  updated_at: string
}

function rowToItem(row: DbRow, supabase: ReturnType<typeof createClient>): GalleryRebornItem {
  const originalUrl = supabase.storage.from(BUCKET).getPublicUrl(row.image_path).data.publicUrl
  const previewUrl = row.small_path
    ? supabase.storage.from(BUCKET).getPublicUrl(row.small_path).data.publicUrl
    : originalUrl
  return {
    id: row.id,
    imagePath: row.image_path,
    smallPath: row.small_path,
    title: row.title,
    description: row.description,
    captionEn: row.caption_en,
    layoutType: row.layout_type,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    previewUrl,
    originalUrl,
  }
}

export async function fetchGalleryRebornItems(): Promise<{
  items: GalleryRebornItem[]
  error: Error | null
}> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })

    if (error) throw error
    const items = (data as DbRow[]).map((row) => rowToItem(row, supabase))
    return { items, error: null }
  } catch (error) {
    console.error("Error fetching gallery_reborn_items:", error)
    return { items: [], error: error as Error }
  }
}

export async function uploadGalleryRebornItems(inputs: GalleryRebornUploadInput[]): Promise<{
  uploadedItems: GalleryRebornItem[]
  error: Error | null
}> {
  const uploaded: GalleryRebornItem[] = []
  try {
    assertNoSmallSuffix(inputs.map((i) => i.file))

    const supabase = createClient()

    const { data: maxRow } = await supabase
      .from(TABLE)
      .select("display_order")
      .order("display_order", { ascending: false })
      .limit(1)
      .maybeSingle()

    const baseOrder = (maxRow?.display_order ?? -1) + 1

    for (let idx = 0; idx < inputs.length; idx++) {
      const input = inputs[idx]
      const fileExt = input.file.name.split(".").pop()?.toLowerCase() || "jpg"
      const folder = crypto.randomUUID()
      const fileName = `${folder}/original.${fileExt}`

      const { smallPath } = await uploadOriginalAndSmall(supabase, BUCKET, fileName, input.file)

      const layoutType: LayoutType = input.layoutType ?? "centered"
      if (!LAYOUT_TYPES.includes(layoutType)) {
        throw new Error(`Invalid layoutType: ${layoutType}`)
      }

      const { data: inserted, error: insertError } = await supabase
        .from(TABLE)
        .insert({
          image_path: fileName,
          small_path: smallPath,
          title: input.title ?? null,
          description: input.description ?? null,
          caption_en: input.captionEn ?? null,
          layout_type: layoutType,
          display_order: baseOrder + idx,
        })
        .select("*")
        .single()

      if (insertError) {
        await supabase.storage.from(BUCKET).remove(smallPath ? [fileName, smallPath] : [fileName])
        throw insertError
      }

      uploaded.push(rowToItem(inserted as DbRow, supabase))
    }

    return { uploadedItems: uploaded, error: null }
  } catch (error) {
    console.error("Error uploading gallery_reborn_items:", error)
    return { uploadedItems: uploaded, error: error as Error }
  }
}

export async function updateGalleryRebornItem(
  id: string,
  patch: GalleryRebornUpdatePatch,
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (patch.layoutType && !LAYOUT_TYPES.includes(patch.layoutType)) {
      throw new Error(`Invalid layoutType: ${patch.layoutType}`)
    }
    const supabase = createClient()
    const updates: TablesUpdate<"gallery_reborn_items"> = {}
    if (patch.title !== undefined) updates.title = patch.title
    if (patch.description !== undefined) updates.description = patch.description
    if (patch.captionEn !== undefined) updates.caption_en = patch.captionEn
    if (patch.layoutType !== undefined) updates.layout_type = patch.layoutType

    const { error } = await supabase.from(TABLE).update(updates).eq("id", id)
    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error("Error updating gallery_reborn_item:", error)
    return { success: false, error: error as Error }
  }
}

async function removeStorageObjects(
  supabase: ReturnType<typeof createClient>,
  rows: Pick<DbRow, "image_path" | "small_path">[],
) {
  const { error } = await removeOriginalAndSmall(
    supabase,
    BUCKET,
    rows.map((r) => ({ path: r.image_path, smallPath: r.small_path })),
  )
  if (error) console.warn("Storage cleanup warning:", error)
}

export async function deleteGalleryRebornItem(
  id: string,
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const supabase = createClient()
    const { data: row, error: fetchError } = await supabase
      .from(TABLE)
      .select("image_path, small_path")
      .eq("id", id)
      .single()
    if (fetchError) throw fetchError

    const { error: deleteError } = await supabase.from(TABLE).delete().eq("id", id)
    if (deleteError) throw deleteError

    await removeStorageObjects(supabase, [row as Pick<DbRow, "image_path" | "small_path">])
    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting gallery_reborn_item:", error)
    return { success: false, error: error as Error }
  }
}

export async function deleteGalleryRebornItems(
  ids: string[],
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (ids.length === 0) return { success: true, error: null }
    const supabase = createClient()
    const { data: rows, error: fetchError } = await supabase
      .from(TABLE)
      .select("image_path, small_path")
      .in("id", ids)
    if (fetchError) throw fetchError

    const { error: deleteError } = await supabase.from(TABLE).delete().in("id", ids)
    if (deleteError) throw deleteError

    await removeStorageObjects(supabase, rows as Pick<DbRow, "image_path" | "small_path">[])
    return { success: true, error: null }
  } catch (error) {
    console.error("Error bulk deleting gallery_reborn_items:", error)
    return { success: false, error: error as Error }
  }
}

export async function reorderGalleryRebornItems(
  orderedIds: string[],
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (orderedIds.length === 0) return { success: true, error: null }
    const supabase = createClient()
    const { error } = await supabase.rpc("reorder_gallery_reborn_items", {
      p_orders: orderedIds.map((id, index) => ({ id, order: index })),
    })
    if (error) throw error
    return { success: true, error: null }
  } catch (error) {
    console.error("Error reordering gallery_reborn_items:", error)
    return { success: false, error: error as Error }
  }
}
