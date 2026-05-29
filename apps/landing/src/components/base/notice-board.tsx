"use client"

import { useMemo, useState } from "react"
import { Input } from "@seclub/ui/input"
import { Search } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@seclub/ui/pagination"
import { NoticeTable } from "@/assets/notice-table"
import { Notice } from "@/types"

const ITEMS_PER_PAGE = 5

export function NoticeBoard({
  notices,
  categories,
}: {
  notices: Notice[]
  categories: string[]
}) {
  const [category, setCategory] = useState("전체")
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  const tabs = useMemo(
    () => ["전체", ...categories.filter((c) => c !== "전체")],
    [categories],
  )

  const filtered = useMemo(
    () =>
      notices
        .filter((item) => category === "전체" || item.category === category)
        .filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    [notices, category, searchTerm],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handleCategory = (c: string) => {
    setCategory(c)
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(searchInput)
    setPage(1)
  }

  const hasFilter = category !== "전체" || searchTerm.length > 0

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-start md:justify-between items-start md:items-center mb-4">
        {/* Category tabs */}
        <div className="flex border-b order-2 md:order-1">
          {tabs.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleCategory(c)}
              className={`relative px-4 py-2 ${c === category ? "border border-foreground after:w-full after:h-[10px] after:bg-background after:absolute after:-bottom-1 after:left-0" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 w-full order-1 md:w-auto md:order-2"
        >
          <div className="relative flex-1 md:flex-initial">
            <Input
              name="searchTerm"
              placeholder="검색어를 입력하세요"
              className="pr-10"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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

      <NoticeTable notices={paginated} hasFilter={hasFilter} />

      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              role="button"
              tabIndex={0}
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                role="button"
                tabIndex={0}
                isActive={currentPage === p}
                onClick={() => setPage(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              role="button"
              tabIndex={0}
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  )
}
