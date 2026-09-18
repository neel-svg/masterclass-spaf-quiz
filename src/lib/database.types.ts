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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_secrets: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          secret_hash: string
        }
        Insert: {
          created_at?: string
          id?: never
          is_active?: boolean
          secret_hash: string
        }
        Update: {
          created_at?: string
          id?: never
          is_active?: boolean
          secret_hash?: string
        }
        Relationships: []
      }
      analytics: {
        Row: {
          created_at: string | null
          event: string
          id: number
          payload: string | null
          quiz_id: number | null
        }
        Insert: {
          created_at?: string | null
          event: string
          id?: number
          payload?: string | null
          quiz_id?: number | null
        }
        Update: {
          created_at?: string | null
          event?: string
          id?: number
          payload?: string | null
          quiz_id?: number | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          ends_at: string | null
          questions: Json
          quiz_id: number
          starts_at: string | null
        }
        Insert: {
          ends_at?: string | null
          questions: Json
          quiz_id?: never
          starts_at?: string | null
        }
        Update: {
          ends_at?: string | null
          questions?: Json
          quiz_id?: never
          starts_at?: string | null
        }
        Relationships: []
      }
      responses: {
        Row: {
          created_at: string
          cycle_start: string
          id: number
          name: string
          phone: string
          quiz_id: number
          score: number
          specialty: string
          time_ms: number
        }
        Insert: {
          created_at?: string
          cycle_start: string
          id?: never
          name: string
          phone: string
          quiz_id: number
          score: number
          specialty: string
          time_ms: number
        }
        Update: {
          created_at?: string
          cycle_start?: string
          id?: never
          name?: string
          phone?: string
          quiz_id?: number
          score?: number
          specialty?: string
          time_ms?: number
        }
        Relationships: [
          {
            foreignKeyName: "responses_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["phone"]
          },
          {
            foreignKeyName: "responses_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      spaf_admin_secrets: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          secret_hash: string
        }
        Insert: {
          created_at?: string
          id?: never
          is_active?: boolean
          secret_hash: string
        }
        Update: {
          created_at?: string
          id?: never
          is_active?: boolean
          secret_hash?: string
        }
        Relationships: []
      }
      spaf_analytics: {
        Row: {
          created_at: string | null
          event: string
          id: number
          payload: string | null
          quiz_id: number | null
        }
        Insert: {
          created_at?: string | null
          event: string
          id?: never
          payload?: string | null
          quiz_id?: number | null
        }
        Update: {
          created_at?: string | null
          event?: string
          id?: never
          payload?: string | null
          quiz_id?: number | null
        }
        Relationships: []
      }
      spaf_quizzes: {
        Row: {
          ends_at: string | null
          questions: Json
          quiz_id: number
          starts_at: string | null
        }
        Insert: {
          ends_at?: string | null
          questions: Json
          quiz_id?: never
          starts_at?: string | null
        }
        Update: {
          ends_at?: string | null
          questions?: Json
          quiz_id?: never
          starts_at?: string | null
        }
        Relationships: []
      }
      spaf_responses: {
        Row: {
          created_at: string
          cycle_start: string
          id: number
          name: string
          phone: string
          quiz_id: number
          score: number
          specialty: string
          time_ms: number
        }
        Insert: {
          created_at?: string
          cycle_start: string
          id?: never
          name: string
          phone: string
          quiz_id: number
          score: number
          specialty: string
          time_ms: number
        }
        Update: {
          created_at?: string
          cycle_start?: string
          id?: never
          name?: string
          phone?: string
          quiz_id?: number
          score?: number
          specialty?: string
          time_ms?: number
        }
        Relationships: [
          {
            foreignKeyName: "spaf_responses_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "spaf_users"
            referencedColumns: ["phone"]
          },
          {
            foreignKeyName: "spaf_responses_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "spaf_quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      spaf_users: {
        Row: {
          created_at: string
          name: string
          phone: string
          specialty: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          name: string
          phone: string
          specialty: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          name?: string
          phone?: string
          specialty?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          name: string
          phone: string
          specialty: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          name: string
          phone: string
          specialty: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          name?: string
          phone?: string
          specialty?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard: {
        Row: {
          created_at: string | null
          cycle_start: string | null
          name: string | null
          phone: string | null
          quiz_id: number | null
          rank: number | null
          score: number | null
          specialty: string | null
          time_ms: number | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_phone_fkey"
            columns: ["phone"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["phone"]
          },
          {
            foreignKeyName: "responses_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
    }
    Functions: {
      verify_admin_secret: { Args: { secret: string }; Returns: boolean }
      verify_spaf_admin_secret: { Args: { secret: string }; Returns: boolean }
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
