import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET() {
  try {
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

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase.from("users").select("count").limit(1)

    if (connectionError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          error: connectionError.message,
          code: connectionError.code,
        },
        { status: 500 },
      )
    }

    // Test RPC functions
    const { data: rpcTest, error: rpcError } = await supabase.rpc("get_table_names")

    // Test information_schema access
    const { data: schemaTest, error: schemaError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .limit(5)

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      tests: {
        basicConnection: {
          success: !connectionError,
          error: connectionError?.message,
        },
        rpcFunctions: {
          success: !rpcError,
          error: rpcError?.message,
          data: rpcTest?.slice(0, 5),
        },
        schemaAccess: {
          success: !schemaError,
          error: schemaError?.message,
          data: schemaTest?.slice(0, 5),
        },
      },
      environment: {
        hasUrl: !!supabaseUrl,
        hasServiceKey: !!supabaseServiceKey,
        urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "missing",
      },
    })
  } catch (error) {
    console.error("Test DB error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Unexpected error during database test",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
