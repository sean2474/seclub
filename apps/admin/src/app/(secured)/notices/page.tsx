import { Suspense } from "react";
import { NoticesContent } from "./notice-content";

export default function NoticesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">
      <h2 className="text-xl font-medium">로딩 중...</h2>
      <p className="text-muted-foreground">공지사항을 불러오는 중입니다.</p>
    </div>}>
      <NoticesContent />
    </Suspense>
  )
}

