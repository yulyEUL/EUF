"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Users,
  UserCheck,
  Search,
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building,
  Mail,
  Phone,
  UserPlus,
  Link,
  Unlink,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { toast } from "@/components/ui/use-toast"

// Mock data for users
const users = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-03-15T10:30:00",
    createdAt: "2023-01-15T09:00:00",
    avatar: "/contemplative-artist.png",
    modules: ["dashboard", "trips", "vehicles", "expenses", "financials", "tasks", "settings", "admin"],
    staffId: "S001",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    role: "manager",
    status: "active",
    lastLogin: "2024-03-14T16:45:00",
    createdAt: "2023-02-20T14:30:00",
    avatar: "/diverse-group-city.png",
    modules: ["dashboard", "trips", "vehicles", "expenses", "financials", "tasks"],
    staffId: "S002",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@company.com",
    role: "staff",
    status: "active",
    lastLogin: "2024-03-13T08:15:00",
    createdAt: "2023-03-10T11:00:00",
    avatar: "",
    modules: ["dashboard", "trips", "vehicles", "tasks"],
    staffId: null,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@company.com",
    role: "staff",
    status: "inactive",
    lastLogin: "2024-02-28T12:00:00",
    createdAt: "2023-04-05T10:15:00",
    avatar: "",
    modules: ["dashboard", "trips"],
    staffId: "S004",
  },
]

// Mock data for staff
const staff = [
  {
    id: "S001",
    name: "John Smith",
    position: "Fleet Manager",
    department: "Operations",
    hireDate: "2023-01-15",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    userId: "1",
  },
  {
    id: "S002",
    name: "Sarah Johnson",
    position: "Operations Manager",
    department: "Operations",
    hireDate: "2023-02-20",
    email: "sarah.j@company.com",
    phone: "+1 (555) 234-5678",
    userId: "2",
  },
  {
    id: "S003",
    name: "Robert Wilson",
    position: "Mechanic",
    department: "Maintenance",
    hireDate: "2023-01-30",
    email: "robert.w@company.com",
    phone: "+1 (555) 345-6789",
    userId: null,
  },
  {
    id: "S004",
    name: "Emily Davis",
    position: "Customer Service Rep",
    department: "Customer Service",
    hireDate: "2023-04-05",
    email: "emily.d@company.com",
    phone: "+1 (555) 456-7890",
    userId: "4",
  },
  {
    id: "S005",
    name: "David Martinez",
    position: "Driver",
    department: "Operations",
    hireDate: "2023-05-12",
    email: "david.m@company.com",
    phone: "+1 (555) 567-8901",
    userId: null,
  },
]

// Available modules
const availableModules = [
  { id: "dashboard", name: "Dashboard", description: "Main dashboard and analytics" },
  { id: "trips", name: "Trips", description: "Trip management and tracking" },
  { id: "vehicles", name: "Vehicles", description: "Vehicle fleet management" },
  { id: "expenses", name: "Expenses", description: "Expense tracking and reporting" },
  { id: "financials", name: "Financials", description: "Financial reports and analysis" },
  { id: "tasks", name: "Tasks", description: "Task management and assignments" },
  { id: "co-hosting", name: "Co-Hosting", description: "Co-host management" },
  { id: "accounts-payable", name: "Accounts Payable", description: "Vendor and invoice management" },
  { id: "maintenance", name: "Maintenance", description: "Vehicle maintenance tracking" },
  { id: "settings", name: "Settings", description: "Application settings" },
  { id: "admin", name: "Admin", description: "Administrative functions" },
]

// Role permissions
const rolePermissions = {
  admin: [
    "dashboard",
    "trips",
    "vehicles",
    "expenses",
    "financials",
    "tasks",
    "co-hosting",
    "accounts-payable",
    "maintenance",
    "settings",
    "admin",
  ],
  manager: [
    "dashboard",
    "trips",
    "vehicles",
    "expenses",
    "financials",
    "tasks",
    "co-hosting",
    "accounts-payable",
    "maintenance",
  ],
  staff: ["dashboard", "trips", "vehicles", "tasks"],
  viewer: ["dashboard"],
}

export default function AdminPage() {
  const [searchUsers, setSearchUsers] = useState("")
  const [searchStaff, setSearchStaff] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)

  // Calculate KPIs
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const totalStaff = staff.length
  const linkedStaff = staff.filter((s) => s.userId).length

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchUsers.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUsers.toLowerCase()) ||
      user.role.toLowerCase().includes(searchUsers.toLowerCase()),
  )

  // Filter staff
  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchStaff.toLowerCase()) ||
      member.position.toLowerCase().includes(searchStaff.toLowerCase()) ||
      member.department.toLowerCase().includes(searchStaff.toLowerCase()),
  )

  // Get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  // Format date and time
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy h:mm a")
  }

  // Handle user role change
  const handleUserRoleChange = (userId: string, newRole: string) => {
    toast({
      title: "Role updated",
      description: `User role has been updated to ${newRole}.`,
    })
  }

  // Handle user status toggle
  const handleUserStatusToggle = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    toast({
      title: "Status updated",
      description: `User has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
    })
  }

  // Handle module permission toggle
  const handleModuleToggle = (role: string, moduleId: string, enabled: boolean) => {
    toast({
      title: "Permissions updated",
      description: `${moduleId} access has been ${enabled ? "enabled" : "disabled"} for ${role} role.`,
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {/* KPI Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Active Users</p>
                <p className="text-2xl font-bold">{activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Staff Members</p>
                <p className="text-2xl font-bold">{totalStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Link className="h-4 w-4 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Linked Accounts</p>
                <p className="text-2xl font-bold">
                  {linkedStaff}/{totalStaff}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, roles, and module access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchUsers}
                  onChange={(e) => setSearchUsers(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Staff Link</TableHead>
                      <TableHead>Modules</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const linkedStaffMember = staff.find((s) => s.userId === user.id)
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                {user.avatar ? (
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                ) : null}
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              defaultValue={user.role}
                              onValueChange={(value) => handleUserRoleChange(user.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant={user.status === "active" ? "default" : "secondary"}>
                                {user.status === "active" ? (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <XCircle className="h-3 w-3 mr-1" />
                                )}
                                {user.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUserStatusToggle(user.id, user.status)}
                              >
                                {user.status === "active" ? (
                                  <ToggleRight className="h-4 w-4" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDateTime(user.lastLogin)}</div>
                          </TableCell>
                          <TableCell>
                            {linkedStaffMember ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                  <Link className="h-3 w-3 mr-1" />
                                  {linkedStaffMember.name}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <Unlink className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="ghost" size="sm">
                                <Link className="h-3 w-3 mr-1" />
                                Link Staff
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{user.modules.length} modules</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Sheet
                                open={isEditUserOpen && selectedUser?.id === user.id}
                                onOpenChange={setIsEditUserOpen}
                              >
                                <SheetTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedUser(user)
                                      setIsEditUserOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
                                  <SheetHeader>
                                    <SheetTitle>Edit User - {selectedUser?.name}</SheetTitle>
                                    <SheetDescription>
                                      Manage user details, role, and module permissions
                                    </SheetDescription>
                                  </SheetHeader>

                                  {selectedUser && (
                                    <div className="space-y-6 py-4">
                                      {/* User Info */}
                                      <div className="space-y-4">
                                        <h3 className="text-lg font-medium">User Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input id="name" defaultValue={selectedUser.name} />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" defaultValue={selectedUser.email} />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label htmlFor="role">Role</Label>
                                            <Select defaultValue={selectedUser.role}>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="staff">Staff</SelectItem>
                                                <SelectItem value="viewer">Viewer</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="status">Status</Label>
                                            <Select defaultValue={selectedUser.status}>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Module Permissions */}
                                      <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Module Permissions</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                          {availableModules.map((module) => (
                                            <div
                                              key={module.id}
                                              className="flex items-center justify-between p-3 border rounded-md"
                                            >
                                              <div>
                                                <div className="font-medium">{module.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                  {module.description}
                                                </div>
                                              </div>
                                              <Switch
                                                checked={selectedUser.modules.includes(module.id)}
                                                onCheckedChange={(checked) => {
                                                  // Handle module toggle
                                                }}
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Staff Linking */}
                                      <div className="space-y-4">
                                        <h3 className="text-lg font-medium">Staff Linking</h3>
                                        <div className="space-y-2">
                                          <Label htmlFor="staff-link">Link to Staff Member</Label>
                                          <Select defaultValue={selectedUser.staffId || "none"}>
                                            <SelectTrigger>
                                              <SelectValue placeholder="Select staff member" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="none">No staff link</SelectItem>
                                              {staff
                                                .filter((s) => !s.userId || s.userId === selectedUser.id)
                                                .map((member) => (
                                                  <SelectItem key={member.id} value={member.id}>
                                                    {member.name} - {member.position}
                                                  </SelectItem>
                                                ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <SheetFooter>
                                    <SheetClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </SheetClose>
                                    <Button
                                      onClick={() => {
                                        toast({
                                          title: "User updated",
                                          description: "User information has been updated successfully.",
                                        })
                                        setIsEditUserOpen(false)
                                      }}
                                    >
                                      Save Changes
                                    </Button>
                                  </SheetFooter>
                                </SheetContent>
                              </Sheet>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>Manage staff profiles and link them to user accounts</CardDescription>
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
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Hire Date</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>User Account</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((member) => {
                      const linkedUser = users.find((u) => u.id === member.userId)
                      return (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.id}</div>
                          </TableCell>
                          <TableCell>{member.position}</TableCell>
                          <TableCell>{member.department}</TableCell>
                          <TableCell>{formatDate(member.hireDate)}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3" />
                                {member.email}
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" />
                                {member.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {linkedUser ? (
                              <div className="flex items-center gap-2">
                                <Badge variant="default">
                                  <Link className="h-3 w-3 mr-1" />
                                  {linkedUser.name}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <Unlink className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Badge variant="outline">
                                <Unlink className="h-3 w-3 mr-1" />
                                No account
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Module Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Permissions</CardTitle>
              <CardDescription>Configure which modules each role can access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(rolePermissions).map(([role, permissions]) => (
                  <div key={role} className="space-y-4">
                    <h3 className="text-lg font-medium capitalize">{role} Role</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availableModules.map((module) => (
                        <div key={module.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <div className="font-medium">{module.name}</div>
                            <div className="text-sm text-muted-foreground">{module.description}</div>
                          </div>
                          <Switch
                            checked={permissions.includes(module.id)}
                            onCheckedChange={(checked) => handleModuleToggle(role, module.id, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Monitor system status and performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Database</span>
                  </div>
                  <Badge variant="default">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>API Services</span>
                  </div>
                  <Badge variant="default">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Email Service</span>
                  </div>
                  <Badge variant="secondary">Degraded</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>File Storage</span>
                  </div>
                  <Badge variant="default">Healthy</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Application Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>Configure global application settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="user-registration">User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                  </div>
                  <Switch id="user-registration" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send system email notifications</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-backup">Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Enable daily data backups</p>
                  </div>
                  <Switch id="data-backup" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update company details and branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Car Rental SaaS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Contact Email</Label>
                  <Input id="company-email" type="email" defaultValue="contact@carrentalsaas.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Phone Number</Label>
                  <Input id="company-phone" defaultValue="+1 (555) 000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Address</Label>
                  <Textarea id="company-address" defaultValue="123 Business St, City, State 12345" />
                </div>
                <Button className="w-full">Update Company Info</Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Activity</CardTitle>
                <CardDescription>Latest administrative actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm">User role updated: Sarah Johnson → Manager</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm">New user invited: michael.b@company.com</p>
                      <p className="text-xs text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm">Module permissions updated for Staff role</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm">User deactivated: emily.d@company.com</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
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
