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

    // Get expense categories for validation
    const { data: categories, error: categoriesError } = await supabase.from("expense_categories").select("id, name")

    if (categoriesError) {
      return NextResponse.json({ error: "Failed to load expense categories" }, { status: 500 })
    }

    const categoryMap = new Map(categories?.map((cat) => [cat.name.toLowerCase(), cat]) || [])

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
    const recipientIndex = headers.findIndex((h) => h.includes("recipient"))
    const categoryIndex = headers.findIndex((h) => h.includes("category"))
    const notesIndex = headers.findIndex((h) => h.includes("notes"))

    if (dateIndex === -1 || amountIndex === -1 || recipientIndex === -1 || categoryIndex === -1) {
      return NextResponse.json(
        {
          error: "CSV must contain Date, Amount, Recipient, and Category columns",
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

      // Validate recipient
      const recipient = row[recipientIndex] || ""
      if (!recipient.trim()) {
        errors.push("Missing recipient")
      }

      // Validate category
      const categoryName = row[categoryIndex] || ""
      const category = categoryMap.get(categoryName.toLowerCase())
      if (!categoryName.trim()) {
        errors.push("Missing category")
      } else if (!category) {
        errors.push(`Invalid category. Must be one of: ${Array.from(categoryMap.keys()).join(", ")}`)
      }

      if (errors.length > 0) {
        errorRecords.push({
          row: i + 2,
          data: row.join(", "),
          errors,
        })
      } else {
        validRecords.push({
          date: dateStr,
          amount: amount,
          recipient: recipient,
          category_id: category!.id,
          category_name: category!.name,
          notes: row[notesIndex] || "",
        })
      }
    }

    // Insert valid records into database
    if (validRecords.length > 0) {
      const { error: insertError } = await supabase.from("expenses").insert(validRecords)

      if (insertError) {
        console.error("Database insert error:", insertError)
        return NextResponse.json({ error: "Failed to save records to database" }, { status: 500 })
      }
    }

    // Log the import
    await supabase.from("import_logs").insert({
      import_type: "expenses",
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
