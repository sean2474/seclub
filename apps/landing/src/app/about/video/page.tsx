"use client"

import { useEffect, useState } from "react"
import { PlayCircle } from "lucide-react"
import { Dialog, DialogContent } from "@seclub/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import Image from "next/image"
import { getVideos } from "@/lib/actions/video"
import { Video } from "@/types/video"

export default function VideoGalleryPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      const data = await getVideos();
      if (!data) return;
      setVideos(data);
    };
    fetchVideos();
  }, []);

  return (
    <div className="bg-background min-h-screen text-foreground pt-[var(--header-height-expanded)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">영상 갤러리</h1>
          <p className="mt-4 text-lg text-foreground/80">SE Club의 다채로운 순간들을 영상으로 만나보세요.</p>
        </header>

        <Dialog open={!!selectedVideoId} onOpenChange={(isOpen) => !isOpen && setSelectedVideoId(null)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {videos.map((video) => (
              <div key={video.id} onClick={() => setSelectedVideoId(video.id)} className="group cursor-pointer">
                <div className="relative aspect-[16/8.9] w-full overflow-hidden rounded-sm">
                  <Image
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/90 bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="w-10 h-10 text-white opacity-80" strokeWidth={1} />
                  </div>
                </div>
                <h3 className="mt-4 text-base font-medium text-foreground">{video.title}</h3>
              </div>
            ))}
          </div>

          <DialogContent className="bg-transparent border-0 p-0 w-full max-w-4xl h-auto shadow-none">
            <DialogTitle className="hidden">{selectedVideoId}</DialogTitle>
            <div className="aspect-video">
              {selectedVideoId && (
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full rounded-sm"
                ></iframe>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
