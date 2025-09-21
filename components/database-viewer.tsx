"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Database, Table, AlertCircle, RefreshCw, CheckCircle, Search } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Column {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
  character_maximum_length: number | null
}

interface DatabaseSchema {
  [tableName: string]: Column[]
}

interface ApiResponse {
  schema: DatabaseSchema
  tableCount: number
  totalColumns?: number
  message: string
  method?: string
  error?: string
  details?: string
  debug?: any
  errors?: any
}

export function DatabaseViewer() {
  const [schema, setSchema] = useState<DatabaseSchema>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openTables, setOpenTables] = useState<Set<string>>(new Set())
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchSchema = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching schema from API...")

      const response = await fetch("/api/database/schema", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      const data: ApiResponse = await response.json()
      setApiResponse(data)

      console.log("API Response:", data)

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      setSchema(data.schema || {})

      // Log detailed info about what we received
      const tableCount = Object.keys(data.schema || {}).length
      const totalColumns = Object.values(data.schema || {}).reduce((sum, columns) => sum + columns.length, 0)

      console.log(`Loaded ${tableCount} tables with ${totalColumns} total columns`)
      console.log("Tables:", Object.keys(data.schema || {}))

      // Log column counts per table
      Object.entries(data.schema || {}).forEach(([tableName, columns]) => {
        console.log(`${tableName}: ${columns.length} columns`)
      })
    } catch (err) {
      console.error("Failed to fetch schema:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch database schema")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchema()
  }, [])

  const toggleTable = (tableName: string) => {
    const newOpenTables = new Set(openTables)
    if (newOpenTables.has(tableName)) {
      newOpenTables.delete(tableName)
    } else {
      newOpenTables.add(tableName)
    }
    setOpenTables(newOpenTables)
  }

  const toggleAllTables = () => {
    const tableNames = Object.keys(schema)
    if (openTables.size === tableNames.length) {
      setOpenTables(new Set())
    } else {
      setOpenTables(new Set(tableNames))
    }
  }

  const getDataTypeColor = (dataType: string) => {
    if (dataType.includes("varchar") || dataType.includes("text")) return "bg-blue-100 text-blue-800"
    if (dataType.includes("int") || dataType.includes("numeric") || dataType.includes("decimal"))
      return "bg-green-100 text-green-800"
    if (dataType.includes("timestamp") || dataType.includes("date")) return "bg-purple-100 text-purple-800"
    if (dataType.includes("boolean")) return "bg-orange-100 text-orange-800"
    if (dataType.includes("uuid")) return "bg-indigo-100 text-indigo-800"
    if (dataType.includes("json")) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  const filteredTables = Object.keys(schema)
    .filter(
      (tableName) =>
        tableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schema[tableName].some((col) => col.column_name.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Schema
          </CardTitle>
          <CardDescription>Connecting to database...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading database schema...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Schema
            <Badge variant="destructive" className="ml-2">
              <AlertCircle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Database Connection Error:</strong> {error}
            </AlertDescription>
          </Alert>

          {apiResponse?.debug && (
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Debug Information:</h4>
              <pre className="text-xs overflow-auto">{JSON.stringify(apiResponse.debug, null, 2)}</pre>
            </div>
          )}

          {apiResponse?.errors && (
            <div className="bg-muted p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Error Details:</h4>
              <pre className="text-xs overflow-auto">{JSON.stringify(apiResponse.errors, null, 2)}</pre>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Troubleshooting:</h4>
              <ol className="text-sm space-y-2 list-decimal list-inside">
                <li>Make sure you've run the schema functions script in Supabase SQL Editor</li>
                <li>Check that your environment variables are set correctly</li>
                <li>Verify your Supabase service role key has the right permissions</li>
              </ol>
            </div>

            <Button onClick={fetchSchema} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const tableNames = filteredTables
  const totalColumns = Object.values(schema).reduce((sum, columns) => sum + columns.length, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Schema
              {tableNames.length > 0 ? (
                <Badge variant="default" className="ml-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="ml-2">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  No Tables
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {tableNames.length > 0
                ? `${tableNames.length} tables • ${totalColumns} total columns`
                : "Database connected but no tables found"}
            </CardDescription>
            {apiResponse && (
              <div className="text-xs text-muted-foreground mt-1">
                Method: {apiResponse.method} • {apiResponse.message}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {tableNames.length > 0 && (
              <Button variant="outline" size="sm" onClick={toggleAllTables}>
                {openTables.size === tableNames.length ? "Collapse All" : "Expand All"}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={fetchSchema}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {tableNames.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tables and columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {tableNames.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>No tables found.</strong> Your database connection is working, but no tables exist yet.
              <br />
              <br />
              <strong>Next step:</strong> Run the database setup script in your Supabase SQL Editor:
              <br />
              <code className="bg-muted px-2 py-1 rounded text-sm">scripts/create-complete-schema.sql</code>
            </AlertDescription>
          </Alert>
        ) : (
          tableNames.map((tableName) => (
            <Collapsible key={tableName} open={openTables.has(tableName)} onOpenChange={() => toggleTable(tableName)}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                {openTables.has(tableName) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Table className="h-4 w-4" />
                <span className="font-medium">{tableName}</span>
                <Badge variant="secondary" className="ml-auto">
                  {schema[tableName].length} columns
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-5 gap-4 p-3 bg-muted/30 font-medium text-sm">
                    <div>Column Name</div>
                    <div>Data Type</div>
                    <div>Nullable</div>
                    <div>Default</div>
                    <div>Max Length</div>
                  </div>
                  {schema[tableName].map((column, index) => (
                    <div
                      key={column.column_name}
                      className={`grid grid-cols-5 gap-4 p-3 text-sm ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                    >
                      <div className="font-mono font-medium">{column.column_name}</div>
                      <div>
                        <Badge variant="outline" className={getDataTypeColor(column.data_type)}>
                          {column.data_type}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant={column.is_nullable === "YES" ? "secondary" : "destructive"}>
                          {column.is_nullable === "YES" ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="font-mono text-xs">
                        {column.column_default ? (
                          <span className="bg-muted px-2 py-1 rounded">
                            {column.column_default.length > 20
                              ? `${column.column_default.substring(0, 20)}...`
                              : column.column_default}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                      <div>
                        {column.character_maximum_length ? (
                          <Badge variant="outline">{column.character_maximum_length}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        )}

        {searchTerm && filteredTables.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No tables or columns match "{searchTerm}"</div>
        )}
      </CardContent>
    </Card>
  )
}
