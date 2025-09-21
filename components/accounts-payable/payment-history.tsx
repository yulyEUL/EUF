"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowUpDown, Calendar, Download, FileText, Search } from "lucide-react"
import { DateRangePicker } from "../ui/date-range-picker"

// Sample data - in a real app, this would come from your API
const payments = [
  {
    id: "PAY-001",
    invoiceId: "INV-001",
    vendor: "AutoParts Inc.",
    amount: 1250.75,
    date: new Date("2023-04-20"),
    method: "Bank Transfer",
    reference: "REF-2023-001",
    status: "completed",
  },
  {
    id: "PAY-002",
    invoiceId: "INV-005",
    vendor: "City Parking Inc.",
    amount: 2300.0,
    date: new Date("2023-05-02"),
    method: "Credit Card",
    reference: "REF-2023-002",
    status: "completed",
  },
  {
    id: "PAY-003",
    invoiceId: "INV-003",
    vendor: "CleanCar Services",
    amount: 750.5,
    date: new Date("2023-05-10"),
    method: "Bank Transfer",
    reference: "REF-2023-003",
    status: "completed",
  },
  {
    id: "PAY-004",
    invoiceId: "INV-004",
    vendor: "Insurance Group",
    amount: 12500.0,
    date: new Date("2023-05-15"),
    method: "ACH",
    reference: "REF-2023-004",
    status: "processing",
  },
  {
    id: "PAY-005",
    invoiceId: "INV-006",
    vendor: "AutoParts Inc.",
    amount: 875.25,
    date: new Date("2023-05-20"),
    method: "Bank Transfer",
    reference: "REF-2023-005",
    status: "completed",
  },
]

export function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [methodFilter, setMethodFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Filter payments based on search term, method, and date range
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesMethod = methodFilter === "all" || payment.method === methodFilter

    const matchesDateRange =
      (!dateRange.from || payment.date >= dateRange.from) && (!dateRange.to || payment.date <= dateRange.to)

    return matchesSearch && matchesMethod && matchesDateRange
  })

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="ACH">ACH</SelectItem>
              <SelectItem value="Check">Check</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Payment ID</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Date
                  <Calendar className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.invoiceId}</TableCell>
                  <TableCell>{payment.vendor}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>{payment.reference}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View receipt</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredPayments.length}</span> of{" "}
          <span className="font-medium">{payments.length}</span> payments
        </div>
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>
    </>
  )
}
