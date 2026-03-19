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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      chat_options: {
        Row: {
          chat_query: string
          chat_text: string
          created_at: string | null
          id: string
        }
        Insert: {
          chat_query: string
          chat_text: string
          created_at?: string | null
          id?: string
        }
        Update: {
          chat_query?: string
          chat_text?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      clinic_appointments: {
        Row: {
          appointment_code: string
          appointment_date: string | null
          appointment_time: string | null
          booked_via: string | null
          booking_date: string | null
          created_at: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          line_id: string | null
          notes: string | null
          price_estimate: number | null
          service_name: string | null
          staff_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_code: string
          appointment_date?: string | null
          appointment_time?: string | null
          booked_via?: string | null
          booking_date?: string | null
          created_at?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          line_id?: string | null
          notes?: string | null
          price_estimate?: number | null
          service_name?: string | null
          staff_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_code?: string
          appointment_date?: string | null
          appointment_time?: string | null
          booked_via?: string | null
          booking_date?: string | null
          created_at?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          line_id?: string | null
          notes?: string | null
          price_estimate?: number | null
          service_name?: string | null
          staff_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clinic_customers: {
        Row: {
          age: number | null
          allergies: string | null
          created_at: string | null
          customer_code: string
          date_of_birth: string | null
          email: string | null
          favorite_services: string | null
          first_visit_date: string | null
          full_name: string
          gender: string | null
          id: string
          is_active: boolean | null
          line_id: string | null
          membership_status: string | null
          notes: string | null
          phone: string | null
          total_purchase: number | null
          total_visits: number | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          allergies?: string | null
          created_at?: string | null
          customer_code: string
          date_of_birth?: string | null
          email?: string | null
          favorite_services?: string | null
          first_visit_date?: string | null
          full_name: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          line_id?: string | null
          membership_status?: string | null
          notes?: string | null
          phone?: string | null
          total_purchase?: number | null
          total_visits?: number | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          allergies?: string | null
          created_at?: string | null
          customer_code?: string
          date_of_birth?: string | null
          email?: string | null
          favorite_services?: string | null
          first_visit_date?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          is_active?: boolean | null
          line_id?: string | null
          membership_status?: string | null
          notes?: string | null
          phone?: string | null
          total_purchase?: number | null
          total_visits?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clinic_faq: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          faq_code: string
          id: string
          keywords: string | null
          question: string
          related_services: string | null
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          faq_code: string
          id?: string
          keywords?: string | null
          question: string
          related_services?: string | null
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          faq_code?: string
          id?: string
          keywords?: string | null
          question?: string
          related_services?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clinic_knowledge: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          duration: string | null
          id: string
          is_active: boolean | null
          price_info: string | null
          source: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          is_active?: boolean | null
          price_info?: string | null
          source?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          duration?: string | null
          id?: string
          is_active?: boolean | null
          price_info?: string | null
          source?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clinic_services: {
        Row: {
          age_recommendation: string | null
          category: string | null
          created_at: string | null
          description: string | null
          duration_minutes: string | null
          expected_result: string | null
          id: string
          is_active: boolean | null
          name: string
          price_max: string | null
          price_min: string | null
          recommended_sessions: string | null
          service_code: string
          updated_at: string | null
        }
        Insert: {
          age_recommendation?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: string | null
          expected_result?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_max?: string | null
          price_min?: string | null
          recommended_sessions?: string | null
          service_code: string
          updated_at?: string | null
        }
        Update: {
          age_recommendation?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: string | null
          expected_result?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_max?: string | null
          price_min?: string | null
          recommended_sessions?: string | null
          service_code?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      clinic_staff: {
        Row: {
          cases_per_day: string | null
          created_at: string | null
          experience_years: string | null
          full_name: string
          id: string
          is_active: boolean | null
          languages: string | null
          line_id: string | null
          position: string | null
          specialties: string | null
          staff_code: string
          updated_at: string | null
          working_days: string | null
          working_hours: string | null
        }
        Insert: {
          cases_per_day?: string | null
          created_at?: string | null
          experience_years?: string | null
          full_name: string
          id?: string
          is_active?: boolean | null
          languages?: string | null
          line_id?: string | null
          position?: string | null
          specialties?: string | null
          staff_code: string
          updated_at?: string | null
          working_days?: string | null
          working_hours?: string | null
        }
        Update: {
          cases_per_day?: string | null
          created_at?: string | null
          experience_years?: string | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          languages?: string | null
          line_id?: string | null
          position?: string | null
          specialties?: string | null
          staff_code?: string
          updated_at?: string | null
          working_days?: string | null
          working_hours?: string | null
        }
        Relationships: []
      }
      completed: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          title: string
          type: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
          type?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          title: string
          type: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          title: string
          type?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string | null
          id: string
          name: string
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          webhook_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
