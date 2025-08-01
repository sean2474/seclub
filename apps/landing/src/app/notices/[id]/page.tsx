import { Button } from "@/components/ui/button"
import { getAnnouncementById } from "@/lib/actions/announcements"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const announcement = await getAnnouncementById(Number(id))

  if (!announcement) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">공지사항을 찾을 수 없습니다.</h2>
        <Button asChild>
          <Link href="/announcements">목록으로 돌아가기</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full mt-[var(--header-height-expanded)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-foreground pb-6 mb-6">
          <p className="text-sm text-foreground/80 mb-2">{announcement.category}</p>
          <h1 className="text-3xl font-bold text-foreground">{announcement.title}</h1>
          <div className="flex items-center gap-4 text-sm text-foreground/80 mt-4">
            <span>작성일: {announcement.date}</span>
            <span>조회수: {announcement.views}</span>
          </div>
        </div>

        <div className="prose max-w-none min-h-[200px] py-6">
          <p className="whitespace-pre-wrap">{announcement.content}</p>
        </div>

        <div className="border-t pt-6 mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/announcements" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              목록으로
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}