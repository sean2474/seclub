import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@seclub/ui/table"
import { Notice } from "@/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const NoticeTable = ({
  notices,
  hasFilter,
}: {
  notices: Notice[];
  hasFilter: boolean;
}) => {
  if (notices.length === 0) {
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
        {notices.map((notice) => (
          <Link
            key={notice.id}
            href={`/notices/${notice.id}`}
            prefetch={false}
            className="block pb-2 relative cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2"
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
          </Link>
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
          {notices.map((item) => (
            <TableRow
              key={item.id}
              className="relative hover:bg-secondary/10"
            >
              <TableCell className="text-center text-foreground/80">{item.category}</TableCell>
              <TableCell className="font-medium text-foreground">
                <Link href={`/notices/${item.id}`} prefetch={false} className="flex items-center gap-2 after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2">
                  {item.pinned && <span className="text-xs bg-foreground text-background px-1.5 py-0.5 shrink-0">고정</span>}
                  {item.title}
                </Link>
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
