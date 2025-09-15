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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      construction_teams: {
        Row: {
          created_at: string
          efficiency_rating: number | null
          id: string
          pricing_model: string | null
          specialties: string[] | null
          status: string
          team_leader: string
          team_leader_phone: string | null
          team_name: string
          team_size: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          efficiency_rating?: number | null
          id?: string
          pricing_model?: string | null
          specialties?: string[] | null
          status?: string
          team_leader: string
          team_leader_phone?: string | null
          team_name: string
          team_size?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          efficiency_rating?: number | null
          id?: string
          pricing_model?: string | null
          specialties?: string[] | null
          status?: string
          team_leader?: string
          team_leader_phone?: string | null
          team_name?: string
          team_size?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          decoration_style: string | null
          designer_in_charge: string | null
          email: string | null
          id: string
          last_contact_date: string | null
          name: string
          notes: string | null
          phone: string | null
          preliminary_budget: number | null
          property_type: string | null
          responsible_person: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          decoration_style?: string | null
          designer_in_charge?: string | null
          email?: string | null
          id?: string
          last_contact_date?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          preliminary_budget?: number | null
          property_type?: string | null
          responsible_person?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          decoration_style?: string | null
          designer_in_charge?: string | null
          email?: string | null
          id?: string
          last_contact_date?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          preliminary_budget?: number | null
          property_type?: string | null
          responsible_person?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      financial_records: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          id: string
          invoice_number: string | null
          payment_method: string | null
          project_id: string | null
          transaction_date: string
          transaction_type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          id?: string
          invoice_number?: string | null
          payment_method?: string | null
          project_id?: string | null
          transaction_date?: string
          transaction_type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          invoice_number?: string | null
          payment_method?: string | null
          project_id?: string | null
          transaction_date?: string
          transaction_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_records_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      material_transactions: {
        Row: {
          created_at: string
          delivered_by: string | null
          id: string
          material_id: string
          notes: string | null
          project_id: string | null
          quantity: number
          supplier_name: string | null
          total_amount: number | null
          transaction_date: string
          transaction_type: string
          unit_price: number | null
        }
        Insert: {
          created_at?: string
          delivered_by?: string | null
          id?: string
          material_id: string
          notes?: string | null
          project_id?: string | null
          quantity: number
          supplier_name?: string | null
          total_amount?: number | null
          transaction_date?: string
          transaction_type: string
          unit_price?: number | null
        }
        Update: {
          created_at?: string
          delivered_by?: string | null
          id?: string
          material_id?: string
          notes?: string | null
          project_id?: string | null
          quantity?: number
          supplier_name?: string | null
          total_amount?: number | null
          transaction_date?: string
          transaction_type?: string
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "material_transactions_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          category: string
          created_at: string
          current_stock: number | null
          id: string
          min_stock_alert: number | null
          name: string
          supplier_contact: string | null
          supplier_name: string | null
          unit: string
          unit_price: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          current_stock?: number | null
          id?: string
          min_stock_alert?: number | null
          name: string
          supplier_contact?: string | null
          supplier_name?: string | null
          unit: string
          unit_price?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          current_stock?: number | null
          id?: string
          min_stock_alert?: number | null
          name?: string
          supplier_contact?: string | null
          supplier_name?: string | null
          unit?: string
          unit_price?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_nodes: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          id: string
          node_type: string
          paid_amount: number | null
          project_id: string
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          id?: string
          node_type: string
          paid_amount?: number | null
          project_id: string
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          id?: string
          node_type?: string
          paid_amount?: number | null
          project_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_nodes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      project_phases: {
        Row: {
          actual_end_date: string | null
          actual_start_date: string | null
          completion_percentage: number | null
          created_at: string
          dependencies: string[] | null
          description: string | null
          end_date: string | null
          estimated_duration: number | null
          id: string
          phase_name: string
          phase_order: number | null
          progress: number | null
          project_id: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          completion_percentage?: number | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          end_date?: string | null
          estimated_duration?: number | null
          id?: string
          phase_name: string
          phase_order?: number | null
          progress?: number | null
          project_id: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          completion_percentage?: number | null
          created_at?: string
          dependencies?: string[] | null
          description?: string | null
          end_date?: string | null
          estimated_duration?: number | null
          id?: string
          phase_name?: string
          phase_order?: number | null
          progress?: number | null
          project_id?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          area: number | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          decoration_style: string | null
          end_date: string | null
          id: string
          name: string
          project_address: string | null
          property_type: string | null
          start_date: string | null
          status: string
          total_contract_amount: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          area?: number | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          decoration_style?: string | null
          end_date?: string | null
          id?: string
          name: string
          project_address?: string | null
          property_type?: string | null
          start_date?: string | null
          status?: string
          total_contract_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          area?: number | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          decoration_style?: string | null
          end_date?: string | null
          id?: string
          name?: string
          project_address?: string | null
          property_type?: string | null
          start_date?: string | null
          status?: string
          total_contract_amount?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string
          supplier_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          supplier_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          supplier_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      talents: {
        Row: {
          created_at: string
          email: string | null
          experience_years: number | null
          id: string
          last_contact_date: string | null
          name: string
          notes: string | null
          phone: string | null
          role: string
          skill_rating: number | null
          specialties: string[] | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          experience_years?: number | null
          id?: string
          last_contact_date?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          role: string
          skill_rating?: number | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          experience_years?: number | null
          id?: string
          last_contact_date?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string
          skill_rating?: number | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      team_assignments: {
        Row: {
          contract_amount: number | null
          created_at: string
          end_date: string | null
          id: string
          paid_amount: number | null
          project_id: string
          start_date: string | null
          status: string
          team_id: string
          updated_at: string
          work_scope: string | null
        }
        Insert: {
          contract_amount?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          paid_amount?: number | null
          project_id: string
          start_date?: string | null
          status?: string
          team_id: string
          updated_at?: string
          work_scope?: string | null
        }
        Update: {
          contract_amount?: number | null
          created_at?: string
          end_date?: string | null
          id?: string
          paid_amount?: number | null
          project_id?: string
          start_date?: string | null
          status?: string
          team_id?: string
          updated_at?: string
          work_scope?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_assignments_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "construction_teams"
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
      worker_assignments: {
        Row: {
          created_at: string
          end_date: string | null
          estimated_amount: number | null
          id: string
          paid_amount: number | null
          project_id: string
          remaining_amount: number | null
          start_date: string | null
          status: string
          updated_at: string
          work_description: string | null
          worker_id: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          estimated_amount?: number | null
          id?: string
          paid_amount?: number | null
          project_id: string
          remaining_amount?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
          work_description?: string | null
          worker_id: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          estimated_amount?: number | null
          id?: string
          paid_amount?: number | null
          project_id?: string
          remaining_amount?: number | null
          start_date?: string | null
          status?: string
          updated_at?: string
          work_description?: string | null
          worker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worker_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "worker_assignments_worker_id_fkey"
            columns: ["worker_id"]
            isOneToOne: false
            referencedRelation: "workers"
            referencedColumns: ["id"]
          },
        ]
      }
      workers: {
        Row: {
          created_at: string
          daily_rate: number | null
          hourly_rate: number | null
          id: string
          name: string
          phone: string | null
          skill_rating: number | null
          specialties: string[] | null
          status: string
          updated_at: string
          user_id: string | null
          worker_type: string
        }
        Insert: {
          created_at?: string
          daily_rate?: number | null
          hourly_rate?: number | null
          id?: string
          name: string
          phone?: string | null
          skill_rating?: number | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
          worker_type: string
        }
        Update: {
          created_at?: string
          daily_rate?: number | null
          hourly_rate?: number | null
          id?: string
          name?: string
          phone?: string | null
          skill_rating?: number | null
          specialties?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string | null
          worker_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_admin_role: {
        Args: { _email: string }
        Returns: undefined
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "user"
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
      app_role: ["admin", "manager", "user"],
    },
  },
} as const
