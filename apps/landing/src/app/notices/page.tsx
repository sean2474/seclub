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

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const notices = await getNotices()
  const categories = (await getNoticeCategories());
  categories.unshift("전체")

  const params = await searchParams;
  const c = (params.category as string) || "전체"
  const searchTerm = (params.searchTerm as string) || ""
  const currentPage = Number(params.currentPage || "1")

  const ITEMS_PER_PAGE = 5

  const totalPages = Math.ceil(notices.length / ITEMS_PER_PAGE)

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
                  href={`?category=${category}`}
                  className={`relative px-4 py-2 ${category === c ? "border border-foreground after:w-full after:h-[10px] after:bg-background after:absolute after:-bottom-1 after:left-0" : ""}`}
                >
                  {category}
                </Link>
              ))}
            </div>

            {/* Search form */}
            <form method="get" className="flex gap-2 w-full order-1 md:w-auto md:order-2">
              {/* Keep category, reset to page 1 */}
              <input type="hidden" name="category" value={c} />
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
          <NoticeTable notices={notices} itemsPerPage={ITEMS_PER_PAGE} />
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?category=${c}&searchTerm=${searchTerm}&currentPage=${currentPage - 1}`}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`?category=${c}&searchTerm=${searchTerm}&currentPage=${page}`}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href={`?category=${c}&searchTerm=${searchTerm}&currentPage=${currentPage + 1}`}
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
