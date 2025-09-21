"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Database, Table, AlertCircle, RefreshCw, CheckCircle } from "lucide-react"
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
  message: string
  error?: string
  details?: string
}

export function DatabaseViewer() {
  const [schema, setSchema] = useState<DatabaseSchema>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openTables, setOpenTables] = useState<Set<string>>(new Set())

  const fetchSchema = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/database/schema", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      const data: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      setSchema(data.schema || {})
      console.log("Schema loaded:", data)
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
    if (dataType.includes("int") || dataType.includes("numeric")) return "bg-green-100 text-green-800"
    if (dataType.includes("timestamp") || dataType.includes("date")) return "bg-purple-100 text-purple-800"
    if (dataType.includes("boolean")) return "bg-orange-100 text-orange-800"
    return "bg-gray-100 text-gray-800"
  }

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

          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Troubleshooting Checklist:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 rounded"></div>
                  <span>Supabase project is active and accessible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 rounded"></div>
                  <span>Environment variables are set in Vercel</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 rounded"></div>
                  <span>Database setup script has been executed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 rounded"></div>
                  <span>Service role key has proper permissions</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-2">Quick Fix Steps:</h5>
              <ol className="text-blue-800 text-sm space-y-1">
                <li>1. Go to Supabase → Settings → API</li>
                <li>2. Copy your service_role key</li>
                <li>3. Update SUPABASE_SERVICE_ROLE_KEY in Vercel</li>
                <li>4. Redeploy your application</li>
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

  const tableNames = Object.keys(schema).sort()
  const totalColumns = Object.values(schema).reduce((sum, columns) => sum + columns.length, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Schema
              <Badge variant="default" className="ml-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </CardTitle>
            <CardDescription>
              {tableNames.length} tables • {totalColumns} total columns
            </CardDescription>
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
        {tableNames.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>No tables found.</strong> Your database connection is working, but no tables exist yet.
              <br />
              <br />
              <strong>Next step:</strong> Run the database setup script in your Supabase SQL Editor.
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
      </CardContent>
    </Card>
  )
}
