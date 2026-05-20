import type { SupabaseClient } from "@supabase/supabase-js"
import { getSmallFileName, resizeImage } from "./image"

/**
 * Throws if any file name contains the reserved `_small` suffix used for
 * generated thumbnails. Use before uploading user-provided files so we don't
 * collide with the resize convention.
 */
export function assertNoSmallSuffix(files: { name: string }[]) {
  const invalid = files.find((f) => /_small\./i.test(f.name))
  if (invalid) {
    throw new Error(`파일명에 '_small'을 포함할 수 없습니다: ${invalid.name}`)
  }
}

export type UploadResult = {
  smallPath: string | null
}

/**
 * Uploads `file` to `bucket` at `fileName`, then tries to upload a resized
 * thumbnail at `${baseName}_small.${ext}`. The thumbnail upload is best-effort:
 * failures are logged but do not abort the operation. Returns the thumbnail
 * path when successful so callers can persist it.
 */
export async function uploadOriginalAndSmall(
  supabase: SupabaseClient,
  bucket: string,
  fileName: string,
  file: File,
): Promise<UploadResult> {
  const { error: originalError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { contentType: file.type })
  if (originalError) throw originalError

  const smallFileName = getSmallFileName(fileName)
  try {
    const smallBlob = await resizeImage(file, 800)
    const { error: smallError } = await supabase.storage
      .from(bucket)
      .upload(smallFileName, smallBlob, { contentType: file.type })
    if (smallError) {
      console.warn("Failed to upload small version:", smallError)
      return { smallPath: null }
    }
    return { smallPath: smallFileName }
  } catch (resizeError) {
    console.warn("Failed to create small version:", resizeError)
    return { smallPath: null }
  }
}

/**
 * Removes a set of (original, small) path pairs from `bucket`. Missing small
 * paths are skipped. Safe to call with an empty list.
 */
export async function removeOriginalAndSmall(
  supabase: SupabaseClient,
  bucket: string,
  entries: { path: string; smallPath?: string | null }[],
): Promise<{ error: Error | null }> {
  const paths = entries.flatMap((e) =>
    e.smallPath ? [e.path, e.smallPath] : [e.path],
  )
  if (paths.length === 0) return { error: null }
  const { error } = await supabase.storage.from(bucket).remove(paths)
  return { error: (error as Error) ?? null }
}
