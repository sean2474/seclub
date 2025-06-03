import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="border-t bg-muted py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} SE클럽. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
            이용약관
          </Link>
        </div>
      </div>
    </footer>
  )
}