"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Upload, Eye, Edit, Power, Download, MessageSquare } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Mock data for co-hosts
const coHosts = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    totalRevenue: 12450.75,
    carsManaged: 2,
    trips: 34,
    reviewScore: 4.8,
    status: "active",
    joinDate: "2023-01-15",
    avatar: "/contemplative-artist.png",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    totalRevenue: 8320.5,
    carsManaged: 1,
    trips: 22,
    reviewScore: 4.9,
    status: "active",
    joinDate: "2023-03-22",
    avatar: "/diverse-group-city.png",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    totalRevenue: 15780.25,
    carsManaged: 3,
    trips: 41,
    reviewScore: 4.7,
    status: "inactive",
    joinDate: "2022-11-05",
    avatar: "",
  },
]

// Mock data for vehicles
const vehicles = [
  {
    id: "v1",
    coHostId: "1",
    make: "Toyota",
    model: "RAV4",
    year: 2022,
    plate: "ABC123",
    status: "active",
    earnings: 6230.5,
    image: "/electric-vehicle-cityscape.png",
  },
  {
    id: "v2",
    coHostId: "1",
    make: "Honda",
    model: "Civic",
    year: 2021,
    plate: "XYZ789",
    status: "maintenance",
    earnings: 6220.25,
    image: "/classic-bmw-road.png",
  },
  {
    id: "v3",
    coHostId: "2",
    make: "Tesla",
    model: "Model 3",
    year: 2023,
    plate: "EV2023",
    status: "active",
    earnings: 8320.5,
    image: "/audi-showroom-floor.png",
  },
]

// Mock data for earnings
const earnings = [
  {
    id: "e1",
    coHostId: "1",
    month: "January 2024",
    totalRevenue: 2450.75,
    ownerSplit: 1715.53,
    yourSplit: 735.22,
    breakdown: [
      { category: "Base Rental", total: 2200.0, ownerPercentage: 70, ownerAmount: 1540.0, yourAmount: 660.0 },
      { category: "Cleaning Fee", total: 150.75, ownerPercentage: 50, ownerAmount: 75.38, yourAmount: 75.37 },
      { category: "Smoking Fee", total: 100.0, ownerPercentage: 10, ownerAmount: 10.0, yourAmount: 90.0 },
    ],
  },
  {
    id: "e2",
    coHostId: "1",
    month: "February 2024",
    totalRevenue: 2180.5,
    ownerSplit: 1526.35,
    yourSplit: 654.15,
    breakdown: [
      { category: "Base Rental", total: 1950.0, ownerPercentage: 70, ownerAmount: 1365.0, yourAmount: 585.0 },
      { category: "Cleaning Fee", total: 130.5, ownerPercentage: 50, ownerAmount: 65.25, yourAmount: 65.25 },
      { category: "Late Return Fee", total: 100.0, ownerPercentage: 30, ownerAmount: 30.0, yourAmount: 70.0 },
    ],
  },
]

// Mock data for trips
const trips = [
  {
    id: "t1",
    coHostId: "1",
    vehicleId: "v1",
    guestName: "Alex Thompson",
    startDate: "2024-01-10",
    endDate: "2024-01-15",
    status: "completed",
    totalEarned: 750.25,
  },
  {
    id: "t2",
    coHostId: "1",
    vehicleId: "v2",
    guestName: "Jessica Miller",
    startDate: "2024-02-05",
    endDate: "2024-02-10",
    status: "completed",
    totalEarned: 680.5,
  },
  {
    id: "t3",
    coHostId: "1",
    vehicleId: "v1",
    guestName: "David Wilson",
    startDate: "2024-04-20",
    endDate: "2024-04-25",
    status: "upcoming",
    totalEarned: 800.0,
  },
]

// Mock data for tasks
const tasks = [
  {
    id: "task1",
    coHostId: "1",
    vehicleId: "v1",
    type: "Car Wash",
    dueDate: "2024-03-15",
    status: "completed",
    notes: "Regular wash and vacuum",
  },
  {
    id: "task2",
    coHostId: "1",
    vehicleId: "v2",
    type: "Pre-trip Check",
    dueDate: "2024-04-18",
    status: "pending",
    notes: "Check tire pressure and fluid levels",
  },
  {
    id: "task3",
    coHostId: "1",
    vehicleId: "v1",
    type: "Deep Cleaning",
    dueDate: "2024-04-26",
    status: "pending",
    notes: "Full interior and exterior cleaning",
  },
]

// Mock data for messages
const messages = [
  {
    id: "m1",
    coHostId: "1",
    guestName: "Alex Thompson",
    date: "2024-03-10T14:30:00",
    content: "Hi, I'll be arriving around 2 PM tomorrow. Is that okay?",
    read: true,
  },
  {
    id: "m2",
    coHostId: "1",
    guestName: "Jessica Miller",
    date: "2024-04-05T09:15:00",
    content: "The car was great! Thanks for the smooth rental experience.",
    read: true,
  },
  {
    id: "m3",
    coHostId: "1",
    guestName: "David Wilson",
    date: "2024-04-15T16:45:00",
    content: "I have a question about the pickup location for next week's rental.",
    read: false,
  },
]

// Mock data for notes and feedback
const notes = [
  {
    id: "n1",
    coHostId: "1",
    type: "internal",
    date: "2024-02-20",
    content: "John is very responsive and keeps his vehicles in excellent condition.",
    author: "Admin",
  },
  {
    id: "n2",
    coHostId: "1",
    type: "review",
    date: "2024-01-16",
    content: "The car was spotless and the host was very accommodating with pickup time.",
    author: "Alex Thompson",
    rating: 5,
  },
  {
    id: "n3",
    coHostId: "1",
    type: "review",
    date: "2024-02-11",
    content: "Great experience overall. The car was as described and ran perfectly.",
    author: "Jessica Miller",
    rating: 4,
  },
]

