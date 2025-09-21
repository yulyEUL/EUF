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

    // Try to use the RPC function first
    const { data: tableNames, error: rpcError } = await supabase.rpc("get_table_names")

    if (rpcError) {
      console.log("RPC function not available, using fallback method...")

      // Fallback: Try to detect tables by querying known table names
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
      const foundTables: string[] = []

      // Check each expected table
      for (const tableName of expectedTables) {
        try {
          const { error } = await supabase.from(tableName).select("*").limit(0)

          if (!error) {
            foundTables.push(tableName)
            // Add basic column structure for found tables
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
          // Table doesn't exist, continue
          continue
        }
      }

      return NextResponse.json({
        schema,
        tableCount: foundTables.length,
        message:
          foundTables.length > 0
            ? `Found ${foundTables.length} tables using fallback method`
            : "No tables found - please run the database setup script",
        method: "fallback",
        foundTables,
      })
    }

    // RPC worked, get detailed schema
    const schema: Record<string, any[]> = {}

    if (tableNames && Array.isArray(tableNames)) {
      for (const tableName of tableNames) {
        const { data: columns, error: columnsError } = await supabase.rpc("get_table_columns", {
          table_name: tableName,
        })

        if (!columnsError && columns) {
          schema[tableName] = columns
        } else {
          // Fallback column structure if RPC fails
          schema[tableName] = [
            {
              column_name: "id",
              data_type: "uuid",
              is_nullable: "NO",
              column_default: "gen_random_uuid()",
              character_maximum_length: null,
            },
          ]
        }
      }
    }

    return NextResponse.json({
      schema,
      tableCount: Object.keys(schema).length,
      message:
        Object.keys(schema).length === 0
          ? "No tables found"
          : `Schema loaded successfully with ${Object.keys(schema).length} tables`,
      method: "rpc",
      tableNames,
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
