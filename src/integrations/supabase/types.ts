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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      community_quests: {
        Row: {
          category: string
          created_at: string
          creator_id: string
          description: string
          difficulty: string
          estimated_minutes: number
          gold_reward: number
          id: string
          is_active: boolean | null
          name: string
          stat_end: number | null
          stat_int: number | null
          stat_soc: number | null
          stat_str: number | null
          stat_wil: number | null
          updated_at: string
          xp_reward: number
        }
        Insert: {
          category: string
          created_at?: string
          creator_id: string
          description: string
          difficulty: string
          estimated_minutes: number
          gold_reward: number
          id?: string
          is_active?: boolean | null
          name: string
          stat_end?: number | null
          stat_int?: number | null
          stat_soc?: number | null
          stat_str?: number | null
          stat_wil?: number | null
          updated_at?: string
          xp_reward: number
        }
        Update: {
          category?: string
          created_at?: string
          creator_id?: string
          description?: string
          difficulty?: string
          estimated_minutes?: number
          gold_reward?: number
          id?: string
          is_active?: boolean | null
          name?: string
          stat_end?: number | null
          stat_int?: number | null
          stat_soc?: number | null
          stat_str?: number | null
          stat_wil?: number | null
          updated_at?: string
          xp_reward?: number
        }
        Relationships: []
      }
      completed_quests: {
        Row: {
          completed_at: string
          gold_earned: number
          id: string
          quest_id: string
          quest_name: string
          time_taken: number
          user_id: string
          was_late: boolean
          xp_earned: number
        }
        Insert: {
          completed_at?: string
          gold_earned: number
          id?: string
          quest_id: string
          quest_name: string
          time_taken: number
          user_id: string
          was_late?: boolean
          xp_earned: number
        }
        Update: {
          completed_at?: string
          gold_earned?: number
          id?: string
          quest_id?: string
          quest_name?: string
          time_taken?: number
          user_id?: string
          was_late?: boolean
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "completed_quests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_activities: {
        Row: {
          created_at: string
          date: string
          id: string
          is_restored: boolean
          quests_completed: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_restored?: boolean
          quests_completed?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_restored?: boolean
          quests_completed?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "daily_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_login_rewards: {
        Row: {
          claimed_at: string
          cosmetic_id: string | null
          created_at: string
          day_number: number
          id: string
          reward_amount: number
          reward_type: string
          user_id: string
        }
        Insert: {
          claimed_at?: string
          cosmetic_id?: string | null
          created_at?: string
          day_number?: number
          id?: string
          reward_amount?: number
          reward_type: string
          user_id: string
        }
        Update: {
          claimed_at?: string
          cosmetic_id?: string | null
          created_at?: string
          day_number?: number
          id?: string
          reward_amount?: number
          reward_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_login_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friend_requests: {
        Row: {
          created_at: string
          from_user_id: string
          id: string
          to_user_id: string
        }
        Insert: {
          created_at?: string
          from_user_id: string
          id?: string
          to_user_id: string
        }
        Update: {
          created_at?: string
          from_user_id?: string
          id?: string
          to_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friend_requests_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friend_requests_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_title: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          current_streak: number
          current_xp: number
          gender: string | null
          gold: number
          id: string
          last_login_date: string | null
          last_quest_date: string | null
          last_spin_date: string | null
          level: number
          login_streak: number | null
          longest_streak: number
          missed_days: number
          rank_city: number
          rank_country: number
          rank_global: number
          rank_state: number
          restores_remaining: number
          restores_reset_date: string
          stat_end: number
          stat_int: number
          stat_soc: number
          stat_str: number
          stat_wil: number
          state: string | null
          total_gold_earned: number
          total_quests_completed: number
          total_xp: number
          updated_at: string
          username: string
        }
        Insert: {
          active_title?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_streak?: number
          current_xp?: number
          gender?: string | null
          gold?: number
          id: string
          last_login_date?: string | null
          last_quest_date?: string | null
          last_spin_date?: string | null
          level?: number
          login_streak?: number | null
          longest_streak?: number
          missed_days?: number
          rank_city?: number
          rank_country?: number
          rank_global?: number
          rank_state?: number
          restores_remaining?: number
          restores_reset_date?: string
          stat_end?: number
          stat_int?: number
          stat_soc?: number
          stat_str?: number
          stat_wil?: number
          state?: string | null
          total_gold_earned?: number
          total_quests_completed?: number
          total_xp?: number
          updated_at?: string
          username: string
        }
        Update: {
          active_title?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          current_streak?: number
          current_xp?: number
          gender?: string | null
          gold?: number
          id?: string
          last_login_date?: string | null
          last_quest_date?: string | null
          last_spin_date?: string | null
          level?: number
          login_streak?: number | null
          longest_streak?: number
          missed_days?: number
          rank_city?: number
          rank_country?: number
          rank_global?: number
          rank_state?: number
          restores_remaining?: number
          restores_reset_date?: string
          stat_end?: number
          stat_int?: number
          stat_soc?: number
          stat_str?: number
          stat_wil?: number
          state?: string | null
          total_gold_earned?: number
          total_quests_completed?: number
          total_xp?: number
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cosmetics: {
        Row: {
          cosmetic_id: string
          equipped: boolean
          id: string
          purchased_at: string
          user_id: string
        }
        Insert: {
          cosmetic_id: string
          equipped?: boolean
          id?: string
          purchased_at?: string
          user_id: string
        }
        Update: {
          cosmetic_id?: string
          equipped?: boolean
          id?: string
          purchased_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cosmetics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_friend_request: { Args: { request_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "developer" | "user"
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
      app_role: ["developer", "user"],
    },
  },
} as const
