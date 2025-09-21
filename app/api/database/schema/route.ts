import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    // Query to get all tables and their columns
    const { data, error } = await supabase.rpc("get_schema_info")

    if (error) {
      // Fallback: try direct query if RPC doesn't exist
      const { data: tablesData, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .neq("table_name", "schema_migrations")

      if (tablesError) {
        return NextResponse.json(
          { error: "Failed to fetch database schema", details: tablesError.message },
          { status: 500 },
        )
      }

      // Get columns for each table
      const schema: { [key: string]: any[] } = {}

      for (const table of tablesData || []) {
        const { data: columnsData, error: columnsError } = await supabase
          .from("information_schema.columns")
          .select("column_name, data_type, is_nullable, column_default, character_maximum_length")
          .eq("table_schema", "public")
          .eq("table_name", table.table_name)
          .order("ordinal_position")

        if (!columnsError && columnsData) {
          schema[table.table_name] = columnsData
        }
      }

      return NextResponse.json({ schema })
    }

    return NextResponse.json({ schema: data })
  } catch (error) {
    console.error("Database schema error:", error)
    return NextResponse.json(
      {
        error: "Database connection failed",
        details: "Make sure your Supabase environment variables are set correctly",
        hint: "Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
      },
      { status: 500 },
    )
  }
}
