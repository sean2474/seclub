"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Notice } from "@/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const NoticeTable = ({
  notices,
  itemsPerPage
}: {
  notices: Notice[];
  itemsPerPage: number;
}) => {
  const params = useSearchParams();
  const category = params.get("category") || "전체";
  const searchTerm = params.get("searchTerm") || "";
  const currentPage = Number(params.get("currentPage") || "1");
  const router = useRouter();

  const filteredNotices = notices
    .filter((item) => category === "전체" || item.category === category)
    .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="">
      <div className="md:hidden space-y-2 divide-y divide-foreground/30 mt-2">
        {notices.map((notice) => (
          <div key={notice.id} className="pb-2 relative">
            <Link href={`/notices/${notice.id}`}>
              <p className="text-sm text-foreground/80">{notice.category}</p>
              <h4>{notice.title}</h4>
              <div className="flex gap-2">
                <p className="text-sm text-foreground/80">작성일: {notice.date}</p>
                <p className="text-sm text-foreground/80">조회수: {notice.views}</p>
              </div>
            </Link>
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
            <TableRow key={item.id} className="cursor-pointer hover:bg-secondary/10" onClick={() => router.push(`/notices/${item.id}`)}>
              <TableCell className="text-center text-foreground/80">{item.category}</TableCell>
              <TableCell className="font-medium text-foreground">
                <div className="block w-full h-full">
                  {item.title}
                </div>
              </TableCell>
              <TableCell className="text-center text-foreground/80">{item.date}</TableCell>
              <TableCell className="text-center text-foreground/80">{item.views}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}