import { createClient } from "@seclub/supabase/client";

// Video 타입 정의
export interface Video {
  id: string;
  created_at: string;
  link: string;
  title: string;
  order: number;
}

// YouTube ID 추출 함수
export function extractYouTubeId(url: string): string | null {
  // YouTube URL 패턴 정규식
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,    // youtube.com/watch?v=ID
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,                // youtu.be/ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i       // youtube.com/embed/ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

// 모든 비디오 가져오기
export async function fetchVideos(): Promise<{ videos: Video[], error: Error | null }> {
  try {
    const supabase = createClient();
    
    // order 순으로 정렬하여 가져오기
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("order", { ascending: true });
    
    if (error) throw error;
    
    return { videos: data || [], error: null };
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { videos: [], error: error as Error };
  }
}

// 특정 ID의 비디오 가져오기
export async function fetchVideoById(id: string): Promise<{ video: Video | null, error: Error | null }> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    
    return { video: data || null, error: null };
  } catch (error) {
    console.error(`Error fetching video with ID ${id}:`, error);
    return { video: null, error: error as Error };
  }
}

// 새 비디오 추가
export async function addVideo(video: Omit<Video, "id" | "created_at">): Promise<{ video: Video | null, error: Error | null }> {
  try {
    const supabase = createClient();
    
    // YouTube ID 추출 (URL이 제공된 경우)
    let videoLink = video.link;
    const youtubeId = extractYouTubeId(videoLink);
    
    // YouTube ID가 추출된 경우 해당 ID를 저장 (원본 URL 대신)
    if (youtubeId) {
      videoLink = youtubeId;
    }
    
    const { data, error } = await supabase
      .from("videos")
      .insert([
        {
          title: video.title,
          link: videoLink,
          order: video.order
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return { video: data || null, error: null };
  } catch (error) {
    console.error("Error adding video:", error);
    return { video: null, error: error as Error };
  }
}

// 비디오 업데이트
export async function updateVideo(id: string, video: Partial<Omit<Video, "id" | "created_at">>): Promise<{ video: Video | null, error: Error | null }> {
  try {
    const supabase = createClient();
    
    // YouTube ID 추출 (link가 업데이트되고 URL인 경우)
    if (video.link) {
      const youtubeId = extractYouTubeId(video.link);
      if (youtubeId) {
        video.link = youtubeId;
      }
    }
    
    const { data, error } = await supabase
      .from("videos")
      .update(video)
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { video: data || null, error: null };
  } catch (error) {
    console.error(`Error updating video with ID ${id}:`, error);
    return { video: null, error: error as Error };
  }
}

// 비디오 삭제
export async function deleteVideo(id: string): Promise<{ success: boolean, error: Error | null }> {
  try {
    const supabase = createClient();
    
    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", id);
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting video with ID ${id}:`, error);
    return { success: false, error: error as Error };
  }
}

// 비디오 순서 업데이트
export async function updateVideoOrder(videos: { id: string, order: number }[]): Promise<{ success: boolean, error: Error | null }> {
  try {
    const supabase = createClient();
    
    // unique 제약 조건을 피하기 위한 방법 적용
    // 1. 먼저 모든 관련 비디오에 임시(음수) order 값 할당
    for (let i = 0; i < videos.length; i++) {
      const { error } = await supabase
        .from("videos")
        .update({ order: -9999 - i }) // 임시 음수 값 사용
        .eq("id", videos[i].id);
        
      if (error) {
        console.error(`Error setting temporary order for video ${videos[i].id}:`, error);
        throw error;
      }
    }
    
    // 2. 그 다음 원하는 최종 order 값 설정
    for (const video of videos) {
      const { error } = await supabase
        .from("videos")
        .update({ order: video.order })
        .eq("id", video.id);
      
      if (error) {
        console.error(`Error setting final order for video ${video.id}:`, error);
        throw error;
      }
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating video order:", error);
    return { success: false, error: error as Error };
  }
}

// 마지막 순서 번호 가져오기 (새 비디오 추가 시 유용)
export async function getLastVideoOrder(): Promise<{ order: number, error: Error | null }> {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("videos")
      .select("order")
      .order("order", { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    const lastOrder = data && data.length > 0 ? data[0].order : 0;
    
    return { order: lastOrder, error: null };
  } catch (error) {
    console.error("Error getting last video order:", error);
    return { order: 0, error: error as Error };
  }
}
