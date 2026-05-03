"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Add a new category to the database
 */
export async function addCategory(type: string): Promise<{
  success: boolean;
  data: string | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    
    // Check if category already exists
    const { data: existingCategory } = await supabase
      .from("category")
      .select("*")
      .eq("type", type)
      .single();
    
    if (existingCategory) {
      return {
        success: false,
        data: null,
        error: "이미 존재하는 카테고리입니다.",
      };
    }
    
    // Add new category
    const { data, error } = await supabase
      .from("category")
      .insert({ type })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding category:", error);
      return {
        success: false,
        data: null,
        error: "카테고리 추가 중 오류가 발생했습니다.",
      };
    }
    
    return {
      success: true,
      data: data.type,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error adding category:", error);
    return {
      success: false,
      data: null,
      error: "카테고리 추가 중 예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * Update a category in the database
 */
export async function updateCategory(oldType: string, newType: string): Promise<{
  success: boolean;
  data: string | null;
  error: string | null;
}> {
  try {
    if (!oldType || !newType || newType.trim() === "") {
      return {
        success: false,
        data: null,
        error: "유효한 카테고리명을 입력해주세요.",
      };
    }
    
    const supabase = await createClient();
    
    // Check if new category name already exists (but is not the same as old name)
    if (oldType !== newType) {
      const { data: existingCategory } = await supabase
        .from("category")
        .select("*")
        .eq("type", newType.trim())
        .single();
      
      if (existingCategory) {
        return {
          success: false,
          data: null,
          error: "이미 존재하는 카테고리명입니다.",
        };
      }
    }
    
    // Update the category
    const { data, error } = await supabase
      .from("category")
      .update({ type: newType.trim() })
      .eq("type", oldType)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating category:", error);
      return {
        success: false,
        data: null,
        error: "카테고리 수정 중 오류가 발생했습니다.",
      };
    }
    
    // Also update all notices with this category
    const { error: noticeUpdateError } = await supabase
      .from("notice")
      .update({ category: newType.trim() })
      .eq("category", oldType);
    
    if (noticeUpdateError) {
      console.error("Error updating notices with category:", noticeUpdateError);
      // Continue anyway since the category was updated successfully
    }
    
    return {
      success: true,
      data: data.type,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error updating category:", error);
    return {
      success: false,
      data: null,
      error: "카테고리 수정 중 예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * Delete a category from the database if it's not in use
 */
export async function deleteCategory(type: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const supabase = await createClient();
    
    // Check if the category is being used in any notices
    const { data: notices, error: noticeError } = await supabase
      .from("notice")
      .select("id")
      .eq("category", type);
    
    if (noticeError) {
      console.error("Error checking notices for category:", noticeError);
      return {
        success: false,
        error: "카테고리 확인 중 오류가 발생했습니다.",
      };
    }
    
    if (notices && notices.length > 0) {
      return {
        success: false,
        error: `이 카테고리는 ${notices.length}개의 공지에서 사용중입니다. 카테고리를 사용하는 공지가 없어야 삭제 가능합니다.`,
      };
    }
    
    // Delete the category
    const { error } = await supabase
      .from("category")
      .delete()
      .eq("type", type);
    
    if (error) {
      console.error("Error deleting category:", error);
      return {
        success: false,
        error: "카테고리 삭제 중 오류가 발생했습니다.",
      };
    }
    
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error deleting category:", error);
    return {
      success: false,
      error: "카테고리 삭제 중 예기치 않은 오류가 발생했습니다.",
    };
  }
}

/**
 * Fetch all categories. Falls back to categories used in existing notices
 * when the `category` table is empty (recovers gracefully from missing seed).
 */
export async function getCategories(): Promise<{
  success: boolean;
  data: string[] | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("category")
      .select("type")
      .order("type", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return {
        success: false,
        data: null,
        error: "카테고리를 불러오는 중 오류가 발생했습니다.",
      };
    }

    const tableCats = data.map((c: { type: string }) => c.type);

    // notice 테이블에서 실제로 사용 중인 카테고리도 포함하여 누락 방지
    const { data: noticeData } = await supabase.from("notice").select("category");
    const noticeCats = (noticeData || [])
      .map((n: { category: string }) => n.category)
      .filter(Boolean);

    const merged = Array.from(new Set([...tableCats, ...noticeCats])).sort();

    return {
      success: true,
      data: merged,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error fetching categories:", error);
    return {
      success: false,
      data: null,
      error: "카테고리를 불러오는 중 오류가 발생했습니다.",
    };
  }
}