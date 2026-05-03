import { Button } from "@/components/ui/button"
import { getNoticeById } from "@/lib/actions/notice"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { NoticeViewCounter } from "@/components/base/notice-view-counter"
import { ImageGalleryWithModal } from "@/components/ui/image-modal"
import { generateMetadata } from "@/utils/metadata-generator"

export const metadata = generateMetadata("SE Club | 공지사항", "SE Club 공지사항");

function LinkifyText({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s]+?)(?=[)\].,;:!?"'<>]*(?:\s|$)|$)/g;
  const parts: { type: 'text' | 'link'; content: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'link', content: match[1] });
    lastIndex = match.index + match[1].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return (
    <>
      {parts.map((part, i) =>
        part.type === 'link' ? (
          <a
            key={i}
            href={part.content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {part.content}
          </a>
        ) : (
          <span key={i}>{part.content}</span>
        )
      )}
    </>
  );
}

// HTML 콘텐츠가 시각적으로 비어있는지 (빈 <p>, <li>, <br> 만 있는 경우 포함)
function isHtmlContentEmpty(html: string): boolean {
  if (!html) return true
  const stripped = html
    .replace(/<br\s*\/?\s*>/gi, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]+>/g, "")
    .trim()
  return stripped.length === 0
}

function buildBackHref(searchParams: { [key: string]: string | string[] | undefined }) {
  const sp = new URLSearchParams()
  const keys = ["category", "searchTerm", "currentPage"] as const
  for (const k of keys) {
    const v = searchParams[k]
    if (typeof v === "string" && v.length > 0) sp.set(k, v)
  }
  const qs = sp.toString()
  return qs ? `/notices?${qs}` : "/notices"
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const sp = await searchParams
  const notice = await getNoticeById(id)
  const backHref = buildBackHref(sp)

  if (!notice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">공지사항을 찾을 수 없습니다.</h2>
        <Button asChild>
          <Link href={backHref}>목록으로 돌아가기</Link>
        </Button>
      </div>
    )
  }

  const content = notice.content || ""
  const isHtml = content.startsWith("<")
  const visuallyEmpty = isHtml ? isHtmlContentEmpty(content) : content.trim().length === 0

  return (
    <div className="min-h-screen w-full mt-[var(--header-height-expanded)]">
      <NoticeViewCounter noticeId={notice.id.toString()} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-foreground pb-6 mb-6">
          <p className="text-sm text-foreground/80 mb-2">{notice.category}</p>
          <h1 className="text-3xl font-bold text-foreground">{notice.title}</h1>
          <div className="flex items-center gap-4 text-sm text-foreground/80 mt-4">
            <span>작성일: {notice.created_at.split("T")[0]}</span>
            <span>조회수: {notice.view}</span>
          </div>
        </div>

        <div className="prose max-w-none min-h-[200px] py-6 text-base leading-[1.8] text-foreground [&_p]:!text-base [&_p]:md:!text-base [&_p]:text-foreground [&_li]:!text-base [&_li]:md:!text-base [&_li]:text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_a]:text-blue-600 [&_img]:max-w-full [&_img]:h-auto">
          {visuallyEmpty ? (
            <p className="text-foreground/60">본문 내용이 없습니다.</p>
          ) : isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="whitespace-pre-wrap"><LinkifyText text={content} /></p>
          )}
        </div>

        {notice.images && notice.images.length > 0 && (
          <ImageGalleryWithModal images={notice.images} />
        )}

        <div className="border-t pt-6 mt-6 text-center">
          <Button asChild variant="outline">
            <Link href={backHref} className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              목록으로
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
