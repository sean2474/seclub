import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import { createClient } from "@/lib/supabase/server";

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

  const images = files.map(file =>
    supabase
      .storage
      .from("gallery")
      .getPublicUrl(file.name)
      .data
      .publicUrl
  );

  const pageImages = [...images, ...images, ...images, ...images, ...images];

  return (
    <main className="pb-20">
      <ParallaxScroll images={pageImages} />
    </main>
  );
}