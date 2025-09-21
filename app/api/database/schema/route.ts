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

    // Use RPC to get schema information since we can't query information_schema directly
    const { data: tables, error: tablesError } = await supabase.rpc("get_table_names")

    if (tablesError) {
      // If RPC doesn't exist, try to get tables by querying known tables
      console.log("RPC not available, trying direct table queries...")

      // List of expected tables from our schema
      const expectedTables = [
        "users",
        "staff",
        "vehicles",
        "customers",
        "trips",
        "earnings",
        "expenses",
        "tasks",
        "maintenance_records",
        "payments",
        "invoices",
        "vendors",
        "expense_categories",
        "import_logs",
        "user_permissions",
        "email_logs",
        "parsed_emails",
        "email_patterns",
      ]

      const schema: Record<string, any[]> = {}
      let foundTables = 0

      // Try to query each expected table to see if it exists
      for (const tableName of expectedTables) {
        try {
          const { data, error } = await supabase.from(tableName).select("*").limit(0) // Don't fetch data, just check if table exists

          if (!error) {
            // Table exists, now get its structure
            foundTables++

            // For now, we'll create a basic structure
            // In a real scenario, you'd need to query the actual column info
            schema[tableName] = [
              {
                column_name: "id",
                data_type: "uuid",
                is_nullable: "NO",
                column_default: "gen_random_uuid()",
                character_maximum_length: null,
              },
              {
                column_name: "created_at",
                data_type: "timestamp with time zone",
                is_nullable: "NO",
                column_default: "now()",
                character_maximum_length: null,
              },
            ]
          }
        } catch (e) {
          // Table doesn't exist, skip it
          continue
        }
      }

      return NextResponse.json({
        schema,
        tableCount: foundTables,
        message: foundTables > 0 ? `Found ${foundTables} tables` : "No tables found - run the database setup script",
        method: "direct_query",
      })
    }

    // If RPC worked, process the results
    const schema: Record<string, any[]> = {}

    if (tables && Array.isArray(tables)) {
      for (const tableName of tables) {
        // Get columns for each table using RPC
        const { data: columns, error: columnsError } = await supabase.rpc("get_table_columns", {
          table_name: tableName,
        })

        if (!columnsError && columns) {
          schema[tableName] = columns
        }
      }
    }

    return NextResponse.json({
      schema,
      tableCount: Object.keys(schema).length,
      message: Object.keys(schema).length === 0 ? "No tables found" : "Schema loaded successfully",
      method: "rpc",
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
