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
      adoption_applications: {
        Row: {
          adoption_reason: string | null
          age: string | null
          agreed_responsibility: boolean
          agreed_terms: boolean
          created_at: string
          family_approval: string | null
          financial_status: string | null
          full_name: string
          gender: string | null
          id: string
          mobile_number: string | null
          occupation: string | null
          pet_experience: string | null
          pet_listing_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          adoption_reason?: string | null
          age?: string | null
          agreed_responsibility?: boolean
          agreed_terms?: boolean
          created_at?: string
          family_approval?: string | null
          financial_status?: string | null
          full_name: string
          gender?: string | null
          id: string
          mobile_number?: string | null
          occupation?: string | null
          pet_experience?: string | null
          pet_listing_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          adoption_reason?: string | null
          age?: string | null
          agreed_responsibility?: boolean
          agreed_terms?: boolean
          created_at?: string
          family_approval?: string | null
          financial_status?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          mobile_number?: string | null
          occupation?: string | null
          pet_experience?: string | null
          pet_listing_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adoption_applications_pet_listing_id_fkey"
            columns: ["pet_listing_id"]
            isOneToOne: false
            referencedRelation: "pet_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_listings: {
        Row: {
          age: string | null
          animal_type: string | null
          breed: string
          caregiver_name: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          medical_info: string
          mobile: string
          pet_name: string
          status: string
          updated_at: string
        }
        Insert: {
          age?: string | null
          animal_type?: string | null
          breed: string
          caregiver_name: string
          created_at?: string
          description?: string | null
          id: string
          image_url?: string | null
          location: string
          medical_info: string
          mobile: string
          pet_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          age?: string | null
          animal_type?: string | null
          breed?: string
          caregiver_name?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          medical_info?: string
          mobile?: string
          pet_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
