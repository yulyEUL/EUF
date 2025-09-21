import { FinancialsOverview } from "@/components/financials/financials-overview"
import { FinancialsFilters } from "@/components/financials/financials-filters"
import { FinancialsCharts } from "@/components/financials/financials-charts"
import { FinancialsTable } from "@/components/financials/financials-table"

export default function FinancialsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
          <p className="text-muted-foreground">Track your revenue, expenses, and profit margin in one place.</p>
        </div>
        <FinancialsFilters />
      </div>
      <FinancialsOverview />
      <FinancialsCharts />
      <FinancialsTable />
    </div>
  )
}
