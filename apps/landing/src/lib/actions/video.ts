"use server"

import { createClient } from "@seclub/supabase/server";
import { Video } from "@/types/video";

export const getVideos = async (): Promise<Video[] | null> => {
    const supabase = await createClient();

    const { data, error } = await supabase.from("videos").select("*");

    if (!data) {
        return null;
    }
    
    const video: Video[] = data.map((video) => {
      return {
        id: video.link,
        title: video.title,
      }
    })

    if (error) {
        console.error("Error fetching videos:", error);
        return null;
    }

    return video;
}
    