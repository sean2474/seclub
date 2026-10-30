import Image from "next/image";

export function GalleryGrid({ images }: { images: string[] }) {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-2 py-8 md:gap-10 md:px-10 lg:grid-cols-3">
      {images.map((src, index) => (
        <div key={src} className="relative aspect-[3/2] overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={src}
            alt={`SE Club 갤러리 사진 ${index + 1}`}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1023px) calc((100vw - 120px) / 2), (max-width: 1279px) calc((100vw - 160px) / 3), 374px"
            quality={75}
            loading={index < 2 ? "eager" : "lazy"}
            className="object-cover object-left-top"
          />
        </div>
      ))}
    </div>
  );
}
