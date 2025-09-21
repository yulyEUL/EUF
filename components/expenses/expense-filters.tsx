"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, ChevronDown, Filter, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function ExpenseFilters() {
  const [date, setDate] = useState<Date>()
  const [categories, setCategories] = useState({
    maintenance: false,
    fuel: false,
    insurance: false,
    cleaning: false,
    parking: false,
    other: false,
  })

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search expenses..." className="w-[200px] pl-8 md:w-[250px]" />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={categories.maintenance}
            onCheckedChange={(checked) => setCategories({ ...categories, maintenance: checked })}
          >
            Maintenance
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={categories.fuel}
            onCheckedChange={(checked) => setCategories({ ...categories, fuel: checked })}
          >
            Fuel
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={categories.insurance}
            onCheckedChange={(checked) => setCategories({ ...categories, insurance: checked })}
          >
            Insurance
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={categories.cleaning}
            onCheckedChange={(checked) => setCategories({ ...categories, cleaning: checked })}
          >
            Cleaning
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={categories.parking}
            onCheckedChange={(checked) => setCategories({ ...categories, parking: checked })}
          >
            Parking
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={categories.other}
            onCheckedChange={(checked) => setCategories({ ...categories, other: checked })}
          >
            Other
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
