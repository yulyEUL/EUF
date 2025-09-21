"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

export function FinancialsOverview() {
  // Mock data - would come from API in real app
  const financialData = {
    revenue: {
      total: 42680,
      change: 12.5,
      trend: "up",
    },
    expenses: {
      total: 28450,
      change: 8.3,
      trend: "up",
    },
    profit: {
      total: 14230,
      change: 18.7,
      trend: "up",
    },
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateProfitMargin = () => {
    return ((financialData.profit.total / financialData.revenue.total) * 100).toFixed(1)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Gross Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
            {formatCurrency(financialData.revenue.total)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            {financialData.revenue.trend === "up" ? (
              <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
            )}
            <span className={financialData.revenue.trend === "up" ? "text-emerald-500" : "text-red-500"}>
              {financialData.revenue.change}%
            </span>
            <span className="ml-1">vs previous period</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-500">
            {formatCurrency(financialData.expenses.total)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            {financialData.expenses.trend === "up" ? (
              <ArrowUpIcon className="mr-1 h-4 w-4 text-red-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4 text-emerald-500" />
            )}
            <span className={financialData.expenses.trend === "up" ? "text-red-500" : "text-emerald-500"}>
              {financialData.expenses.change}%
            </span>
            <span className="ml-1">vs previous period</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
            {formatCurrency(financialData.profit.total)}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs text-muted-foreground">
              {financialData.profit.trend === "up" ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={financialData.profit.trend === "up" ? "text-emerald-500" : "text-red-500"}>
                {financialData.profit.change}%
              </span>
              <span className="ml-1">vs previous period</span>
            </div>
            <div className="text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded-full">
              {calculateProfitMargin()}% margin
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
