import { generateMetadata } from "@/utils/metadata-generator";

export const metadata = generateMetadata("SE Club | 캠핑장", "SE Club의 캠핑장 안내 및 시설 정보");

export default function CampingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
