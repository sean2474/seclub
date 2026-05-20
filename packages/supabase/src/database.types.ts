export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      camping_guide: {
        Row: {
          id: string
          sections: Json
          updated_at: string
        }
        Insert: {
          id?: string
          sections?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          sections?: Json
          updated_at?: string
        }
        Relationships: []
      }
      category: {
        Row: {
          created_at: string
          id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: string
        }
        Relationships: []
      }
      discount_rates: {
        Row: {
          category: string
          discount_percent: number
          id: number
          nights: string
          season: string
        }
        Insert: {
          category: string
          discount_percent: number
          id?: number
          nights: string
          season: string
        }
        Update: {
          category?: string
          discount_percent?: number
          id?: number
          nights?: string
          season?: string
        }
        Relationships: []
      }
      gallery_reborn_items: {
        Row: {
          caption_en: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_path: string
          layout_type: string
          small_path: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          caption_en?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_path: string
          layout_type?: string
          small_path?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          caption_en?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_path?: string
          layout_type?: string
          small_path?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      late_checkout_rates: {
        Row: {
          hours_3: number
          hours_6: number
          id: number
          room_id: number
        }
        Insert: {
          hours_3: number
          hours_6: number
          id?: number
          room_id: number
        }
        Update: {
          hours_3?: number
          hours_6?: number
          id?: number
          room_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "late_checkout_rates_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: true
            referencedRelation: "room_rates"
            referencedColumns: ["id"]
          },
        ]
      }
      main_hero_text: {
        Row: {
          button_text: string
          heading_line1: string
          heading_line2: string
          id: string
          notices_new_badge: boolean
          tagline: string
          updated_at: string
        }
        Insert: {
          button_text?: string
          heading_line1?: string
          heading_line2?: string
          id?: string
          notices_new_badge?: boolean
          tagline?: string
          updated_at?: string
        }
        Update: {
          button_text?: string
          heading_line1?: string
          heading_line2?: string
          id?: string
          notices_new_badge?: boolean
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      notice: {
        Row: {
          active: boolean
          category: string
          content: string
          created_at: string
          id: string
          images: string[] | null
          pinned: boolean | null
          title: string
          updated_at: string
          view: number
        }
        Insert: {
          active: boolean
          category: string
          content: string
          created_at?: string
          id?: string
          images?: string[] | null
          pinned?: boolean | null
          title: string
          updated_at?: string
          view?: number
        }
        Update: {
          active?: boolean
          category?: string
          content?: string
          created_at?: string
          id?: string
          images?: string[] | null
          pinned?: boolean | null
          title?: string
          updated_at?: string
          view?: number
        }
        Relationships: [
          {
            foreignKeyName: "notice_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["type"]
          },
        ]
      }
      popups: {
        Row: {
          active: boolean
          content: string | null
          created_at: string
          end_date: string | null
          id: string
          image_url: string | null
          link_url: string | null
          priority: number
          start_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          content?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          priority?: number
          start_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          content?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          image_url?: string | null
          link_url?: string | null
          priority?: number
          start_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          created_at: string | null
          id: string
          image_path: string | null
          name: string | null
          role: Database["public"]["Enums"]["role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_path?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_path?: string | null
          name?: string | null
          role?: Database["public"]["Enums"]["role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      room_infos: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          is_active: boolean | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          id?: string
          is_active?: boolean | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          is_active?: boolean | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      room_rates: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: number
          long_stay_discount: number | null
          name: string
          peak_rate: number
          type: string
          updated_at: string | null
          winter_rate: number
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: number
          long_stay_discount?: number | null
          name: string
          peak_rate: number
          type: string
          updated_at?: string | null
          winter_rate: number
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: number
          long_stay_discount?: number | null
          name?: string
          peak_rate?: number
          type?: string
          updated_at?: string | null
          winter_rate?: number
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          id: string
          link: string
          order: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          link: string
          order: number
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string
          order?: number
          title?: string
        }
        Relationships: []
      }
      wellness_programs: {
        Row: {
          contents: Json
          header: Json
          images: Json
          slug: string
          updated_at: string
        }
        Insert: {
          contents?: Json
          header: Json
          images?: Json
          slug: string
          updated_at?: string
        }
        Update: {
          contents?: Json
          header?: Json
          images?: Json
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_notice_view_count: {
        Args: { p_notice_id: string }
        Returns: undefined
      }
      reorder_gallery_reborn_items: {
        Args: { p_orders: Json }
        Returns: undefined
      }
      reorder_videos: { Args: { p_orders: Json }; Returns: undefined }
    }
    Enums: {
      role: "admin" | "reservation_manager" | "gallery_manager" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      role: ["admin", "reservation_manager", "gallery_manager", "user"],
    },
  },
} as const
