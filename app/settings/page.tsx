"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Download, FileText, Plus, Search, Trash, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useTheme } from "next-themes"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"

// Mock data for staff members
const staffMembers = [
  {
    id: 1,
    name: "John Doe",
    nickname: "Johnny",
    role: "Manager",
    compensationType: "Salary",
    startDate: "2023-01-15",
    documents: 3,
  },
  {
    id: 2,
    name: "Jane Smith",
    nickname: "Janie",
    role: "Driver",
    compensationType: "Hourly",
    startDate: "2023-03-22",
    documents: 2,
  },
  {
    id: 3,
    name: "Robert Johnson",
    nickname: "Rob",
    role: "Mechanic",
    compensationType: "Contract",
    startDate: "2023-02-10",
    documents: 5,
  },
  {
    id: 4,
    name: "Sarah Williams",
    nickname: "Sare",
    role: "Customer Service",
    compensationType: "Hourly",
    startDate: "2023-04-05",
    documents: 1,
  },
]

// Mock data for expense categories
const expenseCategories = [
  { id: 1, name: "Fuel", description: "Gasoline and diesel expenses" },
  { id: 2, name: "Maintenance", description: "Vehicle repairs and regular maintenance" },
  { id: 3, name: "Insurance", description: "Vehicle insurance premiums" },
  { id: 4, name: "Parking", description: "Parking fees and permits" },
  { id: 5, name: "Tolls", description: "Highway and bridge tolls" },
]

