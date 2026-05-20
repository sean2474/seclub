import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // my.seclub.kr 서브도메인 처리
  if (hostname.startsWith("my.") || hostname.startsWith("my-")) {
    // 이미 /my 경로면 그대로 진행
    if (pathname.startsWith("/my")) {
      return NextResponse.next();
    }
    
    // /my 경로로 리라이트
    const url = request.nextUrl.clone();
    url.pathname = `/my${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 정적 파일과 API 제외
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_vercel).*)",
  ],
};
