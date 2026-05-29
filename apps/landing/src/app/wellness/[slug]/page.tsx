import { WellnessTemplate } from "@/assets/wellness-template";
import { wellnessPageData } from "@/const/wellness-detail";

export function generateStaticParams() {
  return Object.keys(wellnessPageData).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    return {
        title: `SE Club | ${wellnessPageData[slug].header.title}`,
        description: wellnessPageData[slug].header.subtitle,
    }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <WellnessTemplate wellnessPageData={wellnessPageData[slug]} slug={slug} />
}