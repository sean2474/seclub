import { Button } from "@/components/ui/button"
import { getNoticeById } from "@/lib/actions/notice"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const notice = await getNoticeById(Number(id))

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-foreground pb-6 mb-6">
          <p className="text-sm text-foreground/80 mb-2">{notice.category}</p>
          <h1 className="text-3xl font-bold text-foreground">{notice.title}</h1>
          <div className="flex items-center gap-4 text-sm text-foreground/80 mt-4">
            <span>작성일: {notice.date}</span>
            <span>조회수: {notice.views}</span>
          </div>
        </div>

        <div className="prose max-w-none min-h-[200px] py-6">
          <p className="whitespace-pre-wrap">{notice.content}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {(notice.images && notice.images.length > 0) && (
            notice.images.map((image, index) => (
              <div className="relative h-[200px]" key={index}>
                <Image
                  src={image}
                  alt={`image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))
          )}
        </div>

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