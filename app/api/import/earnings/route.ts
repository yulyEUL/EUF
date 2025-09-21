import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Read and parse CSV
    const content = await file.text()
    const lines = content.split("\n").filter((line) => line.trim() !== "")

    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV must have at least a header and one data row" }, { status: 400 })
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""))
    const dataRows = lines.slice(1)

    // Find column indices
    const dateIndex = headers.findIndex((h) => h.includes("date"))
    const amountIndex = headers.findIndex((h) => h.includes("amount"))
    const sourceIndex = headers.findIndex((h) => h.includes("source"))
    const descriptionIndex = headers.findIndex((h) => h.includes("description"))

    if (dateIndex === -1 || amountIndex === -1 || sourceIndex === -1 || descriptionIndex === -1) {
      return NextResponse.json(
        {
          error: "CSV must contain Date, Amount, Source, and Description columns",
        },
        { status: 400 },
      )
    }

    const validRecords = []
    const errorRecords = []

    // Process each row
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i].split(",").map((cell) => cell.trim().replace(/"/g, ""))
      const errors = []

      // Validate date
      const dateStr = row[dateIndex] || ""
      const date = new Date(dateStr)
      if (!dateStr || isNaN(date.getTime())) {
        errors.push("Invalid or missing date")
      }

      // Validate amount
      const amountStr = row[amountIndex] || ""
      const amount = Number.parseFloat(amountStr)
      if (!amountStr || isNaN(amount) || amount < 0) {
        errors.push("Invalid or missing amount")
      }

      // Validate source
      const source = row[sourceIndex] || ""
      if (!source.trim()) {
        errors.push("Missing source")
      }

      // Validate description
      const description = row[descriptionIndex] || ""
      if (!description.trim()) {
        errors.push("Missing description")
      }

      if (errors.length > 0) {
        errorRecords.push({
          row: i + 2, // +2 because we start from 0 and skip header
          data: row.join(", "),
          errors,
        })
      } else {
        validRecords.push({
          date: dateStr,
          amount: amount,
          source: source,
          description: description,
        })
      }
    }

    // Insert valid records into database
    if (validRecords.length > 0) {
      const { error: insertError } = await supabase.from("earnings").insert(validRecords)

      if (insertError) {
        console.error("Database insert error:", insertError)
        return NextResponse.json({ error: "Failed to save records to database" }, { status: 500 })
      }
    }

    // Log the import
    await supabase.from("import_logs").insert({
      import_type: "earnings",
      filename: file.name,
      total_rows: dataRows.length,
      valid_rows: validRecords.length,
      error_rows: errorRecords.length,
      status: "completed",
    })

    return NextResponse.json({
      success: true,
      totalRows: dataRows.length,
      validRows: validRecords.length,
      errorRows: errorRecords.length,
      errorRecords,
    })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
