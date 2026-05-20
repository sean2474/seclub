import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { createClient } from "@seclub/supabase/server";
import { generateMetadata } from "@/utils/metadata-generator";

export const metadata = generateMetadata("SE Club | 갤러리", "SE Club의 다양한 모습을 확인할 수 있는 갤러리입니다.");

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: files, error } = await supabase
    .storage
    .from("gallery")
    .list("", {
      offset: 0,
      sortBy: { column: "name", order: "asc" }
    })

  if (error) {
    console.error("Supabase list error:", error);
    return <p>이미지 로드에 실패했습니다.</p>;
  }

  const images = files
    .filter(file => /_small\.(jpg|jpeg|png|gif|webp)$/i.test(file.name))
    .map(file =>
      supabase
        .storage
        .from("gallery")
        .getPublicUrl(file.name)
        .data
        .publicUrl
    );

  return (
    <main className="pb-20">
      <ParallaxScroll images={images} repeat={5} />
    </main>
  );
}