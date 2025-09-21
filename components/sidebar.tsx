"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Car,
  Calendar,
  DollarSign,
  Settings,
  Wrench,
  CheckSquare,
  BarChart3,
  CreditCard,
  Database,
  Mail,
  ChevronDown,
  ChevronRight,
  Home,
  UserCog,
  Building2,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Trips", href: "/trips", icon: Calendar },
  { name: "Vehicles", href: "/vehicles", icon: Car },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Maintenance", href: "/maintenance", icon: Wrench },
  { name: "Expenses", href: "/expenses", icon: DollarSign },
  { name: "Accounts Payable", href: "/accounts-payable", icon: CreditCard },
  { name: "Financials", href: "/financials", icon: BarChart3 },
  { name: "Co-hosting", href: "/co-hosting", icon: Building2 },
]

const adminNavigation = [
  { name: "Admin", href: "/admin", icon: UserCog },
  { name: "Database", href: "/database", icon: Database },
  { name: "Email Parser", href: "/email-parser", icon: Mail },
]

const settingsNavigation = [{ name: "Settings", href: "/settings", icon: Settings }]

export function Sidebar() {
  const pathname = usePathname()
  const [isAdminExpanded, setIsAdminExpanded] = useState(true)

  // Mock user role - in real app, get from auth context
  const userRole = "admin" // 'admin', 'manager', 'staff', 'user'
  const isAdmin = userRole === "admin"

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <Car className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-semibold text-gray-900">CarRental</span>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {isAdmin && (
          <>
            <Separator className="my-4" />
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsAdminExpanded(!isAdminExpanded)}
              >
                {isAdminExpanded ? <ChevronDown className="mr-2 h-4 w-4" /> : <ChevronRight className="mr-2 h-4 w-4" />}
                Admin Tools
              </Button>

              {isAdminExpanded && (
                <div className="ml-4 space-y-1">
                  {adminNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          isActive
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        )}
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        <Separator className="my-4" />
        <nav className="space-y-1">
          {settingsNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
