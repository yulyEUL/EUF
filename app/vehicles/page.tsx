"use client"

import type React from "react"

import { useState, useEffect, type ChangeEvent } from "react"
import Image from "next/image"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { format, parseISO } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Car,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Upload,
  LayoutGrid,
  List,
  CalendarIcon,
  ChevronDown,
  Route,
  Gauge,
  Wrench,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Battery,
  Disc,
  CircleDot,
  MapPin,
  CalendarRange,
  FileText,
  Tag,
  Briefcase,
  CheckCircle,
  XCircle,
  Edit3,
  Save,
  X,
} from "lucide-react"

// Define a more specific type for a vehicle
type Vehicle = {
  id: number
  make: string
  model: string
  year: string
  license: string
  vin: string
  status: "active" | "maintenance" | "inactive"
  image: string
  mileage: number
  listedDate: string // Consider using Date type if parsing
  location: string
  notes?: string
  earnings: string // Consider number for calculations
  trips: number
  rating: number
  purchaseInfo: {
    date: string // Consider Date
    price: string // Consider number
    seller: string
    financing: "Loan" | "Lease" | "Cash" | ""
    payment: string // Consider number
  }
  maintenance: {
    oil: { last: string; next: string; milesLeft: number }
    battery: { last: string; next: string; milesLeft: number }
    frontBrakes: { last: string; next: string; milesLeft: number }
    rearBrakes: { last: string; next: string; milesLeft: number }
    frontTires: { last: string; next: string; milesLeft: number }
    rearTires: { last: string; next: string; milesLeft: number }
  }
  inspections: Array<{ date: string; type: string; result: "Passed" | "Failed"; notes: string }>
  financials: {
    lifetimeEarnings: number
    lifetimeExpenses: number
    monthlyPerformance: Array<{ month: string; revenue: number; expenses: number }>
    recentTransactions: Array<{
      id: string
      date: string
      description: string
      amount: number
      type: "revenue" | "expense"
    }>
  }
  timeline: Array<{ date: string; title: string; description: string; icon: React.ElementType }>
}

