import { WellnessTemplate } from "@/assets/wellness-template";
import { wellnessPageData } from "@/const/wellness-detail";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <WellnessTemplate wellnessPageData={wellnessPageData[slug]} slug={slug} />
}