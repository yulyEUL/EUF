"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { DateRangePicker } from "@/components/ui/date-range-picker"

export function FinancialsFilters() {
  const [dateRange, setDateRange] = useState({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })

  return (
    <div className="flex items-center gap-2">
      <DateRangePicker date={dateRange} onDateChange={setDateRange} align="end" className="w-[280px]">
        <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
          <Calendar className="mr-2 h-4 w-4" />
          <span>
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                </>
              ) : (
                dateRange.from.toLocaleDateString()
              )
            ) : (
              "Select date range"
            )}
          </span>
        </Button>
      </DateRangePicker>
      <Button variant="outline" size="icon">
        <span className="sr-only">Export data</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
      </Button>
    </div>
  )
}
