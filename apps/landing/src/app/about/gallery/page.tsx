import fs from "fs";
import path from "path";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";

export default function GalleryPage() {
  const galleryDir = path.join(process.cwd(), "public/images/gallery");
  const files = fs
    .readdirSync(galleryDir)
    .filter((file) => /\.(jpe?g|png|webp|gif)$/i.test(file));
  const images = files.map((file) => `/images/gallery/${file}`);
  const pageImages = [...images, ...images];

  return (
    <main className="mb-20">
      <ParallaxScroll images={pageImages} />
    </main>
  );
}
