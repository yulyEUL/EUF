import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if environment variables exist
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          details: "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not found",
          hint: "Check your Vercel environment variables",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from("pg_tables")
      .select("tablename")
      .eq("schemaname", "public")
      .limit(1)

    if (testError) {
      console.error("Connection test failed:", testError)

      // Try alternative method using raw SQL
      const { data: rawData, error: rawError } = await supabase.rpc("get_tables")

      if (rawError) {
        return NextResponse.json(
          {
            error: "Database connection failed",
            details: testError.message,
            hint: "Check your Supabase service role key and database permissions",
          },
          { status: 500 },
        )
      }
    }

    // Get all tables using pg_tables (more reliable)
    const { data: tablesData, error: tablesError } = await supabase
      .from("pg_tables")
      .select("tablename")
      .eq("schemaname", "public")
      .not("tablename", "like", "pg_%")

    if (tablesError) {
      console.error("Tables query error:", tablesError)
      return NextResponse.json(
        {
          error: "Failed to fetch tables",
          details: tablesError.message,
          hint: "Make sure your database is set up and accessible",
        },
        { status: 500 },
      )
    }

    // Get columns for each table
    const schema: { [key: string]: any[] } = {}

    if (tablesData && tablesData.length > 0) {
      for (const table of tablesData) {
        const { data: columnsData, error: columnsError } = await supabase.rpc("get_table_columns", {
          table_name: table.tablename,
        })

        if (!columnsError && columnsData) {
          schema[table.tablename] = columnsData
        } else {
          // Fallback to information_schema
          const { data: fallbackColumns, error: fallbackError } = await supabase
            .from("information_schema.columns")
            .select("column_name, data_type, is_nullable, column_default, character_maximum_length")
            .eq("table_schema", "public")
            .eq("table_name", table.tablename)
            .order("ordinal_position")

          if (!fallbackError && fallbackColumns) {
            schema[table.tablename] = fallbackColumns
          }
        }
      }
    }

    return NextResponse.json({
      schema,
      tableCount: Object.keys(schema).length,
      message:
        Object.keys(schema).length === 0
          ? "No tables found. Run the database setup script."
          : "Schema loaded successfully",
    })
  } catch (error) {
    console.error("Database schema error:", error)
    return NextResponse.json(
      {
        error: "Database connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
        hint: "Check your Supabase environment variables and database setup",
      },
      { status: 500 },
    )
  }
}