export default function VehiclesPage() {
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"card" | "list">("card")
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [filterStartDate, setFilterStartDate] = useState<Date>()
  const [filterEndDate, setFilterEndDate] = useState<Date>()
  const [maintenanceFilterType, setMaintenanceFilterType] = useState<string>("all")
  const [maintenanceFilterStartDate, setMaintenanceFilterStartDate] = useState<Date>()
  const [maintenanceFilterEndDate, setMaintenanceFilterEndDate] = useState<Date>()

  const [isEditingVehicle, setIsEditingVehicle] = useState(false)
  const [editableVehicleData, setEditableVehicleData] = useState<Vehicle | null>(null)

  const initialVehicles: Vehicle[] = [
    {
      id: 1,
      make: "Tesla",
      model: "Model 3",
      year: "2023",
      license: "ABC123",
      vin: "5YJ3E1EA1PF123456",
      status: "active",
      image: "/electric-vehicle-cityscape.png",
      mileage: 12500,
      listedDate: "2023-01-15",
      location: "San Francisco, CA",
      notes: "Minor scratch on rear bumper, detailed during pre-listing inspection.",
      earnings: "$24,850",
      trips: 32,
      rating: 4.9,
      purchaseInfo: {
        date: "2023-01-10",
        price: "$38,000",
        seller: "Tesla Motors",
        financing: "Loan",
        payment: "$650/mo",
      },
      maintenance: {
        oil: { last: "2022-12-10", next: "2023-06-10", milesLeft: 2500 },
        battery: { last: "2023-01-05", next: "2025-01-05", milesLeft: 37500 },
        frontBrakes: { last: "2022-11-15", next: "2023-11-15", milesLeft: 17500 },
        rearBrakes: { last: "2022-11-15", next: "2023-11-15", milesLeft: 17500 },
        frontTires: { last: "2023-02-20", next: "2024-02-20", milesLeft: 22500 },
        rearTires: { last: "2023-02-20", next: "2024-02-20", milesLeft: 22500 },
      },
      inspections: [
        { date: "2023-03-15", type: "Annual Safety", result: "Passed", notes: "All systems normal" },
        { date: "2023-01-05", type: "Pre-listing", result: "Passed", notes: "Minor scratch on rear bumper" },
      ],
      financials: {
        lifetimeEarnings: 24850,
        lifetimeExpenses: 4500,
        monthlyPerformance: [
          { month: "Jan", revenue: 3200, expenses: 500 },
          { month: "Feb", revenue: 4500, expenses: 600 },
          { month: "Mar", revenue: 5100, expenses: 550 },
          { month: "Apr", revenue: 4800, expenses: 700 },
          { month: "May", revenue: 6250, expenses: 850 },
        ],
        recentTransactions: [
          { id: "TRN001", date: "2023-05-15", description: "Trip Revenue - John D.", amount: 450, type: "revenue" },
          { id: "TRN002", date: "2023-05-12", description: "Car Wash", amount: -25, type: "expense" },
          { id: "TRN003", date: "2023-05-10", description: "Trip Revenue - Jane S.", amount: 600, type: "revenue" },
          { id: "TRN004", date: "2023-05-05", description: "Parking Fee", amount: -15, type: "expense" },
        ],
      },
      timeline: [
        { date: "2023-05-15", title: "Trip Completed", description: "Guest: John D.", icon: Route },
        { date: "2023-05-10", title: "Trip Started", description: "Guest: John D.", icon: Route },
        { date: "2023-03-15", title: "Inspection Passed", description: "Annual Safety Inspection", icon: CheckCircle },
        { date: "2023-02-20", title: "Maintenance", description: "Tire Replacement", icon: Wrench },
        { date: "2023-01-15", title: "Vehicle Listed", description: "Listed on platform", icon: Tag },
        { date: "2023-01-10", title: "Vehicle Purchased", description: "From Tesla Motors", icon: Briefcase },
      ],
    },
    {
      id: 2,
      make: "BMW",
      model: "X5",
      year: "2022",
      license: "XYZ789",
      vin: "5UXCR6C56N9D12345",
      status: "maintenance",
      image: "/classic-bmw-road.png",
      mileage: 18750,
      listedDate: "2022-03-10",
      location: "Los Angeles, CA",
      notes: "Vehicle is currently undergoing scheduled maintenance. Oil change and brake inspection in progress.",
      earnings: "$31,200",
      trips: 45,
      rating: 4.7,
      purchaseInfo: {
        date: "2022-03-01",
        price: "$62,000",
        seller: "BMW of Beverly Hills",
        financing: "Lease",
        payment: "$850/mo",
      },
      maintenance: {
        oil: { last: "2023-02-15", next: "2023-08-15", milesLeft: 750 },
        battery: { last: "2022-03-10", next: "2024-03-10", milesLeft: 21250 },
        frontBrakes: { last: "2022-12-05", next: "2023-12-05", milesLeft: 11250 },
        rearBrakes: { last: "2022-12-05", next: "2023-12-05", milesLeft: 11250 },
        frontTires: { last: "2023-01-20", next: "2024-01-20", milesLeft: 16250 },
        rearTires: { last: "2023-01-20", next: "2024-01-20", milesLeft: 16250 },
      },
      inspections: [
        { date: "2023-04-10", type: "Annual Safety", result: "Passed", notes: "Recommended tire rotation" },
        { date: "2023-02-15", type: "Post-maintenance", result: "Passed", notes: "Oil change completed" },
        { date: "2022-03-01", type: "Pre-listing", result: "Passed", notes: "Vehicle in excellent condition" },
      ],
      financials: {
        lifetimeEarnings: 31200,
        lifetimeExpenses: 6800,
        monthlyPerformance: [
          { month: "Jan", revenue: 2800, expenses: 700 },
          { month: "Feb", revenue: 3500, expenses: 1200 },
          { month: "Mar", revenue: 4200, expenses: 800 },
          { month: "Apr", revenue: 3900, expenses: 950 },
          { month: "May", revenue: 5100, expenses: 1100 },
        ],
        recentTransactions: [
          { id: "TRN005", date: "2023-05-20", description: "Scheduled Maintenance", amount: -350, type: "expense" },
          { id: "TRN006", date: "2023-05-18", description: "Trip Revenue - Mike R.", amount: 750, type: "revenue" },
          { id: "TRN007", date: "2023-05-15", description: "Insurance Payment", amount: -150, type: "expense" },
          { id: "TRN008", date: "2023-05-01", description: "Lease Payment", amount: -850, type: "expense" },
        ],
      },
      timeline: [
        { date: "2023-05-20", title: "Maintenance", description: "Scheduled Maintenance", icon: Wrench },
        { date: "2023-04-10", title: "Inspection Passed", description: "Annual Safety Inspection", icon: CheckCircle },
        { date: "2022-03-10", title: "Vehicle Listed", description: "Listed on platform", icon: Tag },
        {
          date: "2022-03-01",
          title: "Vehicle Acquired",
          description: "Leased from BMW of Beverly Hills",
          icon: Briefcase,
        },
      ],
    },
  ]
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles)

  const getSelectedVehicle = (): Vehicle | undefined => {
    return vehicles.find((vehicle) => vehicle.id === selectedVehicleId)
  }

  useEffect(() => {
    if (selectedVehicleId !== null) {
      const vehicleToEdit = getSelectedVehicle()
      if (vehicleToEdit) {
        // Deep copy to avoid modifying the original state directly
        setEditableVehicleData(JSON.parse(JSON.stringify(vehicleToEdit)))
      }
    } else {
      setEditableVehicleData(null)
      setIsEditingVehicle(false)
    }
  }, [selectedVehicleId, vehicles])

  const handleEditClick = () => {
    const currentVehicle = getSelectedVehicle()
    if (currentVehicle) {
      setEditableVehicleData(JSON.parse(JSON.stringify(currentVehicle))) // Deep copy
      setIsEditingVehicle(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingVehicle(false)
    const currentVehicle = getSelectedVehicle()
    if (currentVehicle) {
      setEditableVehicleData(JSON.parse(JSON.stringify(currentVehicle))) // Reset to original
    }
  }

  const handleSaveEdit = () => {
    if (editableVehicleData) {
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => (v.id === editableVehicleData.id ? editableVehicleData : v)),
      )
      setIsEditingVehicle(false)
      // In a real app, you would make an API call here to save the data
      console.log("Saved vehicle data:", editableVehicleData)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editableVehicleData) return
    const { name, value } = e.target
    setEditableVehicleData({ ...editableVehicleData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    if (!editableVehicleData) return
    setEditableVehicleData({ ...editableVehicleData, [name]: value as Vehicle["status"] })
  }

  const handlePurchaseInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!editableVehicleData) return
    const { name, value } = e.target
    setEditableVehicleData({
      ...editableVehicleData,
      purchaseInfo: {
        ...editableVehicleData.purchaseInfo,
        [name]: value,
      },
    })
  }

  const handlePurchaseSelectChange = (name: string, value: string) => {
    if (!editableVehicleData) return
    setEditableVehicleData({
      ...editableVehicleData,
      purchaseInfo: {
        ...editableVehicleData.purchaseInfo,
        [name]: value as Vehicle["purchaseInfo"]["financing"],
      },
    })
  }

  const handleDateChange = (name: keyof Vehicle | keyof Vehicle["purchaseInfo"], date: Date | undefined) => {
    if (!editableVehicleData || !date) return
    const formattedDate = format(date, "yyyy-MM-dd")

    if (name in editableVehicleData.purchaseInfo) {
      setEditableVehicleData({
        ...editableVehicleData,
        purchaseInfo: {
          ...editableVehicleData.purchaseInfo,
          [name as keyof Vehicle["purchaseInfo"]]: formattedDate,
        },
      })
    } else {
      setEditableVehicleData({ ...editableVehicleData, [name as keyof Vehicle]: formattedDate })
    }
  }

  // Calculate KPIs
  const totalVehicles = vehicles.length
  const activeVehicles = vehicles.filter((v) => v.status === "active").length
  const totalTrips = vehicles.reduce((sum, vehicle) => sum + vehicle.trips, 0)
  const totalEarnings = vehicles.reduce((sum, vehicle) => sum + Number(vehicle.earnings.replace(/[^0-9.-]+/g, "")), 0)
  const averageRating = (vehicles.reduce((sum, vehicle) => sum + vehicle.rating, 0) / (vehicles.length || 1)).toFixed(1)
  const currentVehicleForModal = isEditingVehicle ? editableVehicleData : getSelectedVehicle()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vehicles</h2>
          <p className="text-muted-foreground">Manage your fleet of vehicles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Sheet open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
            <SheetTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Add New Vehicle</SheetTitle>
                <SheetDescription>Add a new vehicle to your fleet</SheetDescription>
              </SheetHeader>

              <Tabs defaultValue="basic" className="mt-4">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="purchase">Purchase</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                {/* Basic Vehicle Information */}
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="make">Make</Label>
                      <Input id="make" placeholder="Tesla" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="model">Model</Label>
                      <Input id="model" placeholder="Model 3" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="year">Year</Label>
                      <Input id="year" placeholder="2023" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="license">License Plate</Label>
                      <Input id="license" placeholder="ABC123" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="vin">VIN</Label>
                    <Input id="vin" placeholder="1HGBH41JXMN109186" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">In Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input id="mileage" placeholder="12,500" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="San Francisco, CA" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Additional information about the vehicle" />
                  </div>
                </TabsContent>

                {/* Purchase Information */}
                <TabsContent value="purchase" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="purchase-date">Purchase Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>Select date</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="purchase-price">Purchase Price</Label>
                      <Input id="purchase-price" placeholder="$35,000" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="seller">Seller Information</Label>
                    <Input id="seller" placeholder="Dealership or private seller name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="seller-contact">Seller Contact</Label>
                    <Input id="seller-contact" placeholder="Phone or email" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="financing">Financing Type</Label>
                      <Select>
                        <SelectTrigger id="financing">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="loan">Loan</SelectItem>
                          <SelectItem value="lease">Lease</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="monthly-payment">Monthly Payment</Label>
                      <Input id="monthly-payment" placeholder="$450" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="financing-notes">Financing Notes</Label>
                    <Textarea id="financing-notes" placeholder="Additional financing details" />
                  </div>
                </TabsContent>

                {/* Maintenance Specifications */}
                <TabsContent value="maintenance" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="oil-type">Oil Type</Label>
                      <Input id="oil-type" placeholder="e.g. 5W-30 Synthetic" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="oil-capacity">Oil Capacity</Label>
                      <Input id="oil-capacity" placeholder="e.g. 5.5 quarts" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tire-size-front">Front Tire Size</Label>
                      <Input id="tire-size-front" placeholder="e.g. 235/45R18" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tire-size-rear">Rear Tire Size</Label>
                      <Input id="tire-size-rear" placeholder="e.g. 235/45R18" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="tire-pressure-front">Front Tire Pressure</Label>
                      <Input id="tire-pressure-front" placeholder="e.g. 35 PSI" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tire-pressure-rear">Rear Tire Pressure</Label>
                      <Input id="tire-pressure-rear" placeholder="e.g. 35 PSI" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="battery-type">Battery Type</Label>
                      <Input id="battery-type" placeholder="e.g. Group 24F" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="air-filter">Air Filter</Label>
                      <Input id="air-filter" placeholder="e.g. CA10755" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maintenance-intervals">Maintenance Intervals</Label>
                    <Textarea
                      id="maintenance-intervals"
                      placeholder="Oil change: 5,000 miles&#10;Tire rotation: 7,500 miles&#10;Brake inspection: 15,000 miles"
                    />
                  </div>
                </TabsContent>

                {/* Documents */}
                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="purchase-agreement">Purchase Agreement</Label>
                    <div className="flex gap-2">
                      <Input id="purchase-agreement" type="file" className="flex-1" />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="registration">Registration</Label>
                    <div className="flex gap-2">
                      <Input id="registration" type="file" className="flex-1" />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="insurance">Insurance</Label>
                    <div className="flex gap-2">
                      <Input id="insurance" type="file" className="flex-1" />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="warranty">Warranty Information</Label>
                    <div className="flex gap-2">
                      <Input id="warranty" type="file" className="flex-1" />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maintenance-records">Maintenance Records</Label>
                    <div className="flex gap-2">
                      <Input id="maintenance-records" type="file" className="flex-1" />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="document-notes">Document Notes</Label>
                    <Textarea id="document-notes" placeholder="Additional notes about vehicle documents" />
                  </div>
                </TabsContent>
              </Tabs>

              <SheetFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddVehicleOpen(false)}>Save Vehicle</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              {activeVehicles} active ({Math.round((activeVehicles / totalVehicles) * 100)}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrips}</div>
            <p className="text-xs text-muted-foreground">{(totalTrips / totalVehicles).toFixed(1)} trips per vehicle</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${(totalEarnings / totalVehicles).toLocaleString()} per vehicle
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating}/5.0</div>
            <p className="text-xs text-muted-foreground">Based on guest reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Due in the next 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 md:max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search vehicles..." className="pl-8" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {isFiltersOpen ? (
                  <ChevronDown className="h-4 w-4 ml-2 transform rotate-180 transition-transform" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2 transition-transform" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-6" align="end">
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Filter Vehicles</h3>

                <div>
                  <h4 className="text-sm font-medium mb-2">Listed Date Range</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="start-date-filter">From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            id="start-date-filter"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filterStartDate ? format(filterStartDate, "MMM dd, yyyy") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={filterStartDate} onSelect={setFilterStartDate} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="end-date-filter">To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            id="end-date-filter"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filterEndDate ? format(filterEndDate, "MMM dd, yyyy") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filterEndDate}
                            onSelect={setFilterEndDate}
                            disabled={(date) => (filterStartDate ? date < filterStartDate : false)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select>
                    <SelectTrigger id="status-filter">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">In Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location-filter">Location</Label>
                  <Select>
                    <SelectTrigger id="location-filter">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
                      <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
                      <SelectItem value="seattle">Seattle, WA</SelectItem>
                      <SelectItem value="portland">Portland, OR</SelectItem>
                      <SelectItem value="san-diego">San Diego, CA</SelectItem>
                      <SelectItem value="austin">Austin, TX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="make-filter">Make</Label>
                  <Select>
                    <SelectTrigger id="make-filter">
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Makes</SelectItem>
                      <SelectItem value="tesla">Tesla</SelectItem>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="audi">Audi</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                      <SelectItem value="honda">Honda</SelectItem>
                      <SelectItem value="ford">Ford</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="year-filter">Year</Label>
                  <Select>
                    <SelectTrigger id="year-filter">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maintenance-filter">Maintenance Status</Label>
                  <Select>
                    <SelectTrigger id="maintenance-filter">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="due-soon">Due Soon (30 days)</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="up-to-date">Up to Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setIsFiltersOpen(false)}>
                    Clear Filters
                  </Button>
                  <Button onClick={() => setIsFiltersOpen(false)}>Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <div className="border rounded-md p-1">
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("card")}
              className="h-8 w-8 p-0"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Card View</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List View</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Vehicles</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="maintenance">In Maintenance</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        {/* All Vehicles Tab Content */}
        <TabsContent value="all" className="space-y-4">
          {viewMode === "card" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <Card
                  key={vehicle.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedVehicleId(vehicle.id)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">
                      {vehicle.make} {vehicle.model}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedVehicleId(vehicle.id)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedVehicleId(vehicle.id)
                            handleEditClick()
                          }}
                        >
                          Edit Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuItem>Maintenance History</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete Vehicle</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                        <Image
                          src={vehicle.image || "/placeholder.svg"}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          {vehicle.year} • {vehicle.license}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          {vehicle.status === "active" && (
                            <Badge
                              variant="outline"
                              className="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                            >
                              Active
                            </Badge>
                          )}
                          {vehicle.status === "maintenance" && (
                            <Badge
                              variant="outline"
                              className="bg-secondary/10 text-secondary hover:bg-secondary/10 hover:text-secondary"
                            >
                              In Maintenance
                            </Badge>
                          )}
                          {vehicle.status === "inactive" && (
                            <Badge
                              variant="outline"
                              className="bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                            >
                              Inactive
                            </Badge>
                          )}
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Gauge className="h-3 w-3 mr-1" />
                            {vehicle.mileage.toLocaleString()} mi
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <div className="flex items-center">
                            <Route className="h-3 w-3 mr-1 text-primary" />
                            <span>{vehicle.trips} trips</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                            <span>{vehicle.earnings}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mileage</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Listed Date</TableHead>
                      <TableHead>Trips</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow
                        key={vehicle.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedVehicleId(vehicle.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                              <Image
                                src={vehicle.image || "/placeholder.svg"}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="h-full w-full object-cover"
                                width={40}
                                height={40}
                              />
                            </div>
                            <div>
                              <p className="font-medium">
                                {vehicle.make} {vehicle.model}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {vehicle.year} • {vehicle.license}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {vehicle.status === "active" && (
                            <Badge
                              variant="outline"
                              className="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                            >
                              Active
                            </Badge>
                          )}
                          {vehicle.status === "maintenance" && (
                            <Badge
                              variant="outline"
                              className="bg-secondary/10 text-secondary hover:bg-secondary/10 hover:text-secondary"
                            >
                              In Maintenance
                            </Badge>
                          )}
                          {vehicle.status === "inactive" && (
                            <Badge
                              variant="outline"
                              className="bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                            >
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{vehicle.mileage.toLocaleString()} mi</TableCell>
                        <TableCell>{vehicle.location}</TableCell>
                        <TableCell>{vehicle.listedDate}</TableCell>
                        <TableCell>{vehicle.trips}</TableCell>
                        <TableCell>{vehicle.earnings}</TableCell>
                        <TableCell>{vehicle.rating}/5.0</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedVehicleId(vehicle.id)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVehicleId(vehicle.id)
                                  handleEditClick()
                                }}
                              >
                                Edit Vehicle
                              </DropdownMenuItem>
                              <DropdownMenuItem>Maintenance History</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Delete Vehicle</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {viewMode === "card" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicles
                .filter((vehicle) => vehicle.status === "active")
                .map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-md font-medium">
                        {vehicle.make} {vehicle.model}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedVehicleId(vehicle.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedVehicleId(vehicle.id)
                              handleEditClick()
                            }}
                          >
                            Edit Vehicle
                          </DropdownMenuItem>
                          <DropdownMenuItem>Maintenance History</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete Vehicle</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                          <Image
                            src={vehicle.image || "/placeholder.svg"}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {vehicle.year} • {vehicle.license}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                            >
                              Active
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Gauge className="h-3 w-3 mr-1" />
                              {vehicle.mileage.toLocaleString()} mi
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <div className="flex items-center">
                              <Route className="h-3 w-3 mr-1 text-primary" />
                              <span>{vehicle.trips} trips</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                              <span>{vehicle.earnings}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mileage</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Listed Date</TableHead>
                      <TableHead>Trips</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles
                      .filter((vehicle) => vehicle.status === "active")
                      .map((vehicle) => (
                        <TableRow
                          key={vehicle.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedVehicleId(vehicle.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                                <Image
                                  src={vehicle.image || "/placeholder.svg"}
                                  alt={`${vehicle.make} ${vehicle.model}`}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {vehicle.make} {vehicle.model}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {vehicle.year} • {vehicle.license}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
                            >
                              Active
                            </Badge>
                          </TableCell>
                          <TableCell>{vehicle.mileage.toLocaleString()} mi</TableCell>
                          <TableCell>{vehicle.location}</TableCell>
                          <TableCell>{vehicle.listedDate}</TableCell>
                          <TableCell>{vehicle.trips}</TableCell>
                          <TableCell>{vehicle.earnings}</TableCell>
                          <TableCell>{vehicle.rating}/5.0</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedVehicleId(vehicle.id)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedVehicleId(vehicle.id)
                                    handleEditClick()
                                  }}
                                >
                                  Edit Vehicle
                                </DropdownMenuItem>
                                <DropdownMenuItem>Maintenance History</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete Vehicle</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          {viewMode === "card" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicles
                .filter((vehicle) => vehicle.status === "maintenance")
                .map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-md font-medium">
                        {vehicle.make} {vehicle.model}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedVehicleId(vehicle.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedVehicleId(vehicle.id)
                              handleEditClick()
                            }}
                          >
                            Edit Vehicle
                          </DropdownMenuItem>
                          <DropdownMenuItem>Maintenance History</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete Vehicle</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                          <Image
                            src={vehicle.image || "/placeholder.svg"}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {vehicle.year} • {vehicle.license}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-secondary/10 text-secondary hover:bg-secondary/10 hover:text-secondary"
                            >
                              In Maintenance
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Gauge className="h-3 w-3 mr-1" />
                              {vehicle.mileage.toLocaleString()} mi
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <div className="flex items-center">
                              <Route className="h-3 w-3 mr-1 text-primary" />
                              <span>{vehicle.trips} trips</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                              <span>{vehicle.earnings}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mileage</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Listed Date</TableHead>
                      <TableHead>Trips</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles
                      .filter((vehicle) => vehicle.status === "maintenance")
                      .map((vehicle) => (
                        <TableRow
                          key={vehicle.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedVehicleId(vehicle.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                                <Image
                                  src={vehicle.image || "/placeholder.svg"}
                                  alt={`${vehicle.make} ${vehicle.model}`}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {vehicle.make} {vehicle.model}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {vehicle.year} • {vehicle.license}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-secondary/10 text-secondary hover:bg-secondary/10 hover:text-secondary"
                            >
                              In Maintenance
                            </Badge>
                          </TableCell>
                          <TableCell>{vehicle.mileage.toLocaleString()} mi</TableCell>
                          <TableCell>{vehicle.location}</TableCell>
                          <TableCell>{vehicle.listedDate}</TableCell>
                          <TableCell>{vehicle.trips}</TableCell>
                          <TableCell>{vehicle.earnings}</TableCell>
                          <TableCell>{vehicle.rating}/5.0</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedVehicleId(vehicle.id)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedVehicleId(vehicle.id)
                                    handleEditClick()
                                  }}
                                >
                                  Edit Vehicle
                                </DropdownMenuItem>
                                <DropdownMenuItem>Maintenance History</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete Vehicle</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {viewMode === "card" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vehicles
                .filter((vehicle) => vehicle.status === "inactive")
                .map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-md font-medium">
                        {vehicle.make} {vehicle.model}
                      </CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedVehicleId(vehicle.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedVehicleId(vehicle.id)
                              handleEditClick()
                            }}
                          >
                            Edit Vehicle
                          </DropdownMenuItem>
                          <DropdownMenuItem>Maintenance History</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Delete Vehicle</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                          <Image
                            src={vehicle.image || "/placeholder.svg"}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {vehicle.year} • {vehicle.license}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                            >
                              Inactive
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Gauge className="h-3 w-3 mr-1" />
                              {vehicle.mileage.toLocaleString()} mi
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs">
                            <div className="flex items-center">
                              <Route className="h-3 w-3 mr-1 text-primary" />
                              <span>{vehicle.trips} trips</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-3 w-3 mr-1 text-green-500" />
                              <span>{vehicle.earnings}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mileage</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Listed Date</TableHead>
                      <TableHead>Trips</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles
                      .filter((vehicle) => vehicle.status === "inactive")
                      .map((vehicle) => (
                        <TableRow
                          key={vehicle.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedVehicleId(vehicle.id)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                                <Image
                                  src={vehicle.image || "/placeholder.svg"}
                                  alt={`${vehicle.make} ${vehicle.model}`}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {vehicle.make} {vehicle.model}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {vehicle.year} • {vehicle.license}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground"
                            >
                              Inactive
                            </Badge>
                          </TableCell>
                          <TableCell>{vehicle.mileage.toLocaleString()} mi</TableCell>
                          <TableCell>{vehicle.location}</TableCell>
                          <TableCell>{vehicle.listedDate}</TableCell>
                          <TableCell>{vehicle.trips}</TableCell>
                          <TableCell>{vehicle.earnings}</TableCell>
                          <TableCell>{vehicle.rating}/5.0</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedVehicleId(vehicle.id)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedVehicleId(vehicle.id)
                                    handleEditClick()
                                  }}
                                >
                                  Edit Vehicle
                                </DropdownMenuItem>
                                <DropdownMenuItem>Maintenance History</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete Vehicle</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Vehicle Detail Modal */}
      {selectedVehicleId && currentVehicleForModal && (
        <Dialog
          open={selectedVehicleId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedVehicleId(null)
              setIsEditingVehicle(false)
            }
          }}
        >
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                    <Image
                      src={currentVehicleForModal.image || "/placeholder.svg"}
                      alt={`${currentVehicleForModal.make} ${currentVehicleForModal.model}`}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">
                      {currentVehicleForModal.make} {currentVehicleForModal.model}
                    </DialogTitle>
                    <DialogDescription>
                      {currentVehicleForModal.year} • {currentVehicleForModal.license} •{" "}
                      {currentVehicleForModal.mileage.toLocaleString()} miles
                    </DialogDescription>
                  </div>
                </div>
                {!isEditingVehicle && (
                  <Button variant="outline" size="sm" onClick={handleEditClick}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                )}
              </div>
            </DialogHeader>

            <Tabs defaultValue="details" className="mt-6">
              <TabsList className="grid grid-cols-7 w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="purchase">Purchase</TabsTrigger>
                <TabsTrigger value="finances">Finances</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="inspections">Inspections</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Vehicle Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="make">Make</Label>
                        {isEditingVehicle ? (
                          <Input
                            id="make"
                            name="make"
                            value={editableVehicleData?.make || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>{currentVehicleForModal.make}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="model">Model</Label>
                        {isEditingVehicle ? (
                          <Input
                            id="model"
                            name="model"
                            value={editableVehicleData?.model || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>{currentVehicleForModal.model}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="year">Year</Label>
                        {isEditingVehicle ? (
                          <Input
                            id="year"
                            name="year"
                            value={editableVehicleData?.year || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>{currentVehicleForModal.year}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="license">License Plate</Label>
                        {isEditingVehicle ? (
                          <Input
                            id="license"
                            name="license"
                            value={editableVehicleData?.license || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>{currentVehicleForModal.license}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="vin">VIN</Label>
                        {isEditingVehicle ? (
                          <Input
                            id="vin"
                            name="vin"
                            value={editableVehicleData?.vin || ""}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p className="font-mono text-sm">{currentVehicleForModal.vin}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="mileage">Mileage</Label>
                        {isEditingVehicle ? (
                          <Input
                            id="mileage"
                            name="mileage"
                            type="number"
                            value={editableVehicleData?.mileage || 0}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <p>{currentVehicleForModal.mileage.toLocaleString()} mi</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        {isEditingVehicle ? (
                          <Select
                            name="status"
                            value={editableVehicleData?.status}
                            onValueChange={(value) => handleSelectChange("status", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="maintenance">In Maintenance</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge
                            variant={
                              currentVehicleForModal.status === "active"
                                ? "default"
                                : currentVehicleForModal.status === "maintenance"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              currentVehicleForModal.status === "active"
                                ? "bg-primary/10 text-primary"
                                : currentVehicleForModal.status === "maintenance"
                                  ? "bg-amber-500/10 text-amber-600"
                                  : "bg-slate-500/10 text-slate-600"
                            }
                          >
                            {currentVehicleForModal.status.charAt(0).toUpperCase() +
                              currentVehicleForModal.status.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      {isEditingVehicle ? (
                        <Input
                          id="location"
                          name="location"
                          value={editableVehicleData?.location || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p>{currentVehicleForModal.location}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      {isEditingVehicle ? (
                        <Textarea
                          id="notes"
                          name="notes"
                          value={editableVehicleData?.notes || ""}
                          onChange={handleInputChange}
                          placeholder="Add notes about this vehicle..."
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {currentVehicleForModal.notes || "No notes available."}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    {/* Performance, Upcoming Maintenance, Recent Trips (non-editable here) */}
                    <div>
                      <h3 className="text-lg font-medium">Performance</h3>
                      {/* ... performance details ... */}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Upcoming Maintenance</h3>
                      {/* ... upcoming maintenance details ... */}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Recent Trips</h3>
                      {/* ... recent trips details ... */}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Purchase Tab */}
              <TabsContent value="purchase" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Purchase Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="purchaseInfo.date">Purchase Date</Label>
                        {isEditingVehicle ? (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {editableVehicleData?.purchaseInfo.date ? (
                                  format(parseISO(editableVehicleData.purchaseInfo.date), "MMM dd, yyyy")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={
                                  editableVehicleData?.purchaseInfo.date
                                    ? parseISO(editableVehicleData.purchaseInfo.date)
                                    : undefined
                                }
                                onSelect={(date) => handleDateChange("date", date)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <p>
                            {currentVehicleForModal.purchaseInfo.date
                              ? format(parseISO(currentVehicleForModal.purchaseInfo.date), "MMM dd, yyyy")
                              : "N/A"}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="purchaseInfo.price">Purchase Price</Label>
                        {isEditingVehicle ? (
                          <Input
                            name="price"
                            value={editableVehicleData?.purchaseInfo.price || ""}
                            onChange={handlePurchaseInfoChange}
                            placeholder="$35,000"
                          />
                        ) : (
                          <p>{currentVehicleForModal.purchaseInfo.price}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="purchaseInfo.seller">Seller</Label>
                        {isEditingVehicle ? (
                          <Input
                            name="seller"
                            value={editableVehicleData?.purchaseInfo.seller || ""}
                            onChange={handlePurchaseInfoChange}
                            placeholder="Dealership Name"
                          />
                        ) : (
                          <p>{currentVehicleForModal.purchaseInfo.seller}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="purchaseInfo.financing">Financing Type</Label>
                        {isEditingVehicle ? (
                          <Select
                            name="financing"
                            value={editableVehicleData?.purchaseInfo.financing}
                            onValueChange={(value) => handlePurchaseSelectChange("financing", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cash">Cash</SelectItem>
                              <SelectItem value="Loan">Loan</SelectItem>
                              <SelectItem value="Lease">Lease</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p>{currentVehicleForModal.purchaseInfo.financing}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="purchaseInfo.payment">Monthly Payment</Label>
                        {isEditingVehicle ? (
                          <Input
                            name="payment"
                            value={editableVehicleData?.purchaseInfo.payment || ""}
                            onChange={handlePurchaseInfoChange}
                            placeholder="$450/mo"
                          />
                        ) : (
                          <p>{currentVehicleForModal.purchaseInfo.payment}</p>
                        )}
                      </div>
                    </div>
                    {!isEditingVehicle && (
                      <div className="pt-4">
                        <h4 className="text-md font-medium mb-2">Documents</h4>
                        <div className="flex items-center gap-4">
                          <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" /> Purchase Agreement
                          </Button>
                          <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" /> Title
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Finances Tab */}
              <TabsContent value="finances" className="mt-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        ${currentVehicleForModal?.financials.lifetimeEarnings.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Lifetime Expenses</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        ${currentVehicleForModal?.financials.lifetimeExpenses.toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        $
                        {(
                          currentVehicleForModal?.financials.lifetimeEarnings -
                          currentVehicleForModal?.financials.lifetimeExpenses
                        ).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={currentVehicleForModal?.financials.monthlyPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                          }}
                        />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentVehicleForModal?.financials.recentTransactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>{tx.date}</TableCell>
                            <TableCell>{tx.description}</TableCell>
                            <TableCell
                              className={`text-right font-medium ${tx.type === "revenue" ? "text-green-600" : "text-red-600"}`}
                            >
                              {tx.type === "expense" && "-"}$
                              {Math.abs(tx.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Maintenance Tab */}
              <TabsContent value="maintenance" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Maintenance Dashboard</h3>
                    <div className="flex items-center gap-2">
                      <Select value={maintenanceFilterType} onValueChange={setMaintenanceFilterType}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="oil">Oil Change</SelectItem>
                          <SelectItem value="battery">Battery</SelectItem>
                          <SelectItem value="brakes">Brakes</SelectItem>
                          <SelectItem value="tires">Tires</SelectItem>
                          <SelectItem value="inspection">Inspection</SelectItem>
                        </SelectContent>
                      </Select>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                            <CalendarRange className="mr-2 h-4 w-4" />
                            {maintenanceFilterStartDate && maintenanceFilterEndDate ? (
                              <>
                                {format(maintenanceFilterStartDate, "MMM dd, yyyy")} -{" "}
                                {format(maintenanceFilterEndDate, "MMM dd, yyyy")}
                              </>
                            ) : (
                              <span>Filter by date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="flex">
                            <div className="border-r p-2">
                              <div className="text-sm font-medium mb-1">Start Date</div>
                              <Calendar
                                mode="single"
                                selected={maintenanceFilterStartDate}
                                onSelect={setMaintenanceFilterStartDate}
                              />
                            </div>
                            <div className="p-2">
                              <div className="text-sm font-medium mb-1">End Date</div>
                              <Calendar
                                mode="single"
                                selected={maintenanceFilterEndDate}
                                onSelect={setMaintenanceFilterEndDate}
                                disabled={(date) =>
                                  maintenanceFilterStartDate ? date < maintenanceFilterStartDate : false
                                }
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Current Mileage</p>
                        <p className="text-xl font-bold">{currentVehicleForModal?.mileage.toLocaleString()} miles</p>
                      </div>
                    </div>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Update Mileage
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Oil Change */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium flex items-center">
                            <Wrench className="h-4 w-4 mr-2 text-primary" />
                            Oil Change
                          </CardTitle>
                          {currentVehicleForModal?.maintenance.oil.milesLeft < 1000 ? (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive">
                              Due Soon
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              OK
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Last Service</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.oil.last}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Next Due</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.oil.next}</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-muted-foreground">Miles Remaining</p>
                              <p className="text-xs font-medium">
                                {currentVehicleForModal?.maintenance.oil.milesLeft.toLocaleString()} mi
                              </p>
                            </div>
                            <Progress
                              value={Math.min(100, (currentVehicleForModal?.maintenance.oil.milesLeft / 5000) * 100)}
                              className="h-2"
                              indicatorClassName={
                                currentVehicleForModal?.maintenance.oil.milesLeft < 1000 ? "bg-destructive" : ""
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Battery */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium flex items-center">
                            <Battery className="h-4 w-4 mr-2 text-primary" />
                            Battery
                          </CardTitle>
                          {currentVehicleForModal?.maintenance.battery.milesLeft < 1000 ? (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive">
                              Due Soon
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              OK
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Last Service</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.battery.last}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Next Due</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.battery.next}</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-muted-foreground">Miles Remaining</p>
                              <p className="text-xs font-medium">
                                {currentVehicleForModal?.maintenance.battery.milesLeft.toLocaleString()} mi
                              </p>
                            </div>
                            <Progress
                              value={Math.min(
                                100,
                                (currentVehicleForModal?.maintenance.battery.milesLeft / 40000) * 100,
                              )}
                              className="h-2"
                              indicatorClassName={
                                currentVehicleForModal?.maintenance.battery.milesLeft < 1000 ? "bg-destructive" : ""
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Front Brakes */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium flex items-center">
                            <Disc className="h-4 w-4 mr-2 text-primary" />
                            Front Brakes
                          </CardTitle>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            OK
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Last Service</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.frontBrakes.last}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Next Due</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.frontBrakes.next}</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-muted-foreground">Miles Remaining</p>
                              <p className="text-xs font-medium">
                                {currentVehicleForModal?.maintenance.frontBrakes.milesLeft.toLocaleString()} mi
                              </p>
                            </div>
                            <Progress
                              value={Math.min(
                                100,
                                (currentVehicleForModal?.maintenance.frontBrakes.milesLeft / 30000) * 100,
                              )}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Rear Brakes */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium flex items-center">
                            <Disc className="h-4 w-4 mr-2 text-primary" />
                            Rear Brakes
                          </CardTitle>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            OK
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Last Service</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.rearBrakes.last}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Next Due</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.rearBrakes.next}</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-muted-foreground">Miles Remaining</p>
                              <p className="text-xs font-medium">
                                {currentVehicleForModal?.maintenance.rearBrakes.milesLeft.toLocaleString()} mi
                              </p>
                            </div>
                            <Progress
                              value={Math.min(
                                100,
                                (currentVehicleForModal?.maintenance.rearBrakes.milesLeft / 30000) * 100,
                              )}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Front Tires */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium flex items-center">
                            <CircleDot className="h-4 w-4 mr-2 text-primary" />
                            Front Tires
                          </CardTitle>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            OK
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Last Service</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.frontTires.last}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Next Due</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.frontTires.next}</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-muted-foreground">Miles Remaining</p>
                              <p className="text-xs font-medium">
                                {currentVehicleForModal?.maintenance.frontTires.milesLeft.toLocaleString()} mi
                              </p>
                            </div>
                            <Progress
                              value={Math.min(
                                100,
                                (currentVehicleForModal?.maintenance.frontTires.milesLeft / 30000) * 100,
                              )}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Rear Tires */}
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium flex items-center">
                            <CircleDot className="h-4 w-4 mr-2 text-primary" />
                            Rear Tires
                          </CardTitle>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            OK
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Last Service</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.rearTires.last}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Next Due</p>
                              <p className="font-medium">{currentVehicleForModal?.maintenance.rearTires.next}</p>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs text-muted-foreground">Miles Remaining</p>
                              <p className="text-xs font-medium">
                                {currentVehicleForModal?.maintenance.rearTires.milesLeft.toLocaleString()} mi
                              </p>
                            </div>
                            <Progress
                              value={Math.min(
                                100,
                                (currentVehicleForModal?.maintenance.rearTires.milesLeft / 30000) * 100,
                              )}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Maintenance History</h3>
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Mileage</TableHead>
                              <TableHead>Provider</TableHead>
                              <TableHead>Cost</TableHead>
                              <TableHead>Notes</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Mar 15, 2023</TableCell>
                              <TableCell>Oil Change</TableCell>
                              <TableCell>10,500 mi</TableCell>
                              <TableCell>AutoCare Center</TableCell>
                              <TableCell>$85.00</TableCell>
                              <TableCell>Synthetic oil, filter replaced</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Feb 20, 2023</TableCell>
                              <TableCell>Tire Rotation</TableCell>
                              <TableCell>9,800 mi</TableCell>
                              <TableCell>Tire World</TableCell>
                              <TableCell>$45.00</TableCell>
                              <TableCell>All tires rotated and balanced</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Jan 5, 2023</TableCell>
                              <TableCell>Battery Check</TableCell>
                              <TableCell>8,200 mi</TableCell>
                              <TableCell>AutoCare Center</TableCell>
                              <TableCell>$25.00</TableCell>
                              <TableCell>Battery tested, connections cleaned</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Inspections Tab */}
              <TabsContent value="inspections" className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Inspection History</h3>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Inspection
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentVehicleForModal?.inspections.map((inspection, index) => (
                          <TableRow key={index}>
                            <TableCell>{inspection.date}</TableCell>
                            <TableCell>{inspection.type}</TableCell>
                            <TableCell>
                              <Badge variant={inspection.result === "Passed" ? "default" : "destructive"}>
                                {inspection.result === "Passed" ? (
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                ) : (
                                  <XCircle className="mr-1 h-3 w-3" />
                                )}
                                {inspection.result}
                              </Badge>
                            </TableCell>
                            <TableCell>{inspection.notes}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Vehicle Tasks</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Task
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Upcoming Tasks</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 rounded-md border p-3">
                          <Checkbox id="task-1" />
                          <div className="flex-1">
                            <label
                              htmlFor="task-1"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Schedule oil change
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">Due in 3 days</p>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            High
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-3">
                          <Checkbox id="task-2" />
                          <div className="flex-1">
                            <label
                              htmlFor="task-2"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Update insurance documents
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">Due in 5 days</p>
                          </div>
                          <Badge variant="outline" className="bg-secondary/10 text-secondary">
                            Medium
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-3">
                          <Checkbox id="task-3" />
                          <div className="flex-1">
                            <label
                              htmlFor="task-3"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Clean interior and exterior
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">Due in 7 days</p>
                          </div>
                          <Badge variant="outline" className="bg-slate-100 text-slate-500">
                            Low
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Completed Tasks</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 rounded-md border p-3 bg-muted/20">
                          <Checkbox id="task-4" checked />
                          <div className="flex-1">
                            <label
                              htmlFor="task-4"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 line-through"
                            >
                              Tire pressure check
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">Completed on Apr 5, 2025</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-3 bg-muted/20">
                          <Checkbox id="task-5" checked />
                          <div className="flex-1">
                            <label
                              htmlFor="task-5"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 line-through"
                            >
                              Update registration
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">Completed on Mar 20, 2025</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Timeline Tab */}
              <TabsContent value="timeline" className="mt-6">
                <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-muted-foreground/20 after:left-0">
                  {currentVehicleForModal?.timeline.map((item, index) => (
                    <div key={index} className="relative grid grid-cols-[auto_1fr] items-start gap-x-4 pb-8">
                      <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="pt-1">
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            {isEditingVehicle && (
              <DialogFooter className="mt-6 pt-4 border-t">
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
