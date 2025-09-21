"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpRight,
  Car,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Wrench,
  FileCheck,
  BarChart3,
  ChevronDown,
  CheckSquare,
  Calendar,
  TrendingUp,
  Activity,
  Eye,
  List,
  Umbrella,
  Clock3,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"

export default function Dashboard() {
  const [vehicleStates, setVehicleStates] = useState<{ [key: string]: boolean }>({})
  const [cardStates, setCardStates] = useState<{ [key: string]: boolean }>({
    tripSchedule: true,
    maintenanceAlerts: true,
    upcomingInspections: true,
    pendingTasks: true,
    turnaroundTimes: true,
  })

  const toggleVehicleVisibility = (categoryId: string) => {
    setVehicleStates((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }))
  }

  const toggleCardVisibility = (cardId: string) => {
    setCardStates((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your fleet.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="mr-2 h-4 w-4" />
            Apr 18, 2025
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Eye className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Dashboard Type Selector */}
      <Tabs defaultValue="operations" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-[400px] grid-cols-2 h-12">
            <TabsTrigger value="operations" className="text-base">
              <Activity className="mr-2 h-4 w-4" />
              Operations
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-base">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Operations Dashboard */}
        <TabsContent value="operations" className="space-y-6 mt-0">
          {/* Time Period Tabs */}
          <Tabs defaultValue="today" className="space-y-6">
            <div className="bg-muted/30 p-1 rounded-lg">
              <TabsList className="w-full grid grid-cols-6 h-9">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="this-week">This Week</TabsTrigger>
                <TabsTrigger value="next-week">Next Week</TabsTrigger>
                <TabsTrigger value="this-month">This Month</TabsTrigger>
                <TabsTrigger value="all">All Upcoming</TabsTrigger>
                <TabsTrigger value="past">All Past</TabsTrigger>
              </TabsList>
            </div>

            {/* Tab content for each time period */}
            {["today", "this-week", "next-week", "this-month", "all", "past"].map((period) => (
              <TabsContent key={period} value={period} className="space-y-6 mt-0">
                {/* Summary Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Car className="mr-2 h-4 w-4 text-primary" />
                        Active Trips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-primary font-medium">+2</span> from yesterday
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-secondary" />
                        Upcoming Trips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">Next 7 days</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                        Maintenance Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-destructive font-medium">1</span> overdue
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-muted">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                        Fleet Utilization
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">78%</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-primary font-medium">+5%</span> from last week
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Vehicle Status Overview */}
                <Card className="overflow-hidden border-t-4 border-t-primary shadow-md">
                  <CardHeader className="py-4 bg-gradient-to-r from-primary/5 to-transparent">
                    <CardTitle className="flex items-center">
                      <Car className="mr-2 h-5 w-5 text-primary" />
                      Vehicle Status Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-5 gap-4">
                      {[
                        {
                          id: "on-trip",
                          title: "On Trip",
                          count: 8,
                          icon: <Car className="h-4 w-4 text-white" />,
                          iconBg: "bg-primary",
                          vehicles: [
                            "Tesla Model 3 (ABC123)",
                            "BMW X5 (XYZ789)",
                            "Audi Q5 (DEF456)",
                            "Toyota Camry (GHI789)",
                            "Ford Mustang (MNO345)",
                            "Chevrolet Malibu (PQR678)",
                            "Nissan Altima (STU901)",
                            "Honda Civic (VWX234)",
                          ],
                        },
                        {
                          id: "available",
                          title: "Available",
                          count: 5,
                          icon: <CheckCircle className="h-4 w-4 text-white" />,
                          iconBg: "bg-green-500",
                          vehicles: [
                            "Hyundai Sonata (YZA567)",
                            "Kia Optima (BCD890)",
                            "Mazda CX-5 (EFG123)",
                            "Subaru Outback (HIJ456)",
                            "Volkswagen Passat (KLM789)",
                          ],
                        },
                        {
                          id: "maintenance",
                          title: "Maintenance",
                          count: 2,
                          icon: <Wrench className="h-4 w-4 text-white" />,
                          iconBg: "bg-secondary",
                          vehicles: ["Lexus ES (NOP012)", "Acura TLX (QRS345)"],
                        },
                        {
                          id: "reserved",
                          title: "Reserved",
                          count: 3,
                          icon: <Clock className="h-4 w-4 text-white" />,
                          iconBg: "bg-primary",
                          vehicles: ["Infiniti Q50 (TUV678)", "Cadillac CT5 (WXY901)", "Genesis G70 (ZAB234)"],
                        },
                        {
                          id: "inactive",
                          title: "Inactive",
                          count: 1,
                          icon: <AlertTriangle className="h-4 w-4 text-white" />,
                          iconBg: "bg-slate-500",
                          vehicles: ["Honda Accord (JKL012)"],
                        },
                      ].map((category) => {
                        const isOpen = vehicleStates[category.id] || false

                        return (
                          <div key={category.id} className="rounded-xl border shadow-sm overflow-hidden">
                            <div
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => toggleVehicleVisibility(category.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-8 w-8 rounded-lg ${category.iconBg} flex items-center justify-center shadow-sm`}
                                >
                                  {category.icon}
                                </div>
                                <div>
                                  <p className="font-medium">{category.title}</p>
                                  <p className="text-xs text-muted-foreground">{category.count} vehicles</p>
                                </div>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                              />
                            </div>
                            {isOpen && (
                              <div className="border-t bg-muted/20">
                                {category.vehicles.map((vehicle, i) => (
                                  <p key={i} className="text-sm p-2 border-b last:border-0 hover:bg-muted/30">
                                    {vehicle}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="overflow-hidden border-t-4 border-t-primary shadow-md">
                    <CardHeader className="py-4 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm mr-3">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle>Trip Schedule</CardTitle>
                            <CardDescription>Next 7 days</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            6 trips
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleCardVisibility("tripSchedule")}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${cardStates.tripSchedule ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {cardStates.tripSchedule && (
                      <CardContent className="p-0">
                        <Tabs defaultValue="starting" className="w-full">
                          <div className="border-b">
                            <TabsList className="w-full h-10 bg-transparent rounded-none border-b">
                              <TabsTrigger
                                value="starting"
                                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                              >
                                <div className="flex items-center">
                                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                                    <ArrowUpRight className="h-3 w-3 text-primary" />
                                  </div>
                                  Starting (3)
                                </div>
                              </TabsTrigger>
                              <TabsTrigger
                                value="ending"
                                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-secondary rounded-none"
                              >
                                <div className="flex items-center">
                                  <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center mr-2">
                                    <ArrowUpRight className="h-3 w-3 rotate-180 text-secondary" />
                                  </div>
                                  Ending (3)
                                </div>
                              </TabsTrigger>
                            </TabsList>
                          </div>

                          <TabsContent value="starting" className="mt-0">
                            <div className="space-y-0">
                              {[
                                {
                                  vehicle: "Tesla Model 3",
                                  license: "ABC123",
                                  date: "Apr 19, 2025",
                                  time: "10:30 AM",
                                  customer: "John Smith",
                                  extras: ["car-seat", "umbrella"],
                                },
                                {
                                  vehicle: "BMW X5",
                                  license: "XYZ789",
                                  date: "Apr 20, 2025",
                                  time: "2:15 PM",
                                  customer: "Sarah Johnson",
                                  extras: ["car-seat"],
                                },
                                {
                                  vehicle: "Audi Q5",
                                  license: "DEF456",
                                  date: "Apr 21, 2025",
                                  time: "9:00 AM",
                                  customer: "Michael Brown",
                                  extras: ["umbrella"],
                                },
                              ].map((trip, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/20 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                      <Car className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {trip.vehicle} ({trip.license})
                                      </p>
                                      <div className="flex items-center text-sm">
                                        <Calendar className="h-3.5 w-3.5 mr-1 text-primary" />
                                        <span className="font-semibold text-primary mr-1">{trip.date}</span> •
                                        <span className="font-semibold text-primary mx-1">{trip.time}</span> •
                                        <span className="text-muted-foreground ml-1">{trip.customer}</span>
                                        {trip.extras.includes("car-seat") && (
                                          <div
                                            className="ml-2 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center"
                                            title="Car Seat"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              className="text-blue-500"
                                            >
                                              <path d="M17 21h-10a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"></path>
                                              <path d="M12 7v.01"></path>
                                              <path d="M12 4v.01"></path>
                                              <path d="M12 13v.01"></path>
                                              <path d="M12 10v.01"></path>
                                            </svg>
                                          </div>
                                        )}
                                        {trip.extras.includes("umbrella") && (
                                          <div
                                            className="ml-1 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center"
                                            title="Umbrella"
                                          >
                                            <Umbrella className="h-3 w-3 text-amber-500" />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="ending" className="mt-0">
                            <div className="space-y-0">
                              {[
                                {
                                  vehicle: "BMW X5",
                                  license: "XYZ189",
                                  date: "Apr 23, 2025",
                                  time: "4:30 PM",
                                  customer: "Sarah Johnson",
                                  extras: ["car-seat", "umbrella"],
                                },
                                {
                                  vehicle: "BMW X5",
                                  license: "XYZ289",
                                  date: "Apr 24, 2025",
                                  time: "11:00 AM",
                                  customer: "David Wilson",
                                  extras: [],
                                },
                                {
                                  vehicle: "BMW X5",
                                  license: "XYZ389",
                                  date: "Apr 25, 2025",
                                  time: "3:45 PM",
                                  customer: "Emily Davis",
                                  extras: ["car-seat"],
                                },
                              ].map((trip, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/20 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                      <Car className="h-5 w-5 text-secondary" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {trip.vehicle} ({trip.license})
                                      </p>
                                      <div className="flex items-center text-sm">
                                        <Calendar className="h-3.5 w-3.5 mr-1 text-secondary" />
                                        <span className="font-semibold text-secondary mr-1">{trip.date}</span> •
                                        <span className="font-semibold text-secondary mx-1">{trip.time}</span> •
                                        <span className="text-muted-foreground ml-1">{trip.customer}</span>
                                        {trip.extras.includes("car-seat") && (
                                          <div
                                            className="ml-2 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center"
                                            title="Car Seat"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="14"
                                              height="14"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              className="text-blue-500"
                                            >
                                              <path d="M17 21h-10a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2z"></path>
                                              <path d="M12 7v.01"></path>
                                              <path d="M12 4v.01"></path>
                                              <path d="M12 13v.01"></path>
                                              <path d="M12 10v.01"></path>
                                            </svg>
                                          </div>
                                        )}
                                        {trip.extras.includes("umbrella") && (
                                          <div
                                            className="ml-1 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center"
                                            title="Umbrella"
                                          >
                                            <Umbrella className="h-3 w-3 text-amber-500" />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    )}
                  </Card>

                  {/* Maintenance Alerts */}
                  <Card className="overflow-hidden border-t-4 border-t-destructive shadow-md">
                    <CardHeader className="py-4 bg-gradient-to-r from-destructive/5 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-lg bg-destructive flex items-center justify-center shadow-sm mr-3">
                            <AlertTriangle className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle>Maintenance Alerts</CardTitle>
                            <CardDescription>Upcoming and overdue maintenance</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            3 alerts
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleCardVisibility("maintenanceAlerts")}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${cardStates.maintenanceAlerts ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {cardStates.maintenanceAlerts && (
                      <CardContent className="p-0">
                        <div className="space-y-0">
                          <div className="flex items-center gap-3 p-4 border-b bg-destructive/10">
                            <div className="h-10 w-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">BMW X5 (XYZ789)</p>
                                <Badge
                                  variant="outline"
                                  className="bg-destructive/10 text-destructive border-destructive/20"
                                >
                                  Overdue
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Oil Change - Due 2 days ago</p>
                              <Progress
                                value={100}
                                className="h-1.5 mt-2 bg-destructive/20"
                                indicatorClassName="bg-destructive"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 border-b">
                            <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-secondary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">Audi Q5 (DEF456)</p>
                                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                                  Due soon
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Tire Rotation - Due in 3 days</p>
                              <Progress value={75} className="h-1.5 mt-2" />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4">
                            <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-secondary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">Tesla Model 3 (ABC123)</p>
                                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                                  Due soon
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Brake Inspection - Due in 5 days</p>
                              <Progress value={60} className="h-1.5 mt-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Upcoming Inspections */}
                  <Card className="overflow-hidden border-t-4 border-t-primary shadow-md">
                    <CardHeader className="py-4 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm mr-3">
                            <FileCheck className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <CardTitle>Upcoming Inspections</CardTitle>
                            <CardDescription>Vehicle inspections due soon</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            3 inspections
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleCardVisibility("upcomingInspections")}
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${cardStates.upcomingInspections ? "rotate-180" : ""}`}
                            />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {cardStates.upcomingInspections && (
                      <CardContent className="p-0">
                        <div className="space-y-0">
                          <div className="flex items-center gap-3 p-4 border-b">
                            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <FileCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">Audi Q5 (DEF456)</p>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                  Apr 25
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Annual Safety Inspection</p>
                              <Progress value={85} className="h-1.5 mt-2" />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4 border-b">
                            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <FileCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">Toyota Camry (GHI789)</p>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                  May 3
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Emissions Test</p>
                              <Progress value={70} className="h-1.5 mt-2" />
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-4">
                            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <FileCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">Honda Accord (JKL012)</p>
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                  May 12
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Registration Renewal</p>
                              <Progress value={50} className="h-1.5 mt-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>

                {/* Pending Tasks */}
                <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md">
                  <CardHeader className="py-4 bg-gradient-to-r from-secondary/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shadow-sm mr-3">
                          <CheckSquare className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle>Pending Tasks</CardTitle>
                          <CardDescription>Tasks requiring attention</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                          6 tasks
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleCardVisibility("pendingTasks")}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${cardStates.pendingTasks ? "rotate-180" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {cardStates.pendingTasks && (
                    <CardContent className="p-0">
                      <div className="grid gap-0 md:grid-cols-2">
                        <div className="border-r">
                          <div className="p-3 border-b bg-muted/30">
                            <div className="flex items-center">
                              <Car className="h-4 w-4 text-primary mr-2" />
                              <p className="font-medium">Vehicle Tasks</p>
                            </div>
                          </div>
                          <div className="space-y-0">
                            <div className="flex items-center space-x-3 p-4 border-b hover:bg-muted/20 transition-colors">
                              <Checkbox id="task-1" className="h-5 w-5" />
                              <div className="flex-1">
                                <label
                                  htmlFor="task-1"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Clean BMW X5 (XYZ789)
                                </label>
                                <p className="text-xs text-muted-foreground">Due Apr 20, 2025</p>
                              </div>
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <Car className="h-3 w-3 text-primary" />
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-4 border-b hover:bg-muted/20 transition-colors">
                              <Checkbox id="task-2" className="h-5 w-5" />
                              <div className="flex-1">
                                <label
                                  htmlFor="task-2"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Schedule maintenance for Tesla Model 3
                                </label>
                                <p className="text-xs text-muted-foreground">Due Apr 22, 2025</p>
                              </div>
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <Wrench className="h-3 w-3 text-primary" />
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-4 hover:bg-muted/20 transition-colors">
                              <Checkbox id="task-3" className="h-5 w-5" />
                              <div className="flex-1">
                                <label
                                  htmlFor="task-3"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Update Honda Accord registration
                                </label>
                                <p className="text-xs text-muted-foreground">Due Apr 25, 2025</p>
                              </div>
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <FileCheck className="h-3 w-3 text-primary" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="p-3 border-b bg-muted/30">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-secondary mr-2" />
                              <p className="font-medium">Guest Tasks</p>
                            </div>
                          </div>
                          <div className="space-y-0">
                            <div className="flex items-center space-x-3 p-4 border-b hover:bg-muted/20 transition-colors">
                              <Checkbox id="task-4" className="h-5 w-5" />
                              <div className="flex-1">
                                <label
                                  htmlFor="task-4"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Send welcome message to John Smith
                                </label>
                                <p className="text-xs text-muted-foreground">Due Apr 19, 2025</p>
                              </div>
                              <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center">
                                <Users className="h-3 w-3 text-secondary" />
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-4 border-b hover:bg-muted/20 transition-colors">
                              <Checkbox id="task-5" className="h-5 w-5" />
                              <div className="flex-1">
                                <label
                                  htmlFor="task-5"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Prepare check-in instructions for Sarah Johnson
                                </label>
                                <p className="text-xs text-muted-foreground">Due Apr 21, 2025</p>
                              </div>
                              <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center">
                                <CheckSquare className="h-3 w-3 text-secondary" />
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-4 hover:bg-muted/20 transition-colors">
                              <Checkbox id="task-6" className="h-5 w-5" />
                              <div className="flex-1">
                                <label
                                  htmlFor="task-6"
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Request review from Michael Brown
                                </label>
                                <p className="text-xs text-muted-foreground">Due Apr 23, 2025</p>
                              </div>
                              <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center">
                                <Users className="h-3 w-3 text-secondary" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Turnaround Times */}
                <Card className="overflow-hidden border-t-4 border-t-blue-500 shadow-md">
                  <CardHeader className="py-4 bg-gradient-to-r from-blue-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm mr-3">
                          <Clock3 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle>Turnaround Times</CardTitle>
                          <CardDescription>Time between trip end and next start</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                          5 upcoming
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleCardVisibility("turnaroundTimes")}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${cardStates.turnaroundTimes ? "rotate-180" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {cardStates.turnaroundTimes && (
                    <CardContent className="p-0">
                      <div className="space-y-0">
                        {/* Critical Turnaround */}
                        <div className="flex items-center gap-3 p-4 border-b bg-red-50 dark:bg-red-950/20">
                          <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">Tesla Model 3 (ABC123)</p>
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-700"
                              >
                                1h 15m
                              </Badge>
                            </div>
                            <div className="mt-1">
                              <div className="flex items-center text-sm">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <span className="font-medium text-muted-foreground">Trip End:</span>
                                    <span className="ml-1">Apr 20, 2025 - 11:00 AM</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-muted-foreground">Next Trip:</span>
                                    <span className="ml-1">Apr 20, 2025 - 12:15 PM</span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <Button size="sm" variant="destructive" className="h-8">
                                    <Clock3 className="mr-1 h-3 w-3" />
                                    Reschedule
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tight Turnaround */}
                        <div className="flex items-center gap-3 p-4 border-b bg-amber-50 dark:bg-amber-950/20">
                          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Clock3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">BMW X5 (XYZ789)</p>
                              <Badge
                                variant="outline"
                                className="bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700"
                              >
                                3h 30m
                              </Badge>
                            </div>
                            <div className="mt-1">
                              <div className="flex items-center text-sm">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <span className="font-medium text-muted-foreground">Trip End:</span>
                                    <span className="ml-1">Apr 21, 2025 - 10:00 AM</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-muted-foreground">Next Trip:</span>
                                    <span className="ml-1">Apr 21, 2025 - 1:30 PM</span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <Button size="sm" variant="outline" className="h-8">
                                    <CheckSquare className="mr-1 h-3 w-3" />
                                    Assign Tasks
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Comfortable Turnaround */}
                        <div className="flex items-center gap-3 p-4 border-b">
                          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">Audi Q5 (DEF456)</p>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:border-green-700"
                              >
                                6h 45m
                              </Badge>
                            </div>
                            <div className="mt-1">
                              <div className="flex items-center text-sm">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <span className="font-medium text-muted-foreground">Trip End:</span>
                                    <span className="ml-1">Apr 22, 2025 - 9:15 AM</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-muted-foreground">Next Trip:</span>
                                    <span className="ml-1">Apr 22, 2025 - 4:00 PM</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Another Tight Turnaround */}
                        <div className="flex items-center gap-3 p-4 border-b bg-amber-50 dark:bg-amber-950/20">
                          <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Clock3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">Toyota Camry (GHI789)</p>
                              <Badge
                                variant="outline"
                                className="bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:border-amber-700"
                              >
                                2h 15m
                              </Badge>
                            </div>
                            <div className="mt-1">
                              <div className="flex items-center text-sm">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <span className="font-medium text-muted-foreground">Trip End:</span>
                                    <span className="ml-1">Apr 23, 2025 - 2:00 PM</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-muted-foreground">Next Trip:</span>
                                    <span className="ml-1">Apr 23, 2025 - 4:15 PM</span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <Button size="sm" variant="outline" className="h-8">
                                    <CheckSquare className="mr-1 h-3 w-3" />
                                    Assign Tasks
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Another Comfortable Turnaround */}
                        <div className="flex items-center gap-3 p-4">
                          <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">Honda Civic (VWX234)</p>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:border-green-700"
                              >
                                8h 30m
                              </Badge>
                            </div>
                            <div className="mt-1">
                              <div className="flex items-center text-sm">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <span className="font-medium text-muted-foreground">Trip End:</span>
                                    <span className="ml-1">Apr 24, 2025 - 10:30 AM</span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="font-medium text-muted-foreground">Next Trip:</span>
                                    <span className="ml-1">Apr 24, 2025 - 7:00 PM</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        {/* Admin Dashboard */}
        <TabsContent value="admin" className="space-y-6 mt-0">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="overflow-hidden shadow-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-base font-medium flex items-center">
                  <Car className="mr-2 h-5 w-5 text-primary" />
                  Active Trips
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-3xl font-bold">12</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <p className="text-sm">
                    <span className="text-green-500 font-medium">+2</span> from yesterday
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden shadow-md bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-base font-medium flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-3xl font-bold">$1,248</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <p className="text-sm">
                    <span className="text-green-500 font-medium">+18.2%</span> from yesterday
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden shadow-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-base font-medium flex items-center">
                  <Users className="mr-2 h-5 w-5 text-primary" />
                  Guests
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-3xl font-bold">16</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <p className="text-sm">
                    <span className="text-green-500 font-medium">+4</span> from yesterday
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden shadow-md bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-base font-medium flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-secondary" />
                  Fleet Utilization
                </CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-3xl font-bold">78%</div>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  <p className="text-sm">
                    <span className="text-green-500 font-medium">+5%</span> from yesterday
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden border-t-4 border-t-primary shadow-md">
              <CardHeader className="py-4 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm mr-3">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>Revenue trends for the past 6 months</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="h-64 flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground ml-2">Revenue chart will appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md">
              <CardHeader className="py-4 bg-gradient-to-r from-secondary/5 to-transparent">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shadow-sm mr-3">
                    <List className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>Fleet Performance</CardTitle>
                    <CardDescription>Utilization and revenue by vehicle</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {[
                    { vehicle: "Tesla Model 3", license: "ABC123", utilization: 92, revenue: "$3,450" },
                    { vehicle: "BMW X5", license: "XYZ789", utilization: 85, revenue: "$3,120" },
                    { vehicle: "Audi Q5", license: "DEF456", utilization: 78, revenue: "$2,890" },
                    { vehicle: "Toyota Camry", license: "GHI789", utilization: 65, revenue: "$2,340" },
                    { vehicle: "Honda Accord", license: "JKL012", utilization: 45, revenue: "$1,650" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Car className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.vehicle}</p>
                          <p className="text-sm text-muted-foreground">{item.license}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.revenue}</p>
                        <div className="flex items-center gap-2">
                          <Progress value={item.utilization} className="h-2 w-24" />
                          <span className="text-sm font-medium">{item.utilization}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden border-t-4 border-t-primary shadow-md">
              <CardHeader className="py-4 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm mr-3">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>Top Performing Vehicles</CardTitle>
                    <CardDescription>Based on revenue and utilization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="space-y-4">
                  {[
                    { rank: 1, vehicle: "Tesla Model 3", metric: "92% utilization" },
                    { rank: 2, vehicle: "BMW X5", metric: "85% utilization" },
                    { rank: 3, vehicle: "Audi Q5", metric: "78% utilization" },
                  ].map((item) => (
                    <div key={item.rank} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                          #{item.rank}
                        </div>
                        <p className="font-medium">{item.vehicle}</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {item.metric}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-t-4 border-t-secondary shadow-md">
              <CardHeader className="py-4 bg-gradient-to-r from-secondary/5 to-transparent">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center shadow-sm mr-3">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>Application and service health</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Database</p>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm font-medium text-green-500">Operational</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">API Services</p>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm font-medium text-green-500">Operational</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Payment Processing</p>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <p className="text-sm font-medium text-green-500">Operational</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Notification System</p>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                      <p className="text-sm font-medium text-yellow-500">Degraded</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
