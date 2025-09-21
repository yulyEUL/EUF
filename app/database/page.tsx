import { DatabaseViewer } from "@/components/database-viewer"
import { CSVAnalyzer } from "@/components/csv-analyzer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DatabasePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Database Management</h1>
      </div>

      <Tabs defaultValue="schema" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="schema">Database Schema</TabsTrigger>
          <TabsTrigger value="csv-analyzer">CSV Analyzer</TabsTrigger>
        </TabsList>

        <TabsContent value="schema" className="space-y-4">
          <DatabaseViewer />
        </TabsContent>

        <TabsContent value="csv-analyzer" className="space-y-4">
          <CSVAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  )
}
