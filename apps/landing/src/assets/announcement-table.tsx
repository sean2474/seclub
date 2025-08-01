"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Announcement } from "@/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const AnnouncementTable = ({
  announcements,
  itemsPerPage
}: {
  announcements: Announcement[];
  itemsPerPage: number;
}) => {
  const params = useSearchParams();
  const category = params.get("category") || "전체";
  const searchTerm = params.get("searchTerm") || "";
  const currentPage = Number(params.get("currentPage") || "1");
  const router = useRouter();

  const filteredAnnouncements = announcements
    .filter((item) => category === "전체" || item.category === category)
    .filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      {/* Announcement table */}
      <div className="">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2">
              <TableHead className="w-[150px] text-center">분류</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-[150px] text-center">작성일</TableHead>
              <TableHead className="w-[100px] text-center">조회수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAnnouncements.map((item) => (
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
    </>
  )
}