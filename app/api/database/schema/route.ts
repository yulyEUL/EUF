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

    console.log("Attempting to fetch schema...")

    // Method 1: Try RPC function
    const { data: tableInfo, error: rpcError } = await supabase.rpc("get_table_info")

    if (!rpcError && tableInfo) {
      console.log("RPC method successful, processing results...")
      console.log("Raw RPC data:", tableInfo.slice(0, 5)) // Log first 5 rows

      const schema: Record<string, any[]> = {}

      tableInfo.forEach((row: any) => {
        if (!schema[row.table_name]) {
          schema[row.table_name] = []
        }
        if (row.column_name) {
          schema[row.table_name].push({
            column_name: row.column_name,
            data_type: row.data_type,
            is_nullable: row.is_nullable,
            column_default: row.column_default,
            character_maximum_length: row.character_maximum_length,
          })
        }
      })

      const totalColumns = Object.values(schema).reduce((sum, cols) => sum + cols.length, 0)

      return NextResponse.json({
        schema,
        tableCount: Object.keys(schema).length,
        totalColumns,
        message: `Schema loaded successfully using RPC method. Found ${Object.keys(schema).length} tables with ${totalColumns} columns.`,
        method: "rpc",
        debug: {
          rawDataCount: tableInfo.length,
          sampleData: tableInfo.slice(0, 3),
        },
      })
    }

    console.log("RPC failed, trying direct SQL query...")
    console.log("RPC Error:", rpcError)

    // Method 2: Direct SQL query
    const { data: sqlData, error: sqlError } = await supabase
      .from("information_schema.columns")
      .select(`
        table_name,
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        ordinal_position
      `)
      .eq("table_schema", "public")
      .order("table_name")
      .order("ordinal_position")

    if (!sqlError && sqlData) {
      console.log("Direct SQL method successful")
      console.log("SQL data sample:", sqlData.slice(0, 5))

      const schema: Record<string, any[]> = {}

      sqlData.forEach((row: any) => {
        if (!schema[row.table_name]) {
          schema[row.table_name] = []
        }
        schema[row.table_name].push({
          column_name: row.column_name,
          data_type: row.data_type,
          is_nullable: row.is_nullable,
          column_default: row.column_default,
          character_maximum_length: row.character_maximum_length,
        })
      })

      const totalColumns = Object.values(schema).reduce((sum, cols) => sum + cols.length, 0)

      return NextResponse.json({
        schema,
        tableCount: Object.keys(schema).length,
        totalColumns,
        message: `Schema loaded using direct SQL query. Found ${Object.keys(schema).length} tables with ${totalColumns} columns.`,
        method: "direct_sql",
        debug: {
          rawDataCount: sqlData.length,
          sampleData: sqlData.slice(0, 3),
        },
      })
    }

    console.log("Direct SQL also failed, trying raw SQL...")
    console.log("SQL Error:", sqlError)

    // Method 3: Raw SQL query
    const { data: rawData, error: rawError } = await supabase.rpc("sql", {
      query: `
        SELECT 
          t.table_name,
          c.column_name,
          c.data_type,
          c.is_nullable,
          c.column_default,
          c.character_maximum_length,
          c.ordinal_position
        FROM information_schema.tables t
        LEFT JOIN information_schema.columns c ON t.table_name = c.table_name AND c.table_schema = 'public'
        WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
        ORDER BY t.table_name, c.ordinal_position;
      `,
    })

    if (!rawError && rawData) {
      console.log("Raw SQL method successful")

      const schema: Record<string, any[]> = {}

      rawData.forEach((row: any) => {
        if (!schema[row.table_name]) {
          schema[row.table_name] = []
        }
        if (row.column_name) {
          schema[row.table_name].push({
            column_name: row.column_name,
            data_type: row.data_type,
            is_nullable: row.is_nullable,
            column_default: row.column_default,
            character_maximum_length: row.character_maximum_length,
          })
        }
      })

      const totalColumns = Object.values(schema).reduce((sum, cols) => sum + cols.length, 0)

      return NextResponse.json({
        schema,
        tableCount: Object.keys(schema).length,
        totalColumns,
        message: `Schema loaded using raw SQL. Found ${Object.keys(schema).length} tables with ${totalColumns} columns.`,
        method: "raw_sql",
      })
    }

    // Method 4: Fallback - try to detect tables individually
    console.log("All methods failed, using table detection fallback...")

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

    for (const tableName of expectedTables) {
      try {
        const { error } = await supabase.from(tableName).select("*").limit(0)

        if (!error) {
          foundTables.push(tableName)
          // Try to get column info for this table
          const { data: tableColumns } = await supabase.rpc("get_table_columns", {
            table_name: tableName,
          })

          if (tableColumns && tableColumns.length > 0) {
            schema[tableName] = tableColumns
          } else {
            // Basic fallback structure
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
        }
      } catch (e) {
        continue
      }
    }

    const totalColumns = Object.values(schema).reduce((sum, cols) => sum + cols.length, 0)

    return NextResponse.json({
      schema,
      tableCount: foundTables.length,
      totalColumns,
      message:
        foundTables.length > 0
          ? `Found ${foundTables.length} tables using fallback method with ${totalColumns} columns`
          : "No tables found - please run the database setup script",
      method: "fallback",
      foundTables,
      errors: {
        rpc: rpcError?.message,
        sql: sqlError?.message,
        raw: rawError?.message,
      },
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
