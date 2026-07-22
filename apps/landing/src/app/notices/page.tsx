import { NoticeBoard } from "@/components/base/notice-board"
import { getNoticeCategories, getNotices } from "@/lib/actions/notice"
import { generateMetadata } from "@/utils/metadata-generator"

export const revalidate = 60
export const metadata = generateMetadata("SE Club | 공지사항", "SE Club 공지사항")

export default async function Page() {
  const [notices, categories] = await Promise.all([
    getNotices(),
    getNoticeCategories(),
  ])

  return (
    <div className="min-h-screen w-full mt-[var(--header-height-expanded)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            공지사항
          </h1>
        </header>

        <main>
          {notices.error ? (
            <p className="text-red-500">{notices.error}</p>
          ) : (
            <NoticeBoard notices={notices.data || []} categories={categories} />
          )}
        </main>
      </div>
    </div>
  )
}
