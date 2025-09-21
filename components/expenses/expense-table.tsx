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
import { Badge } from "@/components/ui/badge"
import { Car, Edit, FileText, MoreHorizontal, Trash2, Receipt } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

const expenses = [
  {
    id: "EXP-001",
    date: new Date("2023-07-28"),
    category: "Maintenance",
    description: "Oil change and filter replacement",
    vehicle: "Tesla Model Y (ABC-1234)",
    amount: 89.95,
    status: "Completed",
    receipt: true,
  },
  {
    id: "EXP-002",
    date: new Date("2023-07-27"),
    category: "Fuel",
    description: "Fuel refill",
    vehicle: "BMW X5 (XYZ-5678)",
    amount: 75.42,
    status: "Completed",
    receipt: true,
  },
  {
    id: "EXP-003",
    date: new Date("2023-07-25"),
    category: "Insurance",
    description: "Monthly insurance premium",
    vehicle: "Multiple vehicles",
    amount: 2100.0,
    status: "Completed",
    receipt: true,
  },
  {
    id: "EXP-004",
    date: new Date("2023-07-24"),
    category: "Maintenance",
    description: "Brake pad replacement",
    vehicle: "Honda CR-V (DEF-9012)",
    amount: 245.75,
    status: "Completed",
    receipt: true,
  },
  {
    id: "EXP-005",
    date: new Date("2023-07-22"),
    category: "Cleaning",
    description: "Full interior and exterior detailing",
    vehicle: "Mercedes GLC (GHI-3456)",
    amount: 189.99,
    status: "Completed",
    receipt: false,
  },
  {
    id: "EXP-006",
    date: new Date("2023-07-20"),
    category: "Maintenance",
    description: "Tire rotation and alignment",
    vehicle: "Toyota Camry (JKL-7890)",
    amount: 120.5,
    status: "Pending",
    receipt: false,
  },
  {
    id: "EXP-007",
    date: new Date("2023-07-18"),
    category: "Parking",
    description: "Monthly parking fee",
    vehicle: "Multiple vehicles",
    amount: 850.0,
    status: "Completed",
    receipt: true,
  },
  {
    id: "EXP-008",
    date: new Date("2023-07-15"),
    category: "Fuel",
    description: "Fuel refill",
    vehicle: "Jeep Wrangler (MNO-1234)",
    amount: 82.35,
    status: "Completed",
    receipt: true,
  },
]

export function ExpenseTable() {
  const [data] = useState(expenses)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Receipt</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.id}</TableCell>
              <TableCell>{formatDate(expense.date)}</TableCell>
              <TableCell>
                <Badge variant="outline">{expense.category}</Badge>
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{expense.vehicle}</span>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
              <TableCell>
                <Badge variant={expense.status === "Completed" ? "default" : "secondary"}>{expense.status}</Badge>
              </TableCell>
              <TableCell className="text-center">
                {expense.receipt ? (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Receipt className="h-4 w-4" />
                  </Button>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
