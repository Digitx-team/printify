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
      coupons: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string | null
          id: string
          min_order: number | null
          status: Database["public"]["Enums"]["coupon_status"] | null
          type: Database["public"]["Enums"]["coupon_type"] | null
          usage_count: number | null
          usage_limit: number | null
          value: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          min_order?: number | null
          status?: Database["public"]["Enums"]["coupon_status"] | null
          type?: Database["public"]["Enums"]["coupon_type"] | null
          usage_count?: number | null
          usage_limit?: number | null
          value?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          min_order?: number | null
          status?: Database["public"]["Enums"]["coupon_status"] | null
          type?: Database["public"]["Enums"]["coupon_type"] | null
          usage_count?: number | null
          usage_limit?: number | null
          value?: number | null
        }
        Relationships: []
      }
      custom_orders: {
        Row: {
          address: string | null
          brand_slug: string
          created_at: string | null
          customer_name: string
          customer_phone: string
          description: string | null
          id: string
          image_urls: string[] | null
          order_number: string | null
          phone_model: string
          status: string
          updated_at: string | null
          wilaya: string
        }
        Insert: {
          address?: string | null
          brand_slug: string
          created_at?: string | null
          customer_name: string
          customer_phone: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          order_number?: string | null
          phone_model: string
          status?: string
          updated_at?: string | null
          wilaya: string
        }
        Update: {
          address?: string | null
          brand_slug?: string
          created_at?: string | null
          customer_name?: string
          customer_phone?: string
          description?: string | null
          id?: string
          image_urls?: string[] | null
          order_number?: string | null
          phone_model?: string
          status?: string
          updated_at?: string | null
          wilaya?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          custom_description: string | null
          id: string
          is_custom: boolean | null
          order_id: string
          phone_model: string | null
          phone_model_id: string | null
          product_id: string | null
          quantity: number | null
          unit_price: number | null
        }
        Insert: {
          created_at?: string | null
          custom_description?: string | null
          id?: string
          is_custom?: boolean | null
          order_id: string
          phone_model?: string | null
          phone_model_id?: string | null
          product_id?: string | null
          quantity?: number | null
          unit_price?: number | null
        }
        Update: {
          created_at?: string | null
          custom_description?: string | null
          id?: string
          is_custom?: boolean | null
          order_id?: string
          phone_model?: string | null
          phone_model_id?: string | null
          product_id?: string | null
          quantity?: number | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string
          created_at: string | null
          customer_name: string
          customer_phone: string
          id: string
          notes: string | null
          order_number: string
          shipping_cost: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number | null
          updated_at: string | null
          wilaya: string
        }
        Insert: {
          address?: string
          created_at?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          notes?: string | null
          order_number: string
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number | null
          updated_at?: string | null
          wilaya: string
        }
        Update: {
          address?: string
          created_at?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          notes?: string | null
          order_number?: string
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number | null
          updated_at?: string | null
          wilaya?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: Database["public"]["Enums"]["product_category"]
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          popular: boolean | null
          price: number
          sku: string | null
          status: Database["public"]["Enums"]["product_status"] | null
          stock: number | null
          updated_at: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          popular?: boolean | null
          price?: number
          sku?: string | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          popular?: boolean | null
          price?: number
          sku?: string | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shipping_rates: {
        Row: {
          created_at: string | null
          id: string
          price_desk: number | null
          price_home: number | null
          updated_at: string | null
          wilaya_code: string
          wilaya_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          price_desk?: number | null
          price_home?: number | null
          updated_at?: string | null
          wilaya_code: string
          wilaya_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          price_desk?: number | null
          price_home?: number | null
          updated_at?: string | null
          wilaya_code?: string
          wilaya_name?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
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
      coupon_status: "active" | "expired" | "disabled"
      coupon_type: "percentage" | "fixed"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      product_category:
        | "personalized"
        | "artistic"
        | "calligraphy"
        | "nature"
        | "geometric"
      product_status: "active" | "draft"
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
