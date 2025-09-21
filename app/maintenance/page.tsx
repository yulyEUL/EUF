"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Car, Filter, MoreHorizontal, Plus, Search, PenToolIcon as Tool, Wrench } from "lucide-react"

export default function MaintenancePage() {
  const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Maintenance</h2>
          <p className="text-muted-foreground">Track and manage vehicle maintenance</p>
        </div>
        <div className="flex items-center gap-2">
          <Sheet open={isAddMaintenanceOpen} onOpenChange={setIsAddMaintenanceOpen}>
            <SheetTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Maintenance
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Add Maintenance Record</SheetTitle>
                <SheetDescription>Record a new maintenance task for a vehicle</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select a vehicle</option>
                    <option value="1">Tesla Model 3 (ABC123)</option>
                    <option value="2">BMW X5 (XYZ789)</option>
                    <option value="3">Audi Q5 (DEF456)</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Maintenance Type</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select type</option>
                    <option value="oil">Oil Change</option>
                    <option value="tires">Tire Rotation</option>
                    <option value="brakes">Brake Service</option>
                    <option value="inspection">General Inspection</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Service Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mileage">Mileage</Label>
                  <Input id="mileage" placeholder="45,000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input id="cost" placeholder="$0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="vendor">Service Provider/Vendor</Label>
                  <Input id="vendor" placeholder="Mechanic or service center" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Additional details about the maintenance" />
                </div>
              </div>
              <SheetFooter>
                <Button variant="outline" onClick={() => setIsAddMaintenanceOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddMaintenanceOpen(false)}>Save Record</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1 md:max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search maintenance records..." className="pl-8" />
          </div>
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Tool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12 in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Services</CardTitle>
            <AlertTriangle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Due in the next 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Services</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Costs</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,285.42</div>
            <p className="text-xs text-muted-foreground">Year to date</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="hidden md:table-cell">Due Date</TableHead>
                    <TableHead className="hidden md:table-cell">Mileage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      vehicle: "BMW X5",
                      license: "XYZ789",
                      service: "Oil Change",
                      dueDate: "Apr 18, 2025",
                      mileage: "45,000",
                      status: "overdue",
                      progress: 100,
                    },
                    {
                      vehicle: "Audi Q5",
                      license: "DEF456",
                      service: "Tire Rotation",
                      dueDate: "Apr 23, 2025",
                      mileage: "32,500",
                      status: "due-soon",
                      progress: 85,
                    },
                    {
                      vehicle: "Tesla Model 3",
                      license: "ABC123",
                      service: "Brake Inspection",
                      dueDate: "Apr 25, 2025",
                      mileage: "28,750",
                      status: "due-soon",
                      progress: 75,
                    },
                    {
                      vehicle: "Toyota Camry",
                      license: "GHI789",
                      service: "Air Filter",
                      dueDate: "May 5, 2025",
                      mileage: "22,000",
                      status: "upcoming",
                      progress: 50,
                    },
                    {
                      vehicle: "Honda Accord",
                      license: "JKL012",
                      service: "Transmission Fluid",
                      dueDate: "May 12, 2025",
                      mileage: "35,000",
                      status: "upcoming",
                      progress: 30,
                    },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Car className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{record.vehicle}</p>
                            <p className="text-xs text-muted-foreground">{record.license}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.service}</TableCell>
                      <TableCell className="hidden md:table-cell">{record.dueDate}</TableCell>
                      <TableCell className="hidden md:table-cell">{record.mileage}</TableCell>
                      <TableCell>
                        {record.status === "overdue" && (
                          <Badge
                            variant="outline"
                            className="bg-destructive/10 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            Overdue
                          </Badge>
                        )}
                        {record.status === "due-soon" && (
                          <Badge
                            variant="outline"
                            className="bg-secondary/10 text-secondary hover:bg-secondary/10 hover:text-secondary"
                          >
                            Due Soon
                          </Badge>
                        )}
                        {record.status === "upcoming" && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                          >
                            Upcoming
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Mark as Complete</DropdownMenuItem>
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Mileage</TableHead>
                    <TableHead className="hidden md:table-cell">Cost</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      vehicle: "Tesla Model 3",
                      license: "ABC123",
                      service: "Oil Change",
                      date: "Mar 15, 2025",
                      mileage: "25,000",
                      cost: "$85.00",
                    },
                    {
                      vehicle: "BMW X5",
                      license: "XYZ789",
                      service: "Brake Service",
                      date: "Mar 2, 2025",
                      mileage: "42,500",
                      cost: "$350.00",
                    },
                    {
                      vehicle: "Audi Q5",
                      license: "DEF456",
                      service: "Tire Rotation",
                      date: "Feb 20, 2025",
                      mileage: "30,000",
                      cost: "$75.00",
                    },
                    {
                      vehicle: "Toyota Camry",
                      license: "GHI789",
                      service: "Battery Replacement",
                      date: "Feb 10, 2025",
                      mileage: "20,000",
                      cost: "$150.00",
                    },
                    {
                      vehicle: "Honda Accord",
                      license: "JKL012",
                      service: "Air Filter",
                      date: "Jan 25, 2025",
                      mileage: "32,500",
                      cost: "$45.00",
                    },
                  ].map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Car className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{record.vehicle}</p>
                            <p className="text-xs text-muted-foreground">{record.license}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{record.service}</TableCell>
                      <TableCell className="hidden md:table-cell">{record.date}</TableCell>
                      <TableCell className="hidden md:table-cell">{record.mileage}</TableCell>
                      <TableCell className="hidden md:table-cell">{record.cost}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Record</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4">
            <Card className="border-destructive/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Critical Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <CardDescription>Maintenance items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                    <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">BMW X5 (XYZ789)</p>
                        <p className="text-xs font-medium text-destructive">2 days overdue</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Oil Change - Due at 45,000 miles</p>
                      <div className="mt-2">
                        <Progress value={100} className="h-2 bg-destructive/20" indicatorClassName="bg-destructive" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">Upcoming Maintenance</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-secondary" />
                </div>
                <CardDescription>Maintenance items due in the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Audi Q5 (DEF456)</p>
                        <p className="text-xs font-medium text-secondary">Due in 3 days</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Tire Rotation - Due at 32,500 miles</p>
                      <div className="mt-2">
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Tesla Model 3 (ABC123)</p>
                        <p className="text-xs font-medium text-secondary">Due in 5 days</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Brake Inspection - Due at 28,750 miles</p>
                      <div className="mt-2">
                        <Progress value={75} className="h-2" />
                      </div>
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
