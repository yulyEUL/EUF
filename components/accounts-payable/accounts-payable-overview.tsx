"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, ClockIcon } from "lucide-react"

export function AccountsPayableOverview() {
  // In a real application, this data would come from your API
  const summaryData = {
    totalOutstanding: 42680.75,
    overdue: 8750.25,
    dueThisWeek: 12450.5,
    paidLastMonth: 38920.3,
    overdueChange: 12.5, // percentage change
    outstandingChange: -8.3, // percentage change
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          <div
            className={`flex items-center text-xs ${summaryData.outstandingChange < 0 ? "text-green-500" : "text-red-500"}`}
          >
            {summaryData.outstandingChange < 0 ? (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            )}
            {Math.abs(summaryData.outstandingChange)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summaryData.totalOutstanding)}</div>
          <p className="text-xs text-muted-foreground">From all vendors</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <div
            className={`flex items-center text-xs ${summaryData.overdueChange < 0 ? "text-green-500" : "text-red-500"}`}
          >
            {summaryData.overdueChange < 0 ? (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            )}
            {Math.abs(summaryData.overdueChange)}%
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summaryData.overdue)}</div>
          <p className="text-xs text-muted-foreground">Past due invoices</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Due This Week</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summaryData.dueThisWeek)}</div>
          <p className="text-xs text-muted-foreground">Upcoming payments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid Last Month</CardTitle>
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summaryData.paidLastMonth)}</div>
          <p className="text-xs text-muted-foreground">30-day payment history</p>
        </CardContent>
      </Card>
    </div>
  )
}
