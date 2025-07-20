export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string | null
          customer_address: string
          customer_id: string | null
          estimated_duration: number | null
          id: string
          provider_id: string | null
          service_id: string | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string | null
          customer_address: string
          customer_id?: string | null
          estimated_duration?: number | null
          id?: string
          provider_id?: string | null
          service_id?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string | null
          customer_address?: string
          customer_id?: string | null
          estimated_duration?: number | null
          id?: string
          provider_id?: string | null
          service_id?: string | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          quantity: number | null
          selected_date: string | null
          selected_time: string | null
          service_id: string | null
          special_notes: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          quantity?: number | null
          selected_date?: string | null
          selected_time?: string | null
          service_id?: string | null
          special_notes?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          quantity?: number | null
          selected_date?: string | null
          selected_time?: string | null
          service_id?: string | null
          special_notes?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          service_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          service_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          service_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          provider_id: string | null
          rating: number | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          provider_id?: string | null
          rating?: number | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          provider_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          average_rating: number | null
          background_checked: boolean | null
          business_name: string
          certifications: string[] | null
          created_at: string | null
          description: string | null
          experience_years: number | null
          hourly_rate: number | null
          id: string
          insurance_verified: boolean | null
          service_areas: string[] | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          average_rating?: number | null
          background_checked?: boolean | null
          business_name: string
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          service_areas?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          average_rating?: number | null
          background_checked?: boolean | null
          business_name?: string
          certifications?: string[] | null
          created_at?: string | null
          description?: string | null
          experience_years?: number | null
          hourly_rate?: number | null
          id?: string
          insurance_verified?: boolean | null
          service_areas?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          base_price: number | null
          category: string
          created_at: string | null
          description: string | null
          estimated_duration: number | null
          id: string
          images: string[] | null
          included_items: string[] | null
          price_per_hour: number | null
          provider_id: string | null
          requirements: string[] | null
          service_area: string[] | null
          status: Database["public"]["Enums"]["service_status"] | null
          subcategory: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          category: string
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          images?: string[] | null
          included_items?: string[] | null
          price_per_hour?: number | null
          provider_id?: string | null
          requirements?: string[] | null
          service_area?: string[] | null
          status?: Database["public"]["Enums"]["service_status"] | null
          subcategory?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          category?: string
          created_at?: string | null
          description?: string | null
          estimated_duration?: number | null
          id?: string
          images?: string[] | null
          included_items?: string[] | null
          price_per_hour?: number | null
          provider_id?: string | null
          requirements?: string[] | null
          service_area?: string[] | null
          status?: Database["public"]["Enums"]["service_status"] | null
          subcategory?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      service_status: "active" | "inactive" | "pending"
      user_role: "customer" | "provider" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      service_status: ["active", "inactive", "pending"],
      user_role: ["customer", "provider", "admin"],
    },
  },
} as const
