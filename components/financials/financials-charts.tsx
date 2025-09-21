"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, PieChart } from "@/components/ui/charts"

export function FinancialsCharts() {
  const [period, setPeriod] = useState("monthly")
  const [chartView, setChartView] = useState("trends")
  const [categoryType, setCategoryType] = useState("revenue")

  // Mock data - would come from API in real app
  const trendsData = {
    monthly: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Revenue",
          data: [6500, 5900, 8000, 8100, 7800, 9200],
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          borderColor: "rgb(16, 185, 129)",
        },
        {
          label: "Expenses",
          data: [4200, 4800, 5100, 5300, 4900, 5800],
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          borderColor: "rgb(239, 68, 68)",
        },
        {
          label: "Profit",
          data: [2300, 1100, 2900, 2800, 2900, 3400],
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgb(59, 130, 246)",
        },
      ],
    },
    quarterly: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "Revenue",
          data: [20400, 25100, 28900, 31200],
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          borderColor: "rgb(16, 185, 129)",
        },
        {
          label: "Expenses",
          data: [14100, 15500, 17800, 19200],
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          borderColor: "rgb(239, 68, 68)",
        },
        {
          label: "Profit",
          data: [6300, 9600, 11100, 12000],
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgb(59, 130, 246)",
        },
      ],
    },
    yearly: {
      labels: ["2020", "2021", "2022", "2023"],
      datasets: [
        {
          label: "Revenue",
          data: [78000, 92000, 105000, 124000],
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          borderColor: "rgb(16, 185, 129)",
        },
        {
          label: "Expenses",
          data: [52000, 61000, 68000, 79000],
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          borderColor: "rgb(239, 68, 68)",
        },
        {
          label: "Profit",
          data: [26000, 31000, 37000, 45000],
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          borderColor: "rgb(59, 130, 246)",
        },
      ],
    },
  }

  const categoryData = {
    revenue: {
      labels: ["Rental Fees", "Insurance", "Upgrades", "Late Fees", "Other"],
      datasets: [
        {
          data: [65, 15, 10, 7, 3],
          backgroundColor: [
            "rgba(16, 185, 129, 0.7)",
            "rgba(14, 165, 233, 0.7)",
            "rgba(168, 85, 247, 0.7)",
            "rgba(251, 191, 36, 0.7)",
            "rgba(239, 68, 68, 0.7)",
          ],
          borderColor: [
            "rgb(16, 185, 129)",
            "rgb(14, 165, 233)",
            "rgb(168, 85, 247)",
            "rgb(251, 191, 36)",
            "rgb(239, 68, 68)",
          ],
          borderWidth: 1,
        },
      ],
    },
    expenses: {
      labels: ["Maintenance", "Insurance", "Fuel", "Staff", "Marketing", "Other"],
      datasets: [
        {
          data: [30, 25, 15, 20, 7, 3],
          backgroundColor: [
            "rgba(239, 68, 68, 0.7)",
            "rgba(251, 191, 36, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(14, 165, 233, 0.7)",
            "rgba(168, 85, 247, 0.7)",
            "rgba(107, 114, 128, 0.7)",
          ],
          borderColor: [
            "rgb(239, 68, 68)",
            "rgb(251, 191, 36)",
            "rgb(16, 185, 129)",
            "rgb(14, 165, 233)",
            "rgb(168, 85, 247)",
            "rgb(107, 114, 128)",
          ],
          borderWidth: 1,
        },
      ],
    },
  }

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(value))
  }

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
  }

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ""
            const value = formatCurrency(context.raw)
            const percentage = Math.round(context.parsed) + "%"
            return `${label}: ${value} (${percentage})`
          },
        },
      },
    },
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CardTitle>Financial Analysis</CardTitle>
            <Tabs value={chartView} onValueChange={setChartView} className="ml-auto sm:ml-4">
              <TabsList>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {chartView === "trends" ? (
            <Tabs value={period} onValueChange={setPeriod}>
              <TabsList>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          ) : (
            <Tabs value={categoryType} onValueChange={setCategoryType}>
              <TabsList>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {chartView === "trends" ? (
            <BarChart
              data={{
                labels: trendsData[period as keyof typeof trendsData].labels,
                datasets: trendsData[period as keyof typeof trendsData].datasets,
              }}
              options={barOptions}
            />
          ) : (
            <div className="flex justify-center h-full">
              <PieChart
                data={{
                  labels: categoryData[categoryType as keyof typeof categoryData].labels,
                  datasets: categoryData[categoryType as keyof typeof categoryData].datasets,
                }}
                options={pieOptions}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
