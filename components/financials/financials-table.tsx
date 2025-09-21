"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon, ArrowUpDownIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function FinancialsTable() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  // Mock data - would come from API in real app
  const transactions = [
    {
      id: "TX-1234",
      date: "2023-06-15",
      description: "Vehicle Rental - Toyota Camry",
      category: "revenue",
      type: "Rental Fees",
      amount: 650,
    },
    {
      id: "TX-1235",
      date: "2023-06-16",
      description: "Insurance Premium - Toyota Camry",
      category: "revenue",
      type: "Insurance",
      amount: 120,
    },
    {
      id: "TX-1236",
      date: "2023-06-17",
      description: "Vehicle Maintenance - Honda Civic",
      category: "expense",
      type: "Maintenance",
      amount: -250,
    },
    {
      id: "TX-1237",
      date: "2023-06-18",
      description: "Fuel Refill - Multiple Vehicles",
      category: "expense",
      type: "Fuel",
      amount: -180,
    },
    {
      id: "TX-1238",
      date: "2023-06-19",
      description: "Late Return Fee - BMW X5",
      category: "revenue",
      type: "Late Fees",
      amount: 75,
    },
    {
      id: "TX-1239",
      date: "2023-06-20",
      description: "Staff Salary - June Week 3",
      category: "expense",
      type: "Staff",
      amount: -1200,
    },
    {
      id: "TX-1240",
      date: "2023-06-21",
      description: "Vehicle Rental - Audi A4",
      category: "revenue",
      type: "Rental Fees",
      amount: 850,
    },
    {
      id: "TX-1241",
      date: "2023-06-22",
      description: "Marketing Campaign - Social Media",
      category: "expense",
      type: "Marketing",
      amount: -350,
    },
    {
      id: "TX-1242",
      date: "2023-06-23",
      description: "Premium Upgrade Package - Mercedes C300",
      category: "revenue",
      type: "Upgrades",
      amount: 200,
    },
    {
      id: "TX-1243",
      date: "2023-06-24",
      description: "Insurance Claim Processing",
      category: "expense",
      type: "Insurance",
      amount: -450,
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "revenue" && transaction.category === "revenue") ||
      (filter === "expense" && transaction.category === "expense")

    const matchesSearch = search
      ? transaction.description.toLowerCase().includes(search.toLowerCase()) ||
        transaction.id.toLowerCase().includes(search.toLowerCase()) ||
        transaction.type.toLowerCase().includes(search.toLowerCase())
      : true

    return matchesFilter && matchesSearch
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>Transactions</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="revenue">Revenue Only</SelectItem>
              <SelectItem value="expense">Expenses Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <ArrowUpDownIcon className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            transaction.category === "revenue"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                              : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          transaction.amount > 0
                            ? "text-emerald-600 dark:text-emerald-500"
                            : "text-red-600 dark:text-red-500"
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={filteredTransactions.length < 10}
              >
                <ChevronRightIcon className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
