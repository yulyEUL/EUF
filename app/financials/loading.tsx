import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList } from "@/components/ui/tabs"

export default function FinancialsLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
          <p className="text-muted-foreground">Track your revenue, expenses, and profit margin in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-5 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Financial Trends</CardTitle>
            <Tabs defaultValue="monthly">
              <TabsList>
                <Skeleton className="h-8 w-[240px]" />
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <Skeleton className="h-9 w-[200px]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[150px]" />
            </div>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 border-b p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-24" />
                ))}
              </div>
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="grid grid-cols-5 p-4 border-b last:border-0">
                  {[1, 2, 3, 4, 5].map((col) => (
                    <Skeleton key={col} className="h-4 w-24" />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-[100px]" />
              <Skeleton className="h-8 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
