import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { NoticeTable } from "@/assets/notice-table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Link from "next/link"
import { getNoticeCategories, getNotices } from "@/lib/actions/notice"
import { generateMetadata } from "@/utils/metadata-generator"

export const dynamic = "force-dynamic";
export const metadata = generateMetadata("SE Club | 공지사항", "SE Club 공지사항");

const ITEMS_PER_PAGE = 5

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [notices, categoriesRaw, params] = await Promise.all([
    getNotices(),
    getNoticeCategories(),
    searchParams,
  ])
  const categories = ["전체", ...categoriesRaw]
  const c = (params.category as string) || "전체"
  const searchTerm = (params.searchTerm as string) || ""
  const requestedPageRaw = Number(params.currentPage)
  const requestedPage = Number.isFinite(requestedPageRaw) && requestedPageRaw > 0 ? requestedPageRaw : 1

  const filtered = (notices.data || [])
    .filter((item) => c === "전체" || item.category === c)
    .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages)

  // 페이지에 보일 데이터만 클라이언트로 전송 (hydration 비용 절감)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const buildHref = (overrides: { category?: string; searchTerm?: string; currentPage?: number }) => {
    const next = {
      category: overrides.category ?? c,
      searchTerm: overrides.searchTerm ?? searchTerm,
      currentPage: overrides.currentPage ?? currentPage,
    }
    const sp = new URLSearchParams()
    if (next.category && next.category !== "전체") sp.set("category", next.category)
    if (next.searchTerm) sp.set("searchTerm", next.searchTerm)
    if (next.currentPage > 1) sp.set("currentPage", String(next.currentPage))
    const qs = sp.toString()
    return qs ? `/notices?${qs}` : "/notices"
  }

  return (
    <div className="min-h-screen w-full mt-[var(--header-height-expanded)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">공지사항</h1>
        </header>

        <main>
          <div className="flex flex-col md:flex-row gap-4 justify-start md:justify-between items-start md:items-center mb-4">
            {/* Category tabs */}
            <div className="flex border-b order-2 md:order-1">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={buildHref({ category, currentPage: 1 })}
                  scroll={false}
                  prefetch={false}
                  className={`relative px-4 py-2 ${category === c ? "border border-foreground after:w-full after:h-[10px] after:bg-background after:absolute after:-bottom-1 after:left-0" : ""}`}
                >
                  {category}
                </Link>
              ))}
            </div>

            {/* Search form */}
            <form method="get" className="flex gap-2 w-full order-1 md:w-auto md:order-2">
              {/* Keep category, reset to page 1 */}
              <input type="hidden" name="category" value={c === "전체" ? "" : c} />
              <input type="hidden" name="currentPage" value="1" />

              {/* Text input: uncontrolled so Enter submits */}
              <div className="relative flex-1 md:flex-initial">
                <Input
                  name="searchTerm"
                  placeholder="검색어를 입력하세요"
                  className="pr-10"
                  defaultValue={searchTerm}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="검색"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
          {notices.data && (
            <NoticeTable
              notices={paginated}
              hasFilter={c !== "전체" || searchTerm.length > 0}
            />
          )}
          {notices.error && <p className="text-red-500">{notices.error}</p>}
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={buildHref({ currentPage: Math.max(1, currentPage - 1) })}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={buildHref({ currentPage: page })}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href={buildHref({ currentPage: Math.min(totalPages, currentPage + 1) })}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </main>
      </div>
    </div>
  )
}
