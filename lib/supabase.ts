import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for API routes
export const createServerSupabaseClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Database types
export interface Database {
  public: {
    Tables: {
      earnings: {
        Row: {
          id: string
          date: string
          amount: number
          source: string
          description: string | null
          trip_id: string | null
          imported_at: string
          created_at: string
        }
        Insert: {
          date: string
          amount: number
          source: string
          description?: string | null
          trip_id?: string | null
        }
        Update: {
          date?: string
          amount?: number
          source?: string
          description?: string | null
          trip_id?: string | null
        }
      }
      expenses: {
        Row: {
          id: string
          date: string
          amount: number
          recipient: string
          category_id: string
          category_name: string
          notes: string | null
          vehicle_id: string | null
          imported_at: string
          created_at: string
        }
        Insert: {
          date: string
          amount: number
          recipient: string
          category_id: string
          category_name: string
          notes?: string | null
          vehicle_id?: string | null
        }
        Update: {
          date?: string
          amount?: number
          recipient?: string
          category_id?: string
          category_name?: string
          notes?: string | null
          vehicle_id?: string | null
        }
      }
      expense_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          name: string
          description?: string | null
        }
        Update: {
          name?: string
          description?: string | null
        }
      }
      import_logs: {
        Row: {
          id: string
          import_type: string
          filename: string
          total_rows: number
          valid_rows: number
          error_rows: number
          status: string
          imported_by: string | null
          created_at: string
        }
        Insert: {
          import_type: string
          filename: string
          total_rows: number
          valid_rows: number
          error_rows: number
          status?: string
          imported_by?: string | null
        }
        Update: {
          import_type?: string
          filename?: string
          total_rows?: number
          valid_rows?: number
          error_rows?: number
          status?: string
          imported_by?: string | null
        }
      }
    }
  }
}
