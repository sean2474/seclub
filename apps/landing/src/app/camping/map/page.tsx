import { Modal, ModalBody, ModalTrigger } from "@/components/ui/animated-modal"
import { Button } from "@/components/ui/button"
import { Download, Map } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { generateMetadata } from "@/utils/metadata-generator";

export const metadata = generateMetadata("SE클럽 | 캠핑장 배치도", "SE클럽 캠핑장의 종합 배치도 및 안내");

export default function Page() {
  return (
    <main className="mt-[var(--header-height-expanded)] flex flex-col items-center gap-4">
      <h2 className="mt-4">캠핑장 종합 배치도</h2>
      <Modal>
        <div className="relative h-[50svh] w-full p-2">
          <Image src="/images/about/map.png" alt="캠핑장 종합 배치도" fill className="object-contain" />
        </div>
        <div className="flex gap-4">
          <Link href="/images/about/map.png" download="seclub-map.png">
            <Button className="border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300 mb-4"> <Download /> 다운로드</Button>
          </Link>
          <ModalTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive touch-manipulation bg-background active:bg-transparent active:text-background border border-foreground text-foreground hover:bg-foreground hover:text-background mb-4 h-9 px-4 py-2 has-[>svg]:px-3"> <Map /> 자세히보기</ModalTrigger>
        </div>
        <ModalBody className="w-svw h-svh">
          <div className="relative w-full h-full">
            <Image src="/images/about/map.png" alt="캠핑장 종합 배치도" fill className="object-contain" />
          </div>
        </ModalBody>
      </Modal>
    </main>
  )
}