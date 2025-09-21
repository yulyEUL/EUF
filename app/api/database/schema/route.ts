import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Log environment variables for debugging (without exposing sensitive data)
    console.log("Environment check:", {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      keyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    })

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          details: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          },
        },
        { status: 500 },
      )
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Test basic connection first
    const { data: connectionTest, error: connectionError } = await supabase
      .from("information_schema.tables")
      .select("count")
      .limit(1)

    if (connectionError) {
      console.error("Connection test failed:", connectionError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: connectionError.message,
          hint: "Check your Supabase service role key and project status",
        },
        { status: 500 },
      )
    }

    // Get all user tables
    const { data: tables, error: tablesError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_type", "BASE TABLE")

    if (tablesError) {
      console.error("Tables query failed:", tablesError)
      return NextResponse.json(
        {
          error: "Failed to fetch tables",
          details: tablesError.message,
        },
        { status: 500 },
      )
    }

    const schema: Record<string, any[]> = {}

    // Get columns for each table
    if (tables && tables.length > 0) {
      for (const table of tables) {
        const { data: columns, error: columnsError } = await supabase
          .from("information_schema.columns")
          .select("column_name, data_type, is_nullable, column_default, character_maximum_length")
          .eq("table_schema", "public")
          .eq("table_name", table.table_name)
          .order("ordinal_position")

        if (!columnsError && columns) {
          schema[table.table_name] = columns
        } else {
          console.error(`Failed to get columns for ${table.table_name}:`, columnsError)
        }
      }
    }

    return NextResponse.json({
      schema,
      tableCount: Object.keys(schema).length,
      message: Object.keys(schema).length === 0 ? "No tables found" : "Schema loaded successfully",
    })
  } catch (error) {
    console.error("Database schema error:", error)
    return NextResponse.json(
      {
        error: "Unexpected error",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 },
    )
  }
}
