import { WellnessTemplate } from "@/assets/wellness-template";
import { WellnessType } from "@/types";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <WellnessTemplate />
}