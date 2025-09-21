"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, TableIcon, AlertCircle, CheckCircle, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Column {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
  character_maximum_length?: number
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
  hint?: string
}

export function DatabaseViewer() {
  const [schema, setSchema] = useState<DatabaseSchema>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "error">("checking")
  const { toast } = useToast()

  const fetchSchema = async () => {
    setLoading(true)
    setError(null)
    setConnectionStatus("checking")

    try {
      const response = await fetch("/api/database/schema", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data: ApiResponse = await response.json()

      if (response.ok) {
        setSchema(data.schema || {})
        setConnectionStatus("connected")

        const tableCount = Object.keys(data.schema || {}).length
        toast({
          title: "Database Connected",
          description: `Found ${tableCount} tables`,
        })
      } else {
        setError(data.error || "Failed to fetch database schema")
        setConnectionStatus("error")
        toast({
          title: "Connection Error",
          description: data.error || "Failed to fetch database schema",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = "Failed to connect to database API"
      setError(errorMessage)
      setConnectionStatus("error")
      toast({
        title: "API Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchema()
  }, [])

  const tableNames = Object.keys(schema).sort()
  const totalColumns = Object.values(schema).reduce((sum, columns) => sum + columns.length, 0)

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
              Connection Failed
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
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Troubleshooting Steps:
              </h4>
              <ol className="list-decimal list-inside space-y-3 text-sm">
                <li>
                  <strong>Check your Vercel environment variables:</strong>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
                    </li>
                    <li>
                      <code className="bg-gray-100 px-2 py-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code>
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Verify your Supabase project is active</strong>
                  <br />
                  <span className="text-muted-foreground">Go to supabase.com and check your project status</span>
                </li>
                <li>
                  <strong>Run the database setup script</strong>
                  <br />
                  <span className="text-muted-foreground">Execute the SQL script in your Supabase SQL Editor</span>
                </li>
                <li>
                  <strong>Check service role key permissions</strong>
                  <br />
                  <span className="text-muted-foreground">Make sure it has full database access</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-2">Quick Fix:</h5>
              <p className="text-blue-800 text-sm">
                Go to your Supabase project → Settings → API → Copy your service role key and update it in Vercel.
              </p>
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
          <Button variant="outline" size="sm" onClick={fetchSchema}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tableNames.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>No tables found.</strong> Your database connection is working, but no tables exist yet.
              <br />
              <br />
              <strong>Next step:</strong> Run the database setup script to create your tables.
              <br />
              Go to your Supabase SQL Editor and run the complete setup script.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue={tableNames[0]} className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1 h-auto p-1 mb-4">
              {tableNames.slice(0, 18).map((tableName) => (
                <TabsTrigger
                  key={tableName}
                  value={tableName}
                  className="text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <TableIcon className="h-3 w-3 mr-1" />
                  {tableName}
                </TabsTrigger>
              ))}
            </TabsList>

            {tableNames.map((tableName) => (
              <TabsContent key={tableName} value={tableName} className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TableIcon className="h-5 w-5" />
                      {tableName}
                    </CardTitle>
                    <CardDescription>{schema[tableName]?.length || 0} columns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Column Name</TableHead>
                            <TableHead>Data Type</TableHead>
                            <TableHead>Nullable</TableHead>
                            <TableHead>Default Value</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {schema[tableName]?.map((column) => (
                            <TableRow key={column.column_name}>
                              <TableCell className="font-medium">{column.column_name}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">
                                  {column.data_type}
                                  {column.character_maximum_length && `(${column.character_maximum_length})`}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={column.is_nullable === "YES" ? "outline" : "default"}>
                                  {column.is_nullable === "YES" ? "Yes" : "No"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground max-w-32 truncate">
                                {column.column_default || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
