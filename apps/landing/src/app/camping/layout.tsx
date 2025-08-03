import { generateMetadata } from "@/utils/metadata-generator";

export const metadata = generateMetadata("SE클럽 | 캠핑장", "SE클럽의 캠핑장 안내 및 시설 정보");

export default function CampingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
