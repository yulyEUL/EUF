"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CSVAnalysis {
  filename: string
  totalRows: number
  headers: string[]
  sampleData: string[][]
  dataTypes: { [key: string]: string }
  suggestedTable: string
  suggestedMapping: { [csvColumn: string]: string }
}

export function CSVAnalyzer() {
  const [analysis, setAnalysis] = useState<CSVAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const analyzeCSV = async (file: File) => {
    setLoading(true)
    try {
      const content = await file.text()
      const lines = content.split("\n").filter((line) => line.trim() !== "")

      if (lines.length < 2) {
        toast({
          title: "Invalid CSV",
          description: "CSV must have at least a header row and one data row",
          variant: "destructive",
        })
        return
      }

      // Parse headers - handle quoted CSV properly
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = []
        let current = ""
        let inQuotes = false

        for (let i = 0; i < line.length; i++) {
          const char = line[i]

          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            result.push(current.trim())
            current = ""
          } else {
            current += char
          }
        }

        result.push(current.trim())
        return result
      }

      const headers = parseCSVLine(lines[0]).map((h) => h.replace(/"/g, ""))
      const sampleData = lines.slice(1, 6).map((line) => parseCSVLine(line).map((cell) => cell.replace(/"/g, "")))

      // Analyze data types
      const dataTypes: { [key: string]: string } = {}
      headers.forEach((header, index) => {
        const sampleValues = sampleData.map((row) => row[index]).filter((val) => val && val.trim() !== "")

        if (sampleValues.length === 0) {
          dataTypes[header] = "text"
          return
        }

        // Check data types
        const allNumbers = sampleValues.every((val) => !isNaN(Number(val)) && val.includes("."))
        const allIntegers = sampleValues.every((val) => !isNaN(Number(val)) && !val.includes("."))
        const allDates = sampleValues.every((val) => {
          const date = new Date(val)
          return !isNaN(date.getTime())
        })
        const allBooleans = sampleValues.every(
          (val) => val.toLowerCase() === "true" || val.toLowerCase() === "false" || val === "1" || val === "0",
        )

        if (allBooleans) {
          dataTypes[header] = "boolean"
        } else if (allNumbers) {
          dataTypes[header] = "decimal"
        } else if (allIntegers) {
          dataTypes[header] = "integer"
        } else if (allDates) {
          dataTypes[header] = "date"
        } else {
          dataTypes[header] = "text"
        }
      })

      // Smart table detection
      const lowerHeaders = headers.map((h) => h.toLowerCase())
      let suggestedTable = "custom_import"
      let suggestedMapping: { [key: string]: string } = {}

      // Earnings patterns
      if (
        lowerHeaders.some((h) => h.includes("amount") || h.includes("revenue") || h.includes("income")) &&
        lowerHeaders.some((h) => h.includes("date")) &&
        (lowerHeaders.some((h) => h.includes("source")) || lowerHeaders.some((h) => h.includes("booking")))
      ) {
        suggestedTable = "earnings"
        suggestedMapping = {
          [headers.find((h) => h.toLowerCase().includes("date")) || ""]: "date",
          [headers.find((h) => h.toLowerCase().includes("amount") || h.toLowerCase().includes("revenue")) || ""]:
            "amount",
          [headers.find((h) => h.toLowerCase().includes("source") || h.toLowerCase().includes("booking")) || ""]:
            "source",
          [headers.find((h) => h.toLowerCase().includes("description") || h.toLowerCase().includes("notes")) || ""]:
            "description",
        }
      }
      // Expense patterns
      else if (
        lowerHeaders.some((h) => h.includes("amount") || h.includes("cost")) &&
        lowerHeaders.some((h) => h.includes("date")) &&
        lowerHeaders.some((h) => h.includes("vendor") || h.includes("recipient") || h.includes("payee"))
      ) {
        suggestedTable = "expenses"
        suggestedMapping = {
          [headers.find((h) => h.toLowerCase().includes("date")) || ""]: "date",
          [headers.find((h) => h.toLowerCase().includes("amount") || h.toLowerCase().includes("cost")) || ""]: "amount",
          [headers.find(
            (h) =>
              h.toLowerCase().includes("vendor") ||
              h.toLowerCase().includes("recipient") ||
              h.toLowerCase().includes("payee"),
          ) || ""]: "recipient",
          [headers.find((h) => h.toLowerCase().includes("category")) || ""]: "category_name",
          [headers.find((h) => h.toLowerCase().includes("description") || h.toLowerCase().includes("notes")) || ""]:
            "notes",
        }
      }
      // Trip patterns
      else if (
        lowerHeaders.some((h) => h.includes("guest") || h.includes("customer") || h.includes("renter")) &&
        (lowerHeaders.some((h) => h.includes("start") || h.includes("checkin")) ||
          lowerHeaders.some((h) => h.includes("end") || h.includes("checkout")))
      ) {
        suggestedTable = "trips"
        suggestedMapping = {
          [headers.find(
            (h) =>
              h.toLowerCase().includes("guest") ||
              h.toLowerCase().includes("customer") ||
              h.toLowerCase().includes("renter"),
          ) || ""]: "guest_name",
          [headers.find((h) => h.toLowerCase().includes("start") || h.toLowerCase().includes("checkin")) || ""]:
            "start_date",
          [headers.find((h) => h.toLowerCase().includes("end") || h.toLowerCase().includes("checkout")) || ""]:
            "end_date",
          [headers.find(
            (h) =>
              h.toLowerCase().includes("amount") ||
              h.toLowerCase().includes("total") ||
              h.toLowerCase().includes("revenue"),
          ) || ""]: "total_amount",
          [headers.find((h) => h.toLowerCase().includes("vehicle") || h.toLowerCase().includes("car")) || ""]:
            "vehicle_id",
        }
      }
      // Vehicle patterns
      else if (
        lowerHeaders.some((h) => h.includes("make") || h.includes("brand")) &&
        lowerHeaders.some((h) => h.includes("model")) &&
        (lowerHeaders.some((h) => h.includes("year")) || lowerHeaders.some((h) => h.includes("vin")))
      ) {
        suggestedTable = "vehicles"
        suggestedMapping = {
          [headers.find((h) => h.toLowerCase().includes("make") || h.toLowerCase().includes("brand")) || ""]: "make",
          [headers.find((h) => h.toLowerCase().includes("model")) || ""]: "model",
          [headers.find((h) => h.toLowerCase().includes("year")) || ""]: "year",
          [headers.find((h) => h.toLowerCase().includes("vin")) || ""]: "vin",
          [headers.find((h) => h.toLowerCase().includes("license") || h.toLowerCase().includes("plate")) || ""]:
            "license_plate",
        }
      }

      // Remove empty mappings
      Object.keys(suggestedMapping).forEach((key) => {
        if (!key || key === "") {
          delete suggestedMapping[key]
        }
      })

      setAnalysis({
        filename: file.name,
        totalRows: lines.length - 1,
        headers,
        sampleData,
        dataTypes,
        suggestedTable,
        suggestedMapping,
      })

      toast({
        title: "CSV Analyzed Successfully",
        description: `Found ${headers.length} columns and ${lines.length - 1} rows`,
      })
    } catch (error) {
      console.error("CSV Analysis Error:", error)
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the CSV file. Please check the format.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast({
          title: "Invalid File",
          description: "Please select a CSV file",
          variant: "destructive",
        })
        return
      }
      analyzeCSV(file)
    }
  }

  const generateImportCode = () => {
    if (!analysis) return

    const code = `
// Generated import code for ${analysis.filename}
// Suggested table: ${analysis.suggestedTable}

const importData = async (csvData: string[][]) => {
  const mappedData = csvData.map(row => ({
${Object.entries(analysis.suggestedMapping)
  .map(([csvCol, dbCol]) => {
    const index = analysis.headers.indexOf(csvCol)
    return `    ${dbCol}: row[${index}], // ${csvCol}`
  })
  .join("\n")}
  }))
  
  // Insert into ${analysis.suggestedTable} table
  const { data, error } = await supabase
    .from('${analysis.suggestedTable}')
    .insert(mappedData)
    
  return { data, error }
}
    `.trim()

    navigator.clipboard.writeText(code)
    toast({
      title: "Code Copied",
      description: "Import code has been copied to your clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CSV Analyzer
          </CardTitle>
          <CardDescription>Upload your CSV file to analyze its structure and get import suggestions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="csv-file">Upload CSV File</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="flex-1"
                />
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Upload className="h-4 w-4 animate-pulse" />
                    Analyzing...
                  </div>
                )}
              </div>
            </div>

            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                <strong>How to use:</strong> Select your CSV file above. The analyzer will detect column types, suggest
                which database table to import to, and show you a preview of your data.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          {/* File Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Analysis Results</CardTitle>
                <Button onClick={generateImportCode} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Copy Import Code
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Filename</div>
                  <div className="font-medium">{analysis.filename}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Rows</div>
                  <div className="font-medium">{analysis.totalRows.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Columns</div>
                  <div className="font-medium">{analysis.headers.length}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Suggested Table</div>
                  <Badge variant="secondary">{analysis.suggestedTable}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Column Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Column Mapping</CardTitle>
              <CardDescription>How your CSV columns map to database fields</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CSV Column</TableHead>
                      <TableHead>Detected Type</TableHead>
                      <TableHead>Database Field</TableHead>
                      <TableHead>Sample Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.headers.map((header, index) => (
                      <TableRow key={header}>
                        <TableCell className="font-medium">{header}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{analysis.dataTypes[header]}</Badge>
                        </TableCell>
                        <TableCell>
                          {analysis.suggestedMapping[header] ? (
                            <Badge variant="default">{analysis.suggestedMapping[header]}</Badge>
                          ) : (
                            <Badge variant="secondary">unmapped</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                          {analysis.sampleData[0]?.[index] || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Sample Data Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>First 5 rows from your CSV file</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {analysis.headers.map((header) => (
                        <TableHead key={header} className="min-w-32">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.sampleData.map((row, index) => (
                      <TableRow key={index}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex} className="text-sm max-w-32 truncate">
                            {cell || "-"}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Import Suggestions */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Ready to Import:</strong> This CSV appears to match the <strong>{analysis.suggestedTable}</strong>{" "}
              table structure.
              {Object.keys(analysis.suggestedMapping).length > 0 && (
                <span> We've automatically mapped {Object.keys(analysis.suggestedMapping).length} columns.</span>
              )}
              {Object.keys(analysis.suggestedMapping).length === 0 && (
                <span className="text-amber-600"> No automatic mapping found - you may need custom import logic.</span>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}
