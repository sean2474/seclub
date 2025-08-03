"use server";

import { createClient } from "@/lib/supabase/server";
import type { Notice } from "@/types/notices";
import crypto from "crypto";

/**
 * Fetch all notices from the database
 */
export async function getNotices(): Promise<{
  success: boolean;
  data: Notice[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("notice")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching notices:", error);
      return {
        success: false,
        data: null,
        error: "공지사항을 불러오는 중 오류가 발생했습니다.",
      };
    }

    const notices = data.map((notice: Notice) => {
      notice.content = notice.content.replace(/\\n/g, "\n");
      return notice;
    });

    return {
      success: true,
      data: notices,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error fetching notices:", error);
    return {
      success: false,
      data: null,
      error: "공지사항을 불러오는 중 오류가 발생했습니다.",
    };
  }
}

/**
 * Get a single notice by ID
 */
export async function getNoticeById(id: string): Promise<{
  success: boolean;
  data: Notice | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("notice")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error(`Error fetching notice with ID ${id}:`, error);
      return {
        success: false,
        data: null,
        error: "공지사항을 불러오는 중 오류가 발생했습니다.",
      };
    }
    
    if (!data) {
      return {
        success: false,
        data: null,
        error: "해당 공지사항을 찾을 수 없습니다.",
      };
    }
    
    return {
      success: true,
      data: data,
      error: null,
    };
  } catch (error) {
    console.error(`Unexpected error fetching notice with ID ${id}:`, error);
    return {
      success: false,
      data: null,
      error: "공지사항을 불러오는 중 오류가 발생했습니다.",
    };
  }
}

/**
 * Create a new notice with images
 */
export async function createNotice(noticeData: {
  title: string;
  content: string;
  category: string;
  active: boolean;
  images?: string[];
}): Promise<{
  success: boolean;
  data: Notice | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    
    const noticeUuid = crypto.randomUUID();
    
    let imageUrls: string[] = [];
    
    if (noticeData.images && noticeData.images.length > 0) {
      for (const imageBase64 of noticeData.images) {
        const base64Data = imageBase64.split(",")[1];
        if (!base64Data) continue;
        
        const blob = Buffer.from(base64Data, 'base64');
        const filename = `${noticeUuid}/${crypto.randomUUID()}.jpg`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('notice')
          .upload(filename, blob, {
            contentType: 'image/jpeg'
          });
        
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          continue;
        }
        
        const { data: { publicUrl } } = supabase
          .storage
          .from('notice')
          .getPublicUrl(filename);
        
        imageUrls.push(publicUrl);
      }
    }
    
    const { data, error } = await supabase
      .from("notice")
      .insert({
        id: noticeUuid,
        title: noticeData.title,
        content: noticeData.content.replace(/\n/g, "\\n"),
        category: noticeData.category,
        active: noticeData.active,
        images: imageUrls.length > 0 ? imageUrls : null
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating notice:", error);
      return {
        success: false,
        data: null,
        error: "공지사항 생성 중 오류가 발생했습니다.",
      };
    }
    
    if (data) {
      data.content = data.content.replace(/\\n/g, "\n");
    }
    
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error creating notice:", error);
    return {
      success: false,
      data: null,
      error: "공지사항 생성 중 오류가 발생했습니다.",
    };
  }
}

/**
 * Update an existing notice
 */