// Types for import results
interface ImportResult {
  success: boolean
  totalRows: number
  validRows: number
  errorRows: number
  errorRecords: Array<{
    row: number
    data: string
    errors: string[]
  }>
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date>()
  const [searchStaff, setSearchStaff] = useState("")
  const [searchCategory, setSearchCategory] = useState("")
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importType, setImportType] = useState<"earnings" | "expenses">("earnings")
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [showImportResult, setShowImportResult] = useState(false)
  const { setTheme } = useTheme()

  // Filter staff members based on search
  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchStaff.toLowerCase()) ||
      staff.nickname.toLowerCase().includes(searchStaff.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchStaff.toLowerCase()),
  )

  // Filter expense categories based on search
  const filteredCategories = expenseCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchCategory.toLowerCase()) ||
      category.description.toLowerCase().includes(searchCategory.toLowerCase()),
  )

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      setImportResult(null)
      setShowImportResult(false)
    }
  }

  // Handle file upload and processing
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setImportProgress(0)

    try {
      // Create form data
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Call the appropriate API endpoint
      const endpoint = importType === "earnings" ? "/api/import/earnings" : "/api/import/expenses"
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setImportProgress(100)

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Import failed")
      }

      setImportResult(result)
      setShowImportResult(true)
      setIsImporting(false)
      setImportProgress(0)

      if (result.errorRows === 0) {
        toast({
          title: "Import successful",
          description: `Successfully imported ${result.validRows} ${importType} records to the database.`,
        })
      } else {
        toast({
          title: "Import completed with errors",
          description: `Imported ${result.validRows} records, ${result.errorRows} records had errors.`,
          variant: "destructive",
        })
      }

      // Reset file input
      setSelectedFile(null)
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      setIsImporting(false)
      setImportProgress(0)
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "An error occurred while processing the file.",
        variant: "destructive",
      })
    }
  }

  // Generate sample CSV content
  const generateSampleCSV = (type: "earnings" | "expenses"): string => {
    if (type === "earnings") {
      return `Date,Amount,Source,Description
2024-01-15,1250.00,Trip Rental,5-day rental - Toyota Camry
2024-01-16,75.00,Cleaning Fee,Post-trip cleaning
2024-01-17,2100.00,Trip Rental,7-day rental - Honda Accord
2024-01-18,50.00,Late Return Fee,2-hour late return penalty`
    } else {
      return `Date,Amount,Recipient,Category,Notes
2024-01-15,45.50,Shell Gas Station,Fuel,Vehicle refueling
2024-01-16,125.00,AutoCare Center,Maintenance,Oil change and inspection
2024-01-17,89.99,State Farm,Insurance,Monthly insurance premium
2024-01-18,15.00,Downtown Parking,Parking,Airport parking fee`
    }
  }

  // Download sample CSV
  const downloadSampleCSV = (type: "earnings" | "expenses") => {
    const content = generateSampleCSV(type)
    const blob = new Blob([content], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sample_${type}_import.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Handle adding a new expense category
  const handleAddCategory = () => {
    if (newCategory.name.trim() === "") {
      toast({
        title: "Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Category added",
      description: `${newCategory.name} has been added to expense categories.`,
    })

    setNewCategory({ name: "", description: "" })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="expense-categories">Expense Categories</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Manage your staff members and their information</CardDescription>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Staff
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Add New Staff Member</SheetTitle>
                    <SheetDescription>Fill in the details to add a new staff member.</SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="nickname">Nickname</Label>
                      <Input id="nickname" placeholder="Johnny" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="driver">Driver</SelectItem>
                          <SelectItem value="mechanic">Mechanic</SelectItem>
                          <SelectItem value="customer-service">Customer Service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="compensation">Compensation Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="salary">Salary</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="commission">Commission</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="documents">Documents</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Input id="document-upload" type="file" />
                          <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Upload staff documents (ID, contracts, certifications)
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline">Cancel</Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Staff member added",
                          description: "The new staff member has been added successfully.",
                        })
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchStaff}
                  onChange={(e) => setSearchStaff(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Nickname</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Compensation</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.nickname}</TableCell>
                        <TableCell>{staff.role}</TableCell>
                        <TableCell>{staff.compensationType}</TableCell>
                        <TableCell>{format(new Date(staff.startDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                {staff.documents}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{staff.name}'s Documents</DialogTitle>
                                <DialogDescription>View and manage documents for this staff member.</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-2 my-4">
                                <div className="flex items-center justify-between p-2 border rounded-md">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    <span>Employment_Contract.pdf</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between p-2 border rounded-md">
                                  <div className="flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    <span>ID_Document.jpg</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="ghost">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost">
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                {staff.documents > 2 && (
                                  <div className="flex items-center justify-between p-2 border rounded-md">
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 mr-2" />
                                      <span>Certification.pdf</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="ghost">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                      <Button size="sm" variant="ghost">
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Input type="file" />
                                <Button size="sm">Upload</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Expense Categories Tab */}
        <TabsContent value="expense-categories" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expense Categories</CardTitle>
                <CardDescription>Manage expense categories for financial tracking</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search categories..."
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                    />
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category Name</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCategories.map((category) => (
                          <TableRow key={category.id}>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell>{category.description}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-lg font-medium mb-4">Add New Category</h3>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category-name">Category Name</Label>
                        <Input
                          id="category-name"
                          placeholder="e.g., Office Supplies"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category-description">Description</Label>
                        <Textarea
                          id="category-description"
                          placeholder="Brief description of this expense category"
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        />
                      </div>
                      <Button className="w-full" onClick={handleAddCategory}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CSV Import</CardTitle>
              <CardDescription>Import data from CSV files directly to your database</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="earnings" className="w-full">
                <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
                  <TabsTrigger value="earnings" onClick={() => setImportType("earnings")}>
                    Earnings Import
                  </TabsTrigger>
                  <TabsTrigger value="expenses" onClick={() => setImportType("expenses")}>
                    Expenses Import
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="earnings" className="space-y-4">
                  <div className="rounded-md border p-6">
                    <h3 className="text-lg font-medium mb-2">Import Earnings Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a CSV file containing earnings data. Valid records will be saved to your database.
                    </p>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="file-upload">Select CSV File</Label>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          disabled={isImporting}
                        />
                        {selectedFile && (
                          <div className="text-sm text-muted-foreground">
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </div>
                        )}
                      </div>

                      {isImporting && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Processing and saving to database...</span>
                            <span>{importProgress}%</span>
                          </div>
                          <Progress value={importProgress} className="w-full" />
                        </div>
                      )}

                      <div className="rounded-md bg-muted p-4">
                        <h4 className="text-sm font-medium mb-2">CSV Format Requirements</h4>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          <li>First row must contain headers</li>
                          <li>Required columns: Date, Amount, Source, Description</li>
                          <li>Date format: YYYY-MM-DD (e.g., 2024-01-15)</li>
                          <li>Amount format: Decimal number (e.g., 1250.00)</li>
                          <li>Maximum file size: 5MB</li>
                        </ul>
                      </div>

                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          onClick={() => downloadSampleCSV("earnings")}
                          className="flex items-center"
                        >
                          <Download className="mr-1 h-4 w-4" />
                          Download template
                        </Button>
                        <Button onClick={handleUpload} disabled={!selectedFile || isImporting}>
                          <Upload className="mr-2 h-4 w-4" />
                          {isImporting ? "Importing to Database..." : "Import to Database"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="expenses" className="space-y-4">
                  <div className="rounded-md border p-6">
                    <h3 className="text-lg font-medium mb-2">Import Expenses Data</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload a CSV file containing expense data. Valid records will be saved to your database.
                    </p>

                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="file-upload">Select CSV File</Label>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".csv"
                          onChange={handleFileChange}
                          disabled={isImporting}
                        />
                        {selectedFile && (
                          <div className="text-sm text-muted-foreground">
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </div>
                        )}
                      </div>

                      {isImporting && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Processing and saving to database...</span>
                            <span>{importProgress}%</span>
                          </div>
                          <Progress value={importProgress} className="w-full" />
                        </div>
                      )}

                      <div className="rounded-md bg-muted p-4">
                        <h4 className="text-sm font-medium mb-2">CSV Format Requirements</h4>
                        <ul className="text-sm list-disc pl-5 space-y-1">
                          <li>First row must contain headers</li>
                          <li>Required columns: Date, Amount, Recipient, Category, Notes</li>
                          <li>Date format: YYYY-MM-DD (e.g., 2024-01-15)</li>
                          <li>Amount format: Decimal number (e.g., 1250.00)</li>
                          <li>Category must match: {expenseCategories.map((c) => c.name).join(", ")}</li>
                          <li>Maximum file size: 5MB</li>
                        </ul>
                      </div>

                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          onClick={() => downloadSampleCSV("expenses")}
                          className="flex items-center"
                        >
                          <Download className="mr-1 h-4 w-4" />
                          Download template
                        </Button>
                        <Button onClick={handleUpload} disabled={!selectedFile || isImporting}>
                          <Upload className="mr-2 h-4 w-4" />
                          {isImporting ? "Importing to Database..." : "Import to Database"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Import Results Dialog */}
              <Dialog open={showImportResult} onOpenChange={setShowImportResult}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {importResult && importResult.errorRows === 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      Database Import Results
                    </DialogTitle>
                    <DialogDescription>Review the import results and any validation errors</DialogDescription>
                  </DialogHeader>

                  {importResult && (
                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold">{importResult.totalRows}</div>
                            <div className="text-sm text-muted-foreground">Total Records</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">{importResult.validRows}</div>
                            <div className="text-sm text-muted-foreground">Saved to Database</div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">{importResult.errorRows}</div>
                            <div className="text-sm text-muted-foreground">Error Records</div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Error Records */}
                      {importResult.errorRows > 0 && (
                        <div>
                          <h4 className="text-lg font-medium mb-2">Records with Errors (Not Saved)</h4>
                          <div className="rounded-md border max-h-60 overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Row</TableHead>
                                  <TableHead>Data</TableHead>
                                  <TableHead>Errors</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {importResult.errorRecords.map((record) => (
                                  <TableRow key={record.row}>
                                    <TableCell>{record.row}</TableCell>
                                    <TableCell className="max-w-xs truncate">{record.data}</TableCell>
                                    <TableCell>
                                      <div className="space-y-1">
                                        {record.errors.map((error, i) => (
                                          <Badge key={i} variant="destructive" className="text-xs">
                                            {error}
                                          </Badge>
                                        ))}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}

                      {/* Success Message */}
                      {importResult.errorRows === 0 && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            All {importResult.validRows} records were successfully saved to your database.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">Select your preferred theme mode for the application.</p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="grid gap-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="theme-mode">Theme Mode</Label>
                      </div>
                      <Select
                        defaultValue="system"
                        onValueChange={(value) => {
                          setTheme(value)
                        }}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Preview:</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Color Scheme</h3>
                  <p className="text-sm text-muted-foreground">Choose a color scheme for the application.</p>
                  <div className="grid gap-2 pt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="justify-start border-2 border-primary bg-transparent">
                        <span className="mr-2 h-4 w-4 rounded-full bg-primary"></span>
                        Default
                      </Button>
                      <Button variant="outline" className="justify-start bg-transparent">
                        <span className="mr-2 h-4 w-4 rounded-full bg-blue-600"></span>
                        Blue
                      </Button>
                      <Button variant="outline" className="justify-start bg-transparent">
                        <span className="mr-2 h-4 w-4 rounded-full bg-green-600"></span>
                        Green
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Font Size</h3>
                  <p className="text-sm text-muted-foreground">Adjust the font size for better readability.</p>
                  <div className="grid gap-2 pt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="justify-start bg-transparent">
                        Small
                      </Button>
                      <Button variant="outline" className="justify-start border-2 border-primary bg-transparent">
                        Medium
                      </Button>
                      <Button variant="outline" className="justify-start bg-transparent">
                        Large
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
