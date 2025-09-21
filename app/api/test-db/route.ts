import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({
        status: "error",
        message: "Missing environment variables",
        details: {
          hasUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey,
          urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : "missing",
          keyPreview: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 20)}...` : "missing",
        },
      })
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Test connection by trying to query a table that should exist
    const { data: usersTest, error: usersError } = await supabase.from("users").select("id").limit(1)

    if (usersError) {
      // If users table doesn't exist, try another approach
      const { data: anyData, error: anyError } = await supabase.from("earnings").select("id").limit(1)

      if (anyError) {
        return NextResponse.json({
          status: "no_tables",
          message: "Database connected but no tables found",
          suggestion: "Run the database setup script in Supabase SQL Editor",
          error: anyError.message,
          code: anyError.code,
        })
      }

      return NextResponse.json({
        status: "partial_success",
        message: "Some tables exist but users table is missing",
        suggestion: "Your database setup may be incomplete",
      })
    }

    return NextResponse.json({
      status: "success",
      message: "Database connection successful and tables exist",
      supabaseUrl: `${supabaseUrl.substring(0, 30)}...`,
      tablesFound: true,
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Unexpected error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
