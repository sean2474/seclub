import { createClient } from "@seclub/supabase/client"

const BUCKET = "notice"

// content-type → 저장 확장자. 그 외는 파일명 확장자, 최종 fallback은 jpg.
const EXT_MAP: Record<string, string> = {
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
}

/**
 * RFC4122 v4 UUID 생성. `crypto.randomUUID`가 없는 비보안 컨텍스트
 * (http로 서빙되는 로컬 *.seclub.local 서브도메인 등)에서도 동작하도록
 * `getRandomValues` fallback을 둔다.
 */
export function safeUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID()
    } catch {
      // 비보안 컨텍스트 → 아래 fallback 사용
    }
  }
  const b = crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40 // version 4
  b[8] = (b[8] & 0x3f) | 0x80 // variant 10
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0"))
  return `${h[0]}${h[1]}${h[2]}${h[3]}-${h[4]}${h[5]}-${h[6]}${h[7]}-${h[8]}${h[9]}-${h.slice(10).join("")}`
}

/**
 * 에디터 이미지를 브라우저에서 직접 `notice` 버킷에 업로드하고 public URL을 반환.
 *
 * 이미지를 base64로 본문에 박아 서버 액션 페이로드로 보내면 Next.js 서버 액션
 * 기본 한도(1MB) 및 Vercel 요청 한도(~4.5MB)를 넘겨, 이미지가 포함된 공지가
 * 조용히 저장 실패한다. 클라이언트에서 미리 업로드해 URL만 본문에 넣으면
 * 액션 페이로드가 작게 유지된다.
 *
 * 경로는 `${folder}/...` (folder = notice id)로, deleteNotice의 폴더 단위
 * 정리 로직과 호환된다.
 */
export async function uploadNoticeImage(
  file: File,
  folder: string,
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const supabase = createClient()
    const ext =
      EXT_MAP[file.type] || file.name.split(".").pop()?.toLowerCase() || "jpg"
    const path = `${folder}/${safeUuid()}.${ext}`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      })
    if (error) throw error

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return { url: data.publicUrl, error: null }
  } catch (error) {
    console.error("Error uploading notice image:", error)
    return { url: null, error: error as Error }
  }
}
