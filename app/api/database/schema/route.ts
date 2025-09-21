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
          urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "missing",
          keyPreview: supabaseServiceKey ? `${supabaseServiceKey.substring(0, 20)}...` : "missing",
        },
      })
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Test basic connection
    const { data, error } = await supabase.from("information_schema.tables").select("table_name").limit(1)

    if (error) {
      return NextResponse.json({
        status: "connection_error",
        message: "Failed to connect to database",
        error: error.message,
        code: error.code,
        details: error.details,
      })
    }

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      supabaseUrl: `${supabaseUrl.substring(0, 30)}...`,
      hasData: !!data,
      dataCount: data?.length || 0,
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Unexpected error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
