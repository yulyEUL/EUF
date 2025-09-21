"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Database, TableIcon, AlertCircle } from "lucide-react"
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

export function DatabaseViewer() {
  const [schema, setSchema] = useState<DatabaseSchema>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSchema = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/database/schema")
      const data = await response.json()

      if (response.ok) {
        setSchema(data.schema || {})
        toast({
          title: "Schema Loaded",
          description: `Found ${Object.keys(data.schema || {}).length} tables`,
        })
      } else {
        setError(data.error || "Failed to fetch database schema")
        toast({
          title: "Error",
          description: data.error || "Failed to fetch database schema",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = "Failed to connect to database"
      setError(errorMessage)
      toast({
        title: "Connection Error",
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
          <CardDescription>Loading database structure...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
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
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Database Connection Error:</strong> {error}
              <br />
              <br />
              Make sure you have:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Set up your Supabase project</li>
                <li>Added environment variables</li>
                <li>Run the database setup script</li>
              </ul>
            </AlertDescription>
          </Alert>
          <Button onClick={fetchSchema} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
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
              <strong>No tables found.</strong> Run the database setup script to create your tables.
              <br />
              <br />
              Go to the Scripts section and run: <code>scripts/create-complete-schema.sql</code>
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
