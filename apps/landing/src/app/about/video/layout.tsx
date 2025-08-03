import { generateMetadata } from "@/utils/metadata-generator";

export const metadata = generateMetadata("SE클럽 | 영상 갤러리", "SE클럽의 다양한 모습을 영상으로 확인할 수 있는 갤러리입니다.");

export default function VideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
