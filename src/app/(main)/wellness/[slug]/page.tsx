import { WellnessTemplate } from "@/assets/wellness-template";
import { wellnessPageData } from "@/const/wellness-detail";
import { WellnessType } from "@/types";
// import { WellnessType } from "@/types";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug as WellnessType
  return <WellnessTemplate wellnessData={wellnessPageData[slug]} slug={slug} />
}