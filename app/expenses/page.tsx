import { ExpenseOverview } from "@/components/expenses/expense-overview"
import { ExpenseCharts } from "@/components/expenses/expense-charts"
import { ExpenseTable } from "@/components/expenses/expense-table"
import { ExpenseFilters } from "@/components/expenses/expense-filters"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <AddExpenseDialog />
      </div>

      <ExpenseOverview />

      <ExpenseCharts />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Expense Transactions</h2>
          <ExpenseFilters />
        </div>
        <ExpenseTable />
      </div>
    </div>
  )
}
