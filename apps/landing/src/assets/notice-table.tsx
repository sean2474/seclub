"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Notice } from "@/types";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export const NoticeTable = ({
  notices,
  currentPage,
  itemsPerPage,
  hasFilter,
}: {
  notices: Notice[];
  currentPage: number;
  itemsPerPage: number;
  hasFilter: boolean;
}) => {
  const router = useRouter();
  const params = useSearchParams();

  const buildDetailHref = (id: string | number) => {
    const qs = params.toString()
    return qs ? `/notices/${id}?${qs}` : `/notices/${id}`
  }

  const paginatedNotices = notices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (paginatedNotices.length === 0) {
    return (
      <div className="py-16 text-center text-foreground/60">
        {hasFilter
          ? "조건에 맞는 공지사항이 없습니다."
          : "등록된 공지사항이 없습니다."}
      </div>
    )
  }

  return (
    <div className="">
      <div className="md:hidden space-y-2 divide-y divide-foreground/30 mt-2">
        {paginatedNotices.map((notice) => (
          <div
            key={notice.id}
            className="pb-2 relative cursor-pointer"
            onClick={() => router.push(buildDetailHref(notice.id))}
          >
            <p className="text-sm text-foreground/80">{notice.category}</p>
            <h4 className="flex items-center gap-1.5">
              {notice.pinned && <span className="text-xs bg-foreground text-background px-1.5 py-0.5 shrink-0">고정</span>}
              {notice.title}
            </h4>
            <div className="flex gap-2">
              <p className="text-sm text-foreground/80">작성일: {notice.created_at.split("T")[0]}</p>
              <p className="text-sm text-foreground/80">조회수: {notice.view}</p>
            </div>
            <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground/50" strokeWidth={1.5} />
          </div>
        ))}
      </div>
      <Table className="hidden md:table">
        <TableHeader>
          <TableRow className="border-b-2">
            <TableHead className="w-[150px] text-center">분류</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[150px] text-center">작성일</TableHead>
            <TableHead className="w-[100px] text-center">조회수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedNotices.map((item) => (
            <TableRow key={item.id} className="cursor-pointer hover:bg-secondary/10" onClick={() => router.push(buildDetailHref(item.id))}>
              <TableCell className="text-center text-foreground/80">{item.category}</TableCell>
              <TableCell className="font-medium text-foreground">
                <div className="flex items-center gap-2">
                  {item.pinned && <span className="text-xs bg-foreground text-background px-1.5 py-0.5 shrink-0">고정</span>}
                  {item.title}
                </div>
              </TableCell>
              <TableCell className="text-center text-foreground/80">{item.created_at.split("T")[0]}</TableCell>
              <TableCell className="text-center text-foreground/80">{item.view}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
