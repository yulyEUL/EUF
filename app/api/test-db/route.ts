import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        status: "error",
        message: "Missing environment variables",
        details: {
          hasUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey,
        },
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Test basic connection by trying to query a simple table
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

    let tablesFound = false
    const foundTablesList = []

    // Check if any of our expected tables exist
    for (const tableName of expectedTables) {
      try {
        const { error } = await supabase.from(tableName).select("*").limit(0)
        if (!error) {
          tablesFound = true
          foundTablesList.push(tableName)
        }
      } catch (e) {
        // Table doesn't exist, continue
        continue
      }
    }

    return NextResponse.json({
      status: "success",
      message: tablesFound
        ? "Database connection successful and tables exist"
        : "Database connection successful but no tables found",
      supabaseUrl: supabaseUrl.substring(0, 30) + "...",
      tablesFound,
      foundTables: foundTablesList,
      tableCount: foundTablesList.length,
    })
  } catch (error) {
    return NextResponse.json({
      status: "connection_error",
      message: "Failed to connect to database",
      error: error instanceof Error ? error.message : "Unknown error",
      code: (error as any)?.code || "UNKNOWN",
      details: (error as any)?.details || null,
    })
  }
}
