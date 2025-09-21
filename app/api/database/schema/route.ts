import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          details: {
            hasUrl: !!supabaseUrl,
            hasServiceKey: !!supabaseServiceKey,
          },
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from("information_schema.tables")
      .select("count")
      .limit(1)

    if (testError) {
      console.error("Connection test failed:", testError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: testError.message,
          code: testError.code,
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
          code: tablesError.code,
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
