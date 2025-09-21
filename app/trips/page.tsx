"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { format } from "date-fns"
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  MapPin,
  Calendar,
  Clock,
  Route,
  DollarSign,
  TrendingUp,
  CalendarClock,
  PlayCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

// Mock data for trips
const trips = [
  {
    id: "T001",
    reservationId: "R2024001",
    guest: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1 (555) 123-4567",
      avatar: "/contemplative-artist.png",
    },
    vehicle: {
      id: "V001",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      plate: "ABC123",
      image: "/toyota-urban-landscape.png",
    },
    location: {
      pickup: "Downtown Airport",
      dropoff: "Downtown Airport",
      address: "123 Airport Blvd, City, State",
    },
    dates: {
      start: "2024-03-15T10:00:00",
      end: "2024-03-20T10:00:00",
      duration: 5,
    },
    status: "active",
    earnings: 750.0,
    mileage: {
      start: 45230,
      end: 45680,
      total: 450,
    },
    notes: "Guest requested early pickup",
  },
  {
    id: "T002",
    reservationId: "R2024002",
    guest: {
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 234-5678",
      avatar: "/diverse-group-city.png",
    },
    vehicle: {
      id: "V002",
      make: "Honda",
      model: "Accord",
      year: 2022,
      plate: "XYZ789",
      image: "/classic-red-honda.png",
    },
    location: {
      pickup: "City Center",
      dropoff: "City Center",
      address: "456 Main St, City, State",
    },
    dates: {
      start: "2024-03-10T14:00:00",
      end: "2024-03-14T14:00:00",
      duration: 4,
    },
    status: "completed",
    earnings: 600.0,
    mileage: {
      start: 32100,
      end: 32420,
      total: 320,
    },
    notes: "Smooth trip, no issues",
  },
  {
    id: "T003",
    reservationId: "R2024003",
    guest: {
      name: "Michael Brown",
      email: "michael.b@email.com",
      phone: "+1 (555) 345-6789",
      avatar: "/contemplative-man.png",
    },
    vehicle: {
      id: "V003",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
      plate: "EV2023",
      image: "/electric-vehicle-cityscape.png",
    },
    location: {
      pickup: "Westside Mall",
      dropoff: "Westside Mall",
      address: "789 Mall Dr, City, State",
    },
    dates: {
      start: "2024-03-25T09:00:00",
      end: "2024-03-30T09:00:00",
      duration: 5,
    },
    status: "upcoming",
    earnings: 900.0,
    mileage: {
      start: 15600,
      end: null,
      total: null,
    },
    notes: "First-time Tesla renter",
  },
  {
    id: "T004",
    reservationId: "R2024004",
    guest: {
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "+1 (555) 456-7890",
      avatar: "",
    },
    vehicle: {
      id: "V001",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      plate: "ABC123",
      image: "/toyota-urban-landscape.png",
    },
    location: {
      pickup: "University District",
      dropoff: "University District",
      address: "321 College Ave, City, State",
    },
    dates: {
      start: "2024-03-05T12:00:00",
      end: "2024-03-08T12:00:00",
      duration: 3,
    },
    status: "completed",
    earnings: 450.0,
    mileage: {
      start: 45000,
      end: 45230,
      total: 230,
    },
    notes: "Student discount applied",
  },
  {
    id: "T005",
    reservationId: "R2024005",
    guest: {
      name: "David Wilson",
      email: "david.w@email.com",
      phone: "+1 (555) 567-8901",
      avatar: "",
    },
    vehicle: {
      id: "V004",
      make: "BMW",
      model: "X3",
      year: 2023,
      plate: "BMW456",
      image: "/classic-bmw-road.png",
    },
    location: {
      pickup: "Business District",
      dropoff: "Business District",
      address: "654 Corporate Blvd, City, State",
    },
    dates: {
      start: "2024-04-01T08:00:00",
      end: "2024-04-07T08:00:00",
      duration: 6,
    },
    status: "upcoming",
    earnings: 1200.0,
    mileage: {
      start: 28900,
      end: null,
      total: null,
    },
    notes: "Corporate account booking",
  },
]

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTrip, setSelectedTrip] = useState<any>(null)

  // Calculate KPIs
  const totalTripsCount = trips.length
  const totalTripRevenue = trips.reduce((sum, trip) => sum + trip.earnings, 0)
  const averageTripDuration = trips.reduce((sum, trip) => sum + trip.dates.duration, 0) / trips.length
  const averageRevenuePerTrip = totalTripRevenue / totalTripsCount
  const upcomingTripsCount = trips.filter((trip) => trip.status === "upcoming").length
  const activeTripsCount = trips.filter((trip) => trip.status === "active").length

  // Filter trips based on active tab and search query
  const filteredTrips = trips.filter((trip) => {
    const matchesStatus = activeTab === "all" || trip.status === activeTab
    const matchesSearch =
      trip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.reservationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${trip.vehicle.make} ${trip.vehicle.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.location.pickup.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

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

  // Format date and time
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy h:mm a")
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "upcoming":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trips</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Trip
        </Button>
      </div>

      {/* KPI Summary Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Route className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total Trips</p>
                <p className="text-2xl font-bold">{totalTripsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(totalTripRevenue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Avg Duration</p>
                <p className="text-2xl font-bold">{averageTripDuration.toFixed(1)} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Avg Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(averageRevenuePerTrip)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <PlayCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Active/Upcoming</p>
                <p className="text-2xl font-bold">
                  {activeTripsCount}/{upcomingTripsCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trips..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-[400px]" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Trips</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip Details</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{trip.id}</div>
                      <div className="text-sm text-muted-foreground">{trip.reservationId}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {trip.guest.avatar ? (
                          <AvatarImage src={trip.guest.avatar || "/placeholder.svg"} alt={trip.guest.name} />
                        ) : null}
                        <AvatarFallback>{getInitials(trip.guest.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{trip.guest.name}</div>
                        <div className="text-sm text-muted-foreground">{trip.guest.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded overflow-hidden">
                        <img
                          src={trip.vehicle.image || "/placeholder.svg"}
                          alt={`${trip.vehicle.make} ${trip.vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">
                          {trip.vehicle.year} {trip.vehicle.make} {trip.vehicle.model}
                        </div>
                        <div className="text-sm text-muted-foreground">{trip.vehicle.plate}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <div className="text-sm">{trip.location.pickup}</div>
                        {trip.location.pickup !== trip.location.dropoff && (
                          <div className="text-xs text-muted-foreground">→ {trip.location.dropoff}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <div>
                        <div className="text-sm">{formatDate(trip.dates.start)}</div>
                        <div className="text-xs text-muted-foreground">
                          to {formatDate(trip.dates.end)} ({trip.dates.duration}d)
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(trip.status)}`} />
                      {trip.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(trip.earnings)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedTrip(trip)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Trip Details - {selectedTrip?.id}</SheetTitle>
                            <SheetDescription>
                              Reservation {selectedTrip?.reservationId} • {selectedTrip?.guest.name}
                            </SheetDescription>
                          </SheetHeader>

                          {selectedTrip && (
                            <div className="space-y-6 py-4">
                              {/* Trip Overview */}
                              <div className="grid grid-cols-2 gap-4">
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Trip Status</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <Badge variant="secondary" className="capitalize">
                                      <div
                                        className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(selectedTrip.status)}`}
                                      />
                                      {selectedTrip.status}
                                    </Badge>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm">Total Earnings</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(selectedTrip.earnings)}</div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Guest Information */}
                              <Card>
                                <CardHeader>
                                  <CardTitle>Guest Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                      {selectedTrip.guest.avatar ? (
                                        <AvatarImage
                                          src={selectedTrip.guest.avatar || "/placeholder.svg"}
                                          alt={selectedTrip.guest.name}
                                        />
                                      ) : null}
                                      <AvatarFallback className="text-lg">
                                        {getInitials(selectedTrip.guest.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                      <h3 className="text-lg font-semibold">{selectedTrip.guest.name}</h3>
                                      <p className="text-sm text-muted-foreground">{selectedTrip.guest.email}</p>
                                      <p className="text-sm text-muted-foreground">{selectedTrip.guest.phone}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Vehicle Information */}
                              <Card>
                                <CardHeader>
                                  <CardTitle>Vehicle Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-24 h-16 rounded overflow-hidden">
                                      <img
                                        src={selectedTrip.vehicle.image || "/placeholder.svg"}
                                        alt={`${selectedTrip.vehicle.make} ${selectedTrip.vehicle.model}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <h3 className="text-lg font-semibold">
                                        {selectedTrip.vehicle.year} {selectedTrip.vehicle.make}{" "}
                                        {selectedTrip.vehicle.model}
                                      </h3>
                                      <p className="text-sm text-muted-foreground">
                                        License Plate: {selectedTrip.vehicle.plate}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        Vehicle ID: {selectedTrip.vehicle.id}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Trip Details */}
                              <Card>
                                <CardHeader>
                                  <CardTitle>Trip Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Pickup Location</Label>
                                      <p className="text-sm">{selectedTrip.location.pickup}</p>
                                      <p className="text-xs text-muted-foreground">{selectedTrip.location.address}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Drop-off Location</Label>
                                      <p className="text-sm">{selectedTrip.location.dropoff}</p>
                                      <p className="text-xs text-muted-foreground">{selectedTrip.location.address}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Start Date & Time</Label>
                                      <p className="text-sm">{formatDateTime(selectedTrip.dates.start)}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">End Date & Time</Label>
                                      <p className="text-sm">{formatDateTime(selectedTrip.dates.end)}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Duration</Label>
                                    <p className="text-sm">{selectedTrip.dates.duration} days</p>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Mileage Information */}
                              <Card>
                                <CardHeader>
                                  <CardTitle>Mileage Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Start Mileage</Label>
                                      <p className="text-sm">{selectedTrip.mileage.start?.toLocaleString()} miles</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">End Mileage</Label>
                                      <p className="text-sm">
                                        {selectedTrip.mileage.end
                                          ? `${selectedTrip.mileage.end.toLocaleString()} miles`
                                          : "Pending"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Total Miles</Label>
                                      <p className="text-sm">
                                        {selectedTrip.mileage.total
                                          ? `${selectedTrip.mileage.total.toLocaleString()} miles`
                                          : "Pending"}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Notes */}
                              {selectedTrip.notes && (
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Notes</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm">{selectedTrip.notes}</p>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Actions */}
                              <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline">
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Trip
                                </Button>
                                <Button>View Full Details</Button>
                              </div>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
