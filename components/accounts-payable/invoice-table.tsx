"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowUpDown, Download, FileText, MoreHorizontal, Plus, Search } from "lucide-react"
import { AddInvoiceDialog } from "./add-invoice-dialog"
import { PayInvoiceDialog } from "./pay-invoice-dialog"

// Sample data - in a real app, this would come from your API
const invoices = [
  {
    id: "INV-001",
    vendor: "AutoParts Inc.",
    amount: 1250.75,
    date: new Date("2023-04-15"),
    dueDate: new Date("2023-05-15"),
    status: "paid",
    category: "Parts",
    reference: "PO-2023-042",
  },
  {
    id: "INV-002",
    vendor: "Premium Tires Ltd.",
    amount: 3450.0,
    date: new Date("2023-04-20"),
    dueDate: new Date("2023-05-20"),
    status: "pending",
    category: "Maintenance",
    reference: "PO-2023-043",
  },
  {
    id: "INV-003",
    vendor: "CleanCar Services",
    amount: 750.5,
    date: new Date("2023-04-22"),
    dueDate: new Date("2023-05-22"),
    status: "overdue",
    category: "Cleaning",
    reference: "PO-2023-044",
  },
  {
    id: "INV-004",
    vendor: "Insurance Group",
    amount: 12500.0,
    date: new Date("2023-04-25"),
    dueDate: new Date("2023-05-25"),
    status: "pending",
    category: "Insurance",
    reference: "PO-2023-045",
  },
  {
    id: "INV-005",
    vendor: "City Parking Inc.",
    amount: 2300.0,
    date: new Date("2023-04-28"),
    dueDate: new Date("2023-05-28"),
    status: "paid",
    category: "Parking",
    reference: "PO-2023-046",
  },
  {
    id: "INV-006",
    vendor: "AutoParts Inc.",
    amount: 875.25,
    date: new Date("2023-05-02"),
    dueDate: new Date("2023-06-02"),
    status: "pending",
    category: "Parts",
    reference: "PO-2023-047",
  },
  {
    id: "INV-007",
    vendor: "Fuel Suppliers Co.",
    amount: 5680.5,
    date: new Date("2023-05-05"),
    dueDate: new Date("2023-06-05"),
    status: "pending",
    category: "Fuel",
    reference: "PO-2023-048",
  },
]

export function InvoiceTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddInvoice, setShowAddInvoice] = useState(false)
  const [showPayInvoice, setShowPayInvoice] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  // Filter invoices based on search term and status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.reference.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handlePayInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setShowPayInvoice(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowAddInvoice(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Invoice
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.vendor}</TableCell>
                  <TableCell>{invoice.category}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>{invoice.reference}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => console.log("View details", invoice.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {invoice.status !== "paid" && (
                          <DropdownMenuItem onClick={() => handlePayInvoice(invoice)}>
                            <Download className="mr-2 h-4 w-4" />
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => console.log("Download", invoice.id)}>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredInvoices.length}</span> of{" "}
          <span className="font-medium">{invoices.length}</span> invoices
        </div>
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>

      <AddInvoiceDialog open={showAddInvoice} onOpenChange={setShowAddInvoice} />
      {selectedInvoice && (
        <PayInvoiceDialog open={showPayInvoice} onOpenChange={setShowPayInvoice} invoice={selectedInvoice} />
      )}
    </>
  )
}
