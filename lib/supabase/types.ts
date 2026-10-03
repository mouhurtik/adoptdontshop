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
    PostgrestVersion: "12.2.3 (519615d)"
  }
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
      community_posts: {
        Row: {
          author_id: string
          comment_count: number
          content: Json
          content_text: string
          created_at: string
          featured_image_url: string | null
          id: string
          is_pinned: boolean
          like_count: number
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id: string
          comment_count?: number
          content?: Json
          content_text?: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_pinned?: boolean
          like_count?: number
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string
          comment_count?: number
          content?: Json
          content_text?: string
          created_at?: string
          featured_image_url?: string | null
          id?: string
          is_pinned?: boolean
          like_count?: number
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string | null
          group_avatar_url: string | null
          group_id: string | null
          group_name: string | null
          id: string
          is_group_chat: boolean
          last_message: string | null
          last_message_at: string | null
          participant_ids: string[]
          pet_listing_id: string | null
          room_name: string | null
        }
        Insert: {
          created_at?: string | null
          group_avatar_url?: string | null
          group_id?: string | null
          group_name?: string | null
          id?: string
          is_group_chat?: boolean
          last_message?: string | null
          last_message_at?: string | null
          participant_ids: string[]
          pet_listing_id?: string | null
          room_name?: string | null
        }
        Update: {
          created_at?: string | null
          group_avatar_url?: string | null
          group_id?: string | null
          group_name?: string | null
          id?: string
          is_group_chat?: boolean
          last_message?: string | null
          last_message_at?: string | null
          participant_ids?: string[]
          pet_listing_id?: string | null
          room_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_pet_listing_id_fkey"
            columns: ["pet_listing_id"]
            isOneToOne: false
            referencedRelation: "pet_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      groups: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category: string
          avatar_url: string | null
          cover_image_url: string | null
          created_by: string
          is_private: boolean
          member_count: number
          post_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category?: string
          avatar_url?: string | null
          cover_image_url?: string | null
          created_by: string
          is_private?: boolean
          member_count?: number
          post_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: string
          avatar_url?: string | null
          cover_image_url?: string | null
          created_by?: string
          is_private?: boolean
          member_count?: number
          post_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_deleted: boolean
          message_type: string
          participants: Json
          read_by: Json
          sender_id: string
          sender_name: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          message_type?: string
          participants?: Json
          read_by?: Json
          sender_id: string
          sender_name: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          message_type?: string
          participants?: Json
          read_by?: Json
          sender_id?: string
          sender_name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          message: string
          link: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          message: string
          link?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          message?: string
          link?: string | null
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      pet_favorites: {
        Row: {
          created_at: string
          id: string
          pet_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pet_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_favorites_pet_id_fkey"
            columns: ["pet_id"]
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
          slug: string | null
          status: string
          updated_at: string
          user_id: string | null
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
          slug?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
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
          slug?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_deleted: boolean
          parent_comment_id: string | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: string | null
          avatar_url: string | null
          badge: string | null
          bio: string | null
          created_at: string | null
          device_platform: string | null
          display_name: string | null
          fcm_token: string | null
          id: string
          location: string | null
          organization_name: string | null
          phone: string | null
          privacy_settings: Json | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          account_type?: string | null
          avatar_url?: string | null
          badge?: string | null
          bio?: string | null
          created_at?: string | null
          device_platform?: string | null
          display_name?: string | null
          fcm_token?: string | null
          id: string
          location?: string | null
          organization_name?: string | null
          phone?: string | null
          privacy_settings?: Json | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          account_type?: string | null
          avatar_url?: string | null
          badge?: string | null
          bio?: string | null
          created_at?: string | null
          device_platform?: string | null
          display_name?: string | null
          fcm_token?: string | null
          id?: string
          location?: string | null
          organization_name?: string | null
          phone?: string | null
          privacy_settings?: Json | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      saved_posts: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      fundraiser_supporters: {
        Row: {
          amount: number | null
          created_at: string | null
          donor_name: string | null
          fundraiser_id: string
          id: string
          is_anonymous: boolean | null
          message: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          donor_name?: string | null
          fundraiser_id: string
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          donor_name?: string | null
          fundraiser_id?: string
          id?: string
          is_anonymous?: boolean | null
          message?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fundraiser_supporters_fundraiser_id_fkey"
            columns: ["fundraiser_id"]
            isOneToOne: false
            referencedRelation: "fundraisers"
            referencedColumns: ["id"]
          },
        ]
      }
      fundraisers: {
        Row: {
          category: string
          city: string | null
          created_at: string | null
          creator_id: string | null
          currency: string | null
          deadline: string | null
          description: string | null
          description_text: string | null
          id: string
          image_url: string | null
          is_urgent: boolean | null
          payment_details: string | null
          payment_qr_url: string | null
          payment_upi: string | null
          raised_amount: number | null
          slug: string
          status: string | null
          supporter_count: number | null
          target_amount: number
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          city?: string | null
          created_at?: string | null
          creator_id?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string | null
          description_text?: string | null
          id?: string
          image_url?: string | null
          is_urgent?: boolean | null
          payment_details?: string | null
          payment_qr_url?: string | null
          payment_upi?: string | null
          raised_amount?: number | null
          slug: string
          status?: string | null
          supporter_count?: number | null
          target_amount: number
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          city?: string | null
          created_at?: string | null
          creator_id?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string | null
          description_text?: string | null
          id?: string
          image_url?: string | null
          is_urgent?: boolean | null
          payment_details?: string | null
          payment_qr_url?: string | null
          payment_upi?: string | null
          raised_amount?: number | null
          slug?: string
          status?: string | null
          supporter_count?: number | null
          target_amount?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pawcoin_transactions: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          reason: string
          reference_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          reason: string
          reference_id?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          reason?: string
          reference_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      sighting_confirmations: {
        Row: {
          created_at: string | null
          id: string
          sighting_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          sighting_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          sighting_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sighting_confirmations_sighting_id_fkey"
            columns: ["sighting_id"]
            isOneToOne: false
            referencedRelation: "street_animal_sightings"
            referencedColumns: ["id"]
          },
        ]
      }
      store_products: {
        Row: {
          affiliate_source: string | null
          affiliate_url: string
          badge: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          original_price: string | null
          pawcoins_reward: number | null
          pet_type: string
          price_display: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          affiliate_source?: string | null
          affiliate_url: string
          badge?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          original_price?: string | null
          pawcoins_reward?: number | null
          pet_type: string
          price_display?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          affiliate_source?: string | null
          affiliate_url?: string
          badge?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          original_price?: string | null
          pawcoins_reward?: number | null
          pet_type?: string
          price_display?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      street_animal_sightings: {
        Row: {
          animal_type: string
          city: string | null
          confirmation_count: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_sterilized: boolean | null
          is_vaccinated: boolean | null
          last_confirmed_at: string | null
          latitude: number
          location_name: string | null
          longitude: number
          name: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          vaccination_notes: string | null
        }
        Insert: {
          animal_type: string
          city?: string | null
          confirmation_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_sterilized?: boolean | null
          is_vaccinated?: boolean | null
          last_confirmed_at?: string | null
          latitude: number
          location_name?: string | null
          longitude: number
          name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vaccination_notes?: string | null
        }
        Update: {
          animal_type?: string
          city?: string | null
          confirmation_count?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_sterilized?: boolean | null
          is_vaccinated?: boolean | null
          last_confirmed_at?: string | null
          latitude?: number
          location_name?: string | null
          longitude?: number
          name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          vaccination_notes?: string | null
        }
        Relationships: []
      }
      user_pawcoins: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          total_earned: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          total_earned?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          total_earned?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_pawcoins: {
        Args: {
          p_amount: number
          p_reason: string
          p_reference_id?: string
          p_user_id: string
        }
        Returns: undefined
      }
      increment_view_count: { Args: { post_id: string }; Returns: undefined }
      is_admin: { Args: { check_user_id: string }; Returns: boolean }
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