export async function updateNotice(id: string, noticeData: {
  title?: string;
  content?: string;
  category?: string;
  active?: boolean;
  images?: string[];
}): Promise<{
  success: boolean;
  data: Notice | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const noticeUuid = id;
    
    const { data: currentNotice, error: fetchError } = await supabase
      .from("notice")
      .select("*")
      .eq("id", id)
      .single();
    
    if (fetchError) {
      console.error(`Error fetching notice with ID ${id}:`, fetchError);
      return {
        success: false,
        data: null,
        error: "공지사항을 찾을 수 없습니다.",
      };
    }
    
    let updatedImageUrls = [...(currentNotice.images || [])];
    const removedImages = currentNotice.images?.filter((image: string) => !noticeData.images?.includes(image));
    const addedImages = noticeData.images?.filter((image: string) => !currentNotice.images?.includes(image));
    
    if (removedImages && removedImages.length > 0) {
      for (const imageUrl of removedImages) {
        const filename = imageUrl.split('/').pop();
        if (!filename) continue;
        
        const { error: deleteError } = await supabase
          .storage
          .from('notice')
          .remove([filename]);
        
        if (deleteError) {
          console.error(`Error deleting image ${filename}:`, deleteError);
        }
        
        // Remove from our updated URLs array
        updatedImageUrls = updatedImageUrls.filter(url => url !== imageUrl);
      }
    }
    
    // Add new images if any
    if (addedImages && addedImages.length > 0) {
      for (const imageBase64 of addedImages) {
        const base64Data = imageBase64.split(",")[1];
        if (!base64Data) continue;
        
        const blob = Buffer.from(base64Data, 'base64');
        const filename = `${noticeUuid}/${crypto.randomUUID()}.jpg`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('notice')
          .upload(filename, blob, {
            contentType: 'image/jpeg'
          });
        
        if (uploadError) {
          console.error("Error uploading image:", uploadError);
          continue;
        }
        
        const { data: { publicUrl } } = supabase
          .storage
          .from('notice')
          .getPublicUrl(filename);
        
        updatedImageUrls.push(publicUrl);
      }
    }
    
    // Prepare update data
    const updateData: any = {};
    if (noticeData.title !== undefined) updateData.title = noticeData.title;
    if (noticeData.content !== undefined) updateData.content = noticeData.content.replace(/\n/g, "\\n");
    if (noticeData.category !== undefined) updateData.category = noticeData.category;
    if (noticeData.active !== undefined) updateData.active = noticeData.active;
    updateData.images = updatedImageUrls.length > 0 ? updatedImageUrls : null;
    updateData.updated_at = new Date().toISOString();
    
    // Update the notice
    const { data, error } = await supabase
      .from("notice")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating notice with ID ${id}:`, error);
      return {
        success: false,
        data: null,
        error: "공지사항 수정 중 오류가 발생했습니다.",
      };
    }
    
    // Convert \n back to actual newlines for frontend
    if (data) {
      data.content = data.content.replace(/\\n/g, "\n");
    }
    
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    console.error(`Unexpected error updating notice with ID ${id}:`, error);
    return {
      success: false,
      data: null,
      error: "공지사항 수정 중 오류가 발생했습니다.",
    };
  }
}

/**
 * Delete a notice and its images
 */
export async function deleteNotice(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    
    // First, get the notice to find any associated images
    const { data: notice, error: fetchError } = await supabase
      .from("notice")
      .select("images")
      .eq("id", id)
      .single();
    
    if (fetchError) {
      console.error(`Error fetching notice with ID ${id}:`, fetchError);
      return {
        success: false,
        error: "공지사항을 찾을 수 없습니다.",
      };
    }
    
    // Delete any associated images from storage
    if (notice.images && notice.images.length > 0) {
      const filenames = notice.images.map((url: string) => url.split('/').pop()).filter(Boolean);
      
      if (filenames.length > 0) {
        const { error: deleteImagesError } = await supabase
          .storage
          .from('notice')
          .remove(filenames as string[]);
        
        if (deleteImagesError) {
          console.error(`Error deleting images for notice ${id}:`, deleteImagesError);
          // Continue with deletion even if image deletion fails
        }
      }
    }
    
    // Delete the notice from the database
    const { error: deleteError } = await supabase
      .from("notice")
      .delete()
      .eq("id", id);
    
    if (deleteError) {
      console.error(`Error deleting notice with ID ${id}:`, deleteError);
      return {
        success: false,
        error: "공지사항 삭제 중 오류가 발생했습니다.",
      };
    }
    
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(`Unexpected error deleting notice with ID ${id}:`, error);
    return {
      success: false,
      error: "공지사항 삭제 중 오류가 발생했습니다.",
    };
  }
}