import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

interface EmailData {
  from: string
  to: string
  subject: string
  text: string
  html: string
  receivedAt: string
  headers: Record<string, string>
}

interface ParsedData {
  [key: string]: any
}

// Email parsing patterns for different types of emails
const EMAIL_PATTERNS = {
  turo_booking: {
    fromPattern: /.*@turo\.com/i,
    subjectPattern: /trip confirmed|booking confirmed/i,
    patterns: {
      tripId: /trip\s*(?:id|#):\s*([A-Z0-9-]+)/i,
      guest: /guest:\s*([^\n\r]+)/i,
      vehicle: /vehicle:\s*([^\n\r]+)/i,
      startDate: /start:\s*([^\n\r]+)/i,
      endDate: /end:\s*([^\n\r]+)/i,
      total: /total:\s*\$?([0-9,]+\.?[0-9]*)/i,
      location: /(?:pickup|location):\s*([^\n\r]+)/i,
    },
    targetTable: "trips",
  },

  payment_notification: {
    fromPattern: /.*@(?:stripe|paypal|square)\.com/i,
    subjectPattern: /payment received|payment confirmation/i,
    patterns: {
      amount: /(?:amount|total):\s*\$?([0-9,]+\.?[0-9]*)/i,
      customer: /(?:customer|from):\s*([^\n\r]+)/i,
      paymentId: /(?:payment|transaction)\s*(?:id|#):\s*([A-Z0-9_-]+)/i,
      date: /(?:date|on):\s*([^\n\r]+)/i,
    },
    targetTable: "earnings",
  },

  maintenance_service: {
    fromPattern: /.*@(?:jiffy|valvoline|maintenance|service).*\.com/i,
    subjectPattern: /service completed|maintenance done|oil change/i,
    patterns: {
      vehicle: /vehicle:\s*([^\n\r]+)/i,
      serviceType: /(?:service|type):\s*([^\n\r]+)/i,
      cost: /(?:cost|total|amount):\s*\$?([0-9,]+\.?[0-9]*)/i,
      mileage: /(?:mileage|miles):\s*([0-9,]+)/i,
      nextService: /next service:\s*([^\n\r]+)/i,
      date: /(?:date|on):\s*([^\n\r]+)/i,
    },
    targetTable: "maintenance_records",
  },

  expense_receipt: {
    fromPattern: /.*@(?:amazon|walmart|costco|receipt).*\.com/i,
    subjectPattern: /receipt|purchase confirmation|order confirmation/i,
    patterns: {
      amount: /(?:total|amount):\s*\$?([0-9,]+\.?[0-9]*)/i,
      vendor: /from:\s*([^\n\r]+)/i,
      date: /(?:date|on):\s*([^\n\r]+)/i,
      items: /items?:\s*([^\n\r]+)/i,
      orderId: /(?:order|receipt)\s*(?:id|#):\s*([A-Z0-9_-]+)/i,
    },
    targetTable: "expenses",
  },
}

function parseEmailContent(emailData: EmailData): { pattern: any; data: ParsedData } | null {
  const content = emailData.text || emailData.html || ""

  // Try to match against each pattern
  for (const [patternName, pattern] of Object.entries(EMAIL_PATTERNS)) {
    // Check if from and subject match
    if (pattern.fromPattern.test(emailData.from) && pattern.subjectPattern.test(emailData.subject)) {
      const extractedData: ParsedData = {}
      let matchCount = 0

      // Extract data using regex patterns
      for (const [field, regex] of Object.entries(pattern.patterns)) {
        const match = content.match(regex)
        if (match && match[1]) {
          extractedData[field] = match[1].trim()
          matchCount++
        }
      }

      // If we extracted at least 2 fields, consider it a match
      if (matchCount >= 2) {
        return { pattern, data: extractedData }
      }
    }
  }

  return null
}

async function saveToDatabase(targetTable: string, data: ParsedData, emailData: EmailData) {
  const supabase = createServerSupabaseClient()

  try {
    switch (targetTable) {
      case "trips":
        const tripData = {
          reservation_id: data.tripId || `EMAIL-${Date.now()}`,
          guest_name: data.guest || "Unknown Guest",
          vehicle_id: null, // Would need to lookup by vehicle name
          start_date: data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString(),
          end_date: data.endDate ? new Date(data.endDate).toISOString() : new Date().toISOString(),
          total_amount: Number.parseFloat(data.total?.replace(/[,$]/g, "") || "0"),
          pickup_location: data.location || "",
          status: "confirmed",
          guest_email: emailData.from,
          notes: `Imported from email: ${emailData.subject}`,
        }

        const { error: tripError } = await supabase.from("trips").insert(tripData)

        if (tripError) throw tripError
        break

      case "earnings":
        const earningData = {
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          amount: Number.parseFloat(data.amount?.replace(/[,$]/g, "") || "0"),
          source: data.customer || "Email Payment",
          description: `Payment ID: ${data.paymentId || "N/A"}`,
          payment_method: "card",
        }

        const { error: earningError } = await supabase.from("earnings").insert(earningData)

        if (earningError) throw earningError
        break

      case "maintenance_records":
        const maintenanceData = {
          vehicle_id: null, // Would need to lookup by vehicle name
          type: "routine",
          description: data.serviceType || "Service completed",
          service_date: data.date
            ? new Date(data.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          cost: Number.parseFloat(data.cost?.replace(/[,$]/g, "") || "0"),
          mileage: Number.parseInt(data.mileage?.replace(/[,]/g, "") || "0"),
          vendor: emailData.from.split("@")[1] || "Unknown Vendor",
          notes: `Imported from email: ${emailData.subject}`,
        }

        const { error: maintenanceError } = await supabase.from("maintenance_records").insert(maintenanceData)

        if (maintenanceError) throw maintenanceError
        break

      case "expenses":
        // First, get or create expense category
        const { data: categories } = await supabase.from("expense_categories").select("id").eq("name", "Other").single()

        const expenseData = {
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
          amount: Number.parseFloat(data.amount?.replace(/[,$]/g, "") || "0"),
          recipient: data.vendor || emailData.from.split("@")[1] || "Unknown Vendor",
          category_id: categories?.id || null,
          category_name: "Other",
          notes: `Order ID: ${data.orderId || "N/A"} - Items: ${data.items || "N/A"}`,
          payment_method: "card",
        }

        const { error: expenseError } = await supabase.from("expenses").insert(expenseData)

        if (expenseError) throw expenseError
        break
    }

    return { success: true }
  } catch (error) {
    console.error("Database save error:", error)
    return { success: false, error: error.message }
  }
}

async function logEmailProcessing(emailData: EmailData, status: string, extractedData?: ParsedData, error?: string) {
  const supabase = createServerSupabaseClient()

  try {
    await supabase.from("import_logs").insert({
      filename: `email-${Date.now()}`,
      import_type: "email",
      total_records: 1,
      successful_records: status === "success" ? 1 : 0,
      failed_records: status === "success" ? 0 : 1,
      errors: error ? [{ message: error, data: extractedData }] : [],
    })
  } catch (logError) {
    console.error("Failed to log email processing:", logError)
  }
}

export async function POST(request: NextRequest) {
  try {
    const emailData: EmailData = await request.json()

    // Validate required fields
    if (!emailData.from || !emailData.subject) {
      return NextResponse.json({ error: "Missing required email fields" }, { status: 400 })
    }

    // Parse email content
    const parseResult = parseEmailContent(emailData)

    if (!parseResult) {
      await logEmailProcessing(emailData, "failed", undefined, "No matching parsing patterns found")
      return NextResponse.json(
        {
          success: false,
          message: "No matching parsing patterns found",
          from: emailData.from,
          subject: emailData.subject,
        },
        { status: 200 }, // Return 200 to prevent email service retries
      )
    }

    // Save to database
    const saveResult = await saveToDatabase(parseResult.pattern.targetTable, parseResult.data, emailData)

    if (saveResult.success) {
      await logEmailProcessing(emailData, "success", parseResult.data)
      return NextResponse.json({
        success: true,
        message: "Email processed successfully",
        targetTable: parseResult.pattern.targetTable,
        extractedData: parseResult.data,
      })
    } else {
      await logEmailProcessing(emailData, "failed", parseResult.data, saveResult.error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to save to database",
          error: saveResult.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Email webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Email webhook endpoint is active",
    timestamp: new Date().toISOString(),
  })
}
