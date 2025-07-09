import { WellnessDetail } from "@/assets/wellness-detail";
import { WellnessType } from "@/types";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <WellnessDetail wellnessType={slug as WellnessType} />
}