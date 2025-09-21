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
import { formatCurrency } from "@/lib/utils"
import { ArrowUpDown, Download, MoreHorizontal, Plus, Search } from "lucide-react"
import { AddVendorDialog } from "./add-vendor-dialog"

// Sample data - in a real app, this would come from your API
const vendors = [
  {
    id: "V001",
    name: "AutoParts Inc.",
    contact: "John Smith",
    email: "john@autoparts.com",
    phone: "(555) 123-4567",
    outstanding: 2125.75,
    totalPaid: 15750.5,
    category: "Parts Supplier",
    status: "active",
  },
  {
    id: "V002",
    name: "Premium Tires Ltd.",
    contact: "Sarah Johnson",
    email: "sarah@premiumtires.com",
    phone: "(555) 234-5678",
    outstanding: 3450.0,
    totalPaid: 22340.75,
    category: "Tire Supplier",
    status: "active",
  },
  {
    id: "V003",
    name: "CleanCar Services",
    contact: "Mike Brown",
    email: "mike@cleancar.com",
    phone: "(555) 345-6789",
    outstanding: 750.5,
    totalPaid: 8950.25,
    category: "Cleaning Services",
    status: "active",
  },
  {
    id: "V004",
    name: "Insurance Group",
    contact: "Lisa Davis",
    email: "lisa@insurancegroup.com",
    phone: "(555) 456-7890",
    outstanding: 12500.0,
    totalPaid: 87500.0,
    category: "Insurance Provider",
    status: "active",
  },
  {
    id: "V005",
    name: "City Parking Inc.",
    contact: "David Wilson",
    email: "david@cityparking.com",
    phone: "(555) 567-8901",
    outstanding: 0.0,
    totalPaid: 18700.0,
    category: "Parking Services",
    status: "inactive",
  },
  {
    id: "V006",
    name: "Fuel Suppliers Co.",
    contact: "Jennifer Lee",
    email: "jennifer@fuelsuppliers.com",
    phone: "(555) 678-9012",
    outstanding: 5680.5,
    totalPaid: 42350.75,
    category: "Fuel Provider",
    status: "active",
  },
]

export function VendorTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddVendor, setShowAddVendor] = useState(false)

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-4">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" onClick={() => setShowAddVendor(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Vendor Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Outstanding
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Total Paid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No vendors found.
                </TableCell>
              </TableRow>
            ) : (
              filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.id}</TableCell>
                  <TableCell>{vendor.name}</TableCell>
                  <TableCell>
                    <div>{vendor.contact}</div>
                    <div className="text-sm text-muted-foreground">{vendor.email}</div>
                  </TableCell>
                  <TableCell>{vendor.category}</TableCell>
                  <TableCell className={vendor.outstanding > 0 ? "text-amber-600 font-medium" : ""}>
                    {formatCurrency(vendor.outstanding)}
                  </TableCell>
                  <TableCell>{formatCurrency(vendor.totalPaid)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        vendor.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                    </span>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => console.log("View details", vendor.id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Edit", vendor.id)}>Edit Vendor</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("View invoices", vendor.id)}>
                          View Invoices
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => console.log("Toggle status", vendor.id)}>
                          {vendor.status === "active" ? "Mark as Inactive" : "Mark as Active"}
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
          Showing <span className="font-medium">{filteredVendors.length}</span> of{" "}
          <span className="font-medium">{vendors.length}</span> vendors
        </div>
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      </div>

      <AddVendorDialog open={showAddVendor} onOpenChange={setShowAddVendor} />
    </>
  )
}