export default function CoHostingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCoHost, setSelectedCoHost] = useState<any>(null)
  const [isDetailView, setIsDetailView] = useState(false)
  const [isAddCoHostOpen, setIsAddCoHostOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)

  // Filter co-hosts based on active tab and search query
  const filteredCoHosts = coHosts.filter((host) => {
    const matchesStatus = activeTab === "all" || host.status === activeTab
    const matchesSearch =
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Handle view co-host details
  const handleViewCoHost = (coHost: any) => {
    setSelectedCoHost(coHost)
    setIsDetailView(true)
  }

  // Handle back to list view
  const handleBackToList = () => {
    setIsDetailView(false)
    setSelectedCoHost(null)
  }

  // Handle add new co-host
  const handleAddCoHost = (formData: any) => {
    // In a real app, this would add the co-host to the database
    toast({
      title: "Co-host added",
      description: `${formData.name} has been added as a co-host.`,
    })
    setIsAddCoHostOpen(false)
  }

  // Handle import CSV
  const handleImportCSV = (type: string, file: File | null) => {
    if (!file) return

    // In a real app, this would process the CSV file
    toast({
      title: "Import started",
      description: `Importing ${type} data from ${file.name}`,
    })
    setIsImportOpen(false)
  }

  // Get co-host vehicles
  const getCoHostVehicles = (coHostId: string) => {
    return vehicles.filter((vehicle) => vehicle.coHostId === coHostId)
  }

  // Get co-host earnings
  const getCoHostEarnings = (coHostId: string) => {
    return earnings.filter((earning) => earning.coHostId === coHostId)
  }

  // Get co-host trips
  const getCoHostTrips = (coHostId: string) => {
    return trips.filter((trip) => trip.coHostId === coHostId)
  }

  // Get co-host tasks
  const getCoHostTasks = (coHostId: string) => {
    return tasks.filter((task) => task.coHostId === coHostId)
  }

  // Get co-host messages
  const getCoHostMessages = (coHostId: string) => {
    return messages.filter((message) => message.coHostId === coHostId)
  }

  // Get co-host notes
  const getCoHostNotes = (coHostId: string) => {
    return notes.filter((note) => note.coHostId === coHostId)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="p-6 space-y-6">
      {!isDetailView ? (
        // Admin View - List of all co-hosts
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Co-Hosting Management</h1>
            <div className="flex space-x-2">
              <Sheet open={isImportOpen} onOpenChange={setIsImportOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import CSV
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Import Data</SheetTitle>
                    <SheetDescription>Upload CSV files to import earnings and payment data.</SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-6 py-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Import Earnings Split</h3>
                      <div className="grid gap-2">
                        <Label htmlFor="earningsFile">Upload earnings CSV file</Label>
                        <Input id="earningsFile" type="file" accept=".csv" />
                        <p className="text-sm text-muted-foreground">
                          CSV should include: Co-host ID, Month, Revenue Category, Total Amount, Owner Percentage
                        </p>
                        <Button
                          onClick={() =>
                            handleImportCSV(
                              "earnings",
                              (document.getElementById("earningsFile") as HTMLInputElement)
                                ? (document.getElementById("earningsFile") as HTMLInputElement).files?.[0] || null
                                : null,
                            )
                          }
                          className="w-full"
                        >
                          Upload Earnings
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Import Payments</h3>
                      <div className="grid gap-2">
                        <Label htmlFor="paymentsFile">Upload payments CSV file</Label>
                        <Input id="paymentsFile" type="file" accept=".csv" />
                        <p className="text-sm text-muted-foreground">
                          CSV should include: Co-host ID, Payment Date, Amount, Payment Method, Notes
                        </p>
                        <Button
                          onClick={() =>
                            handleImportCSV(
                              "payments",
                              (document.getElementById("paymentsFile") as HTMLInputElement)
                                ? (document.getElementById("paymentsFile") as HTMLInputElement).files?.[0] || null
                                : null,
                            )
                          }
                          className="w-full"
                        >
                          Upload Payments
                        </Button>
                      </div>
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Sheet open={isAddCoHostOpen} onOpenChange={setIsAddCoHostOpen}>
                <SheetTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Co-Host
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Add New Co-Host</SheetTitle>
                    <SheetDescription>Enter the details of the new co-host.</SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Smith" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john.smith@example.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="(555) 123-4567" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" placeholder="123 Main St, City, State, ZIP" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="defaultSplit">Default Revenue Split (%)</Label>
                        <Input id="defaultSplit" type="number" placeholder="70" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" placeholder="Additional information about this co-host..." />
                    </div>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <Button
                      onClick={() =>
                        handleAddCoHost({
                          name: (document.getElementById("name") as HTMLInputElement).value,
                          email: (document.getElementById("email") as HTMLInputElement).value,
                        })
                      }
                    >
                      Add Co-Host
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search co-hosts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Co-Hosts</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Co-Host</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead className="hidden md:table-cell">Cars</TableHead>
                    <TableHead className="hidden md:table-cell">Trips</TableHead>
                    <TableHead className="hidden md:table-cell">Avg. Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoHosts.map((coHost) => (
                    <TableRow key={coHost.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {coHost.avatar ? (
                              <AvatarImage src={coHost.avatar || "/placeholder.svg"} alt={coHost.name} />
                            ) : null}
                            <AvatarFallback>{getInitials(coHost.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{coHost.name}</div>
                            <div className="text-sm text-muted-foreground">{coHost.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(coHost.totalRevenue)}</TableCell>
                      <TableCell className="hidden md:table-cell">{coHost.carsManaged}</TableCell>
                      <TableCell className="hidden md:table-cell">{coHost.trips}</TableCell>
                      <TableCell className="hidden md:table-cell">{coHost.reviewScore}</TableCell>
                      <TableCell>
                        <Badge variant={coHost.status === "active" ? "default" : "secondary"}>
                          {coHost.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewCoHost(coHost)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Power className="h-4 w-4" />
                            <span className="sr-only">{coHost.status === "active" ? "Deactivate" : "Activate"}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        // Individual Co-Host Detail View
        <>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBackToList}>
              Back to All Co-Hosts
            </Button>
            <h1 className="text-3xl font-bold">Co-Host Details</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Header Section */}
            <Card className="md:col-span-3">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      {selectedCoHost?.avatar ? (
                        <AvatarImage src={selectedCoHost.avatar || "/placeholder.svg"} alt={selectedCoHost.name} />
                      ) : null}
                      <AvatarFallback className="text-xl">{getInitials(selectedCoHost?.name || "")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCoHost?.name}</h2>
                      <p className="text-muted-foreground">{selectedCoHost?.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={selectedCoHost?.status === "active" ? "default" : "secondary"}>
                          {selectedCoHost?.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Joined {formatDate(selectedCoHost?.joinDate || "")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end gap-1">
                    <div className="text-sm text-muted-foreground">Total Revenue Generated</div>
                    <div className="text-2xl font-bold">{formatCurrency(selectedCoHost?.totalRevenue || 0)}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{selectedCoHost?.reviewScore || 0} / 5</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.round(selectedCoHost?.reviewScore || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 fill-current"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Section */}
            <div className="md:col-span-3">
              <Tabs defaultValue="vehicles">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
                  <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                  <TabsTrigger value="earnings">Earnings & Split</TabsTrigger>
                  <TabsTrigger value="trips">Trips</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="notes">Notes & Feedback</TabsTrigger>
                </TabsList>

                {/* Vehicles Tab */}
                <TabsContent value="vehicles" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Vehicles Managed</h3>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Vehicle
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getCoHostVehicles(selectedCoHost?.id).map((vehicle) => (
                      <Card key={vehicle.id}>
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                          <img
                            src={vehicle.image || "/placeholder.svg"}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </h4>
                              <p className="text-sm text-muted-foreground">Plate: {vehicle.plate}</p>
                            </div>
                            <Badge variant={vehicle.status === "active" ? "default" : "destructive"}>
                              {vehicle.status === "active" ? "Active" : "Maintenance"}
                            </Badge>
                          </div>
                          <div className="mt-4">
                            <div className="text-sm text-muted-foreground">Total Earnings</div>
                            <div className="text-lg font-semibold">{formatCurrency(vehicle.earnings)}</div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-end">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Earnings & Split Tab */}
                <TabsContent value="earnings" className="space-y-6 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Earnings & Revenue Split</h3>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </Button>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Payment
                      </Button>
                    </div>
                  </div>

                  {/* Monthly Earnings Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Monthly Earnings Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Month</TableHead>
                            <TableHead>Total Revenue</TableHead>
                            <TableHead>Co-Host Split</TableHead>
                            <TableHead>Your Split</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCoHostEarnings(selectedCoHost?.id).map((earning) => (
                            <TableRow key={earning.id}>
                              <TableCell>{earning.month}</TableCell>
                              <TableCell>{formatCurrency(earning.totalRevenue)}</TableCell>
                              <TableCell>{formatCurrency(earning.ownerSplit)}</TableCell>
                              <TableCell>{formatCurrency(earning.yourSplit)}</TableCell>
                              <TableCell className="text-right">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      View Breakdown
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[600px]">
                                    <DialogHeader>
                                      <DialogTitle>Revenue Breakdown - {earning.month}</DialogTitle>
                                      <DialogDescription>
                                        Detailed breakdown of revenue and splits for {earning.month}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Category</TableHead>
                                          <TableHead>Total</TableHead>
                                          <TableHead>Owner %</TableHead>
                                          <TableHead>Owner Amount</TableHead>
                                          <TableHead>Your Amount</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {earning.breakdown.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>{formatCurrency(item.total)}</TableCell>
                                            <TableCell>{item.ownerPercentage}%</TableCell>
                                            <TableCell>{formatCurrency(item.ownerAmount)}</TableCell>
                                            <TableCell>{formatCurrency(item.yourAmount)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                    <DialogFooter>
                                      <Button>Download</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Revenue Split Visualization */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Split Percentages</CardTitle>
                        <CardDescription>Default percentages for different revenue types</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Base Rental (70% Co-Host / 30% You)</span>
                            </div>
                            <div className="flex h-2 rounded overflow-hidden">
                              <div className="bg-blue-500 w-[70%]"></div>
                              <div className="bg-green-500 w-[30%]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Cleaning Fee (50% Co-Host / 50% You)</span>
                            </div>
                            <div className="flex h-2 rounded overflow-hidden">
                              <div className="bg-blue-500 w-[50%]"></div>
                              <div className="bg-green-500 w-[50%]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Late Return Fee (30% Co-Host / 70% You)</span>
                            </div>
                            <div className="flex h-2 rounded overflow-hidden">
                              <div className="bg-blue-500 w-[30%]"></div>
                              <div className="bg-green-500 w-[70%]"></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Smoking Fee (10% Co-Host / 90% You)</span>
                            </div>
                            <div className="flex h-2 rounded overflow-hidden">
                              <div className="bg-blue-500 w-[10%]"></div>
                              <div className="bg-green-500 w-[90%]"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                        <CardDescription>Recent payments to co-host</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <div className="font-medium">March 2024 Payment</div>
                              <div className="text-sm text-muted-foreground">Paid on Apr 5, 2024</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(1526.35)}</div>
                              <Badge variant="outline">Direct Deposit</Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <div className="font-medium">February 2024 Payment</div>
                              <div className="text-sm text-muted-foreground">Paid on Mar 5, 2024</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(1715.53)}</div>
                              <Badge variant="outline">Direct Deposit</Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div>
                              <div className="font-medium">January 2024 Payment</div>
                              <div className="text-sm text-muted-foreground">Paid on Feb 5, 2024</div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">{formatCurrency(1680.22)}</div>
                              <Badge variant="outline">Direct Deposit</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Trips Tab */}
                <TabsContent value="trips" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Trips</h3>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Trips</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Trip ID</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Guest</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Earnings</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getCoHostTrips(selectedCoHost?.id).map((trip) => {
                            const vehicle = vehicles.find((v) => v.id === trip.vehicleId)
                            return (
                              <TableRow key={trip.id}>
                                <TableCell className="font-medium">{trip.id}</TableCell>
                                <TableCell>{vehicle ? `${vehicle.make} ${vehicle.model}` : "Unknown"}</TableCell>
                                <TableCell>{trip.guestName}</TableCell>
                                <TableCell>
                                  <div>{formatDate(trip.startDate)}</div>
                                  <div className="text-sm text-muted-foreground">to {formatDate(trip.endDate)}</div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={trip.status === "completed" ? "default" : "secondary"}>
                                    {trip.status === "completed" ? "Completed" : "Upcoming"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{formatCurrency(trip.totalEarned)}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="ghost" size="sm">
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tasks Tab */}
                <TabsContent value="tasks" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Tasks</h3>
                    <div className="flex gap-2">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Assign Task
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getCoHostTasks(selectedCoHost?.id).map((task) => {
                      const vehicle = vehicles.find((v) => v.id === task.vehicleId)
                      return (
                        <Card key={task.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold">{task.type}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.plate})` : "Unknown Vehicle"}
                                </p>
                              </div>
                              <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                                {task.status === "completed" ? "Completed" : "Pending"}
                              </Badge>
                            </div>
                            <div className="mt-2">
                              <div className="text-sm text-muted-foreground">Due Date</div>
                              <div>{formatDate(task.dueDate)}</div>
                            </div>
                            <div className="mt-2">
                              <div className="text-sm text-muted-foreground">Notes</div>
                              <div>{task.notes}</div>
                            </div>
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                            {task.status === "pending" && <Button size="sm">Mark Complete</Button>}
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </CardFooter>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Messages</h3>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        New Message
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {getCoHostMessages(selectedCoHost?.id).map((message) => (
                      <Card key={message.id} className={message.read ? "" : "border-blue-500"}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{message.guestName}</h4>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(message.date), "MMM d, yyyy h:mm a")}
                              </p>
                            </div>
                            {!message.read && <Badge>New</Badge>}
                          </div>
                          <div className="mt-2 p-3 bg-muted rounded-md">{message.content}</div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Reply
                          </Button>
                          {!message.read && <Button size="sm">Mark as Read</Button>}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Notes & Feedback Tab */}
                <TabsContent value="notes" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Notes & Feedback</h3>
                    <div className="flex gap-2">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Note
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {getCoHostNotes(selectedCoHost?.id).map((note) => (
                      <Card key={note.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <Badge variant={note.type === "internal" ? "outline" : "default"}>
                                {note.type === "internal" ? "Internal Note" : "Guest Review"}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDate(note.date)} by {note.author}
                              </p>
                            </div>
                            {note.type === "review" && note.rating && (
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= note.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300 fill-current"
                                    }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="mt-3">{note.content}</div>
                        </CardContent>
                        {note.type === "internal" && (
                          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </CardFooter>
                        )}
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
