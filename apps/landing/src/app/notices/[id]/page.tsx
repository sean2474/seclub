import { Button } from "@/components/ui/button"
import { getNoticeById } from "@/lib/actions/notice"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NoticeViewCounter } from "@/components/base/notice-view-counter"
import { ImageGalleryWithModal } from "@/components/ui/image-modal"
import { generateMetadata } from "@/utils/metadata-generator"

export const metadata = generateMetadata("SE클럽 | 공지사항", "SE클럽 공지사항");

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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const notice = await getNoticeById(id)

  if (!notice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">공지사항을 찾을 수 없습니다.</h2>
        <Button asChild>
          <Link href="/notice">목록으로 돌아가기</Link>
        </Button>
      </div>
    )
  }

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

        <div className="prose max-w-none min-h-[200px] py-6">
          <p className="whitespace-pre-wrap"><LinkifyText text={notice.content} /></p>
        </div>

        {notice.images && notice.images.length > 0 && (
          <ImageGalleryWithModal images={notice.images} />
        )}

        <div className="border-t pt-6 mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/notices" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              목록으로
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}