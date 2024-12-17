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
      measurements: {
        Row: {
          client_document_number: string | null
          client_document_type: string | null
          client_id: string
          client_phone: string | null
          created_at: string
          description: string | null
          dns_servers: string | null
          driver_version: string | null
          gateway: string | null
          id: string
          ipv4_address: string | null
          ipv6_address: string | null
          latency: number
          link_speed: string | null
          location: Json
          location_name: string
          mac_address: string | null
          manufacturer: string | null
          network_band: string | null
          order_number: string | null
          protocol: string | null
          security_type: string | null
          service_type: string | null
          signal_strength: number
          speed: number
          ssid: string | null
          subscriber_number: string | null
          timestamp: number
        }
        Insert: {
          client_document_number?: string | null
          client_document_type?: string | null
          client_id: string
          client_phone?: string | null
          created_at?: string
          description?: string | null
          dns_servers?: string | null
          driver_version?: string | null
          gateway?: string | null
          id?: string
          ipv4_address?: string | null
          ipv6_address?: string | null
          latency: number
          link_speed?: string | null
          location: Json
          location_name: string
          mac_address?: string | null
          manufacturer?: string | null
          network_band?: string | null
          order_number?: string | null
          protocol?: string | null
          security_type?: string | null
          service_type?: string | null
          signal_strength: number
          speed: number
          ssid?: string | null
          subscriber_number?: string | null
          timestamp: number
        }
        Update: {
          client_document_number?: string | null
          client_document_type?: string | null
          client_id?: string
          client_phone?: string | null
          created_at?: string
          description?: string | null
          dns_servers?: string | null
          driver_version?: string | null
          gateway?: string | null
          id?: string
          ipv4_address?: string | null
          ipv6_address?: string | null
          latency?: number
          link_speed?: string | null
          location?: Json
          location_name?: string
          mac_address?: string | null
          manufacturer?: string | null
          network_band?: string | null
          order_number?: string | null
          protocol?: string | null
          security_type?: string | null
          service_type?: string | null
          signal_strength?: number
          speed?: number
          ssid?: string | null
          subscriber_number?: string | null
          timestamp?: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
