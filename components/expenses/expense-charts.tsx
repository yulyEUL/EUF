"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const monthlyData = [
  { name: "Jan", maintenance: 5840, fuel: 3200, insurance: 2100, other: 1450 },
  { name: "Feb", maintenance: 4950, fuel: 3100, insurance: 2100, other: 1320 },
  { name: "Mar", maintenance: 6840, fuel: 3400, insurance: 2100, other: 1680 },
  { name: "Apr", maintenance: 5430, fuel: 3250, insurance: 2100, other: 1540 },
  { name: "May", maintenance: 6250, fuel: 3500, insurance: 2100, other: 1720 },
  { name: "Jun", maintenance: 7840, fuel: 3800, insurance: 2100, other: 1950 },
  { name: "Jul", maintenance: 9845, fuel: 4200, insurance: 2100, other: 2418 },
  { name: "Aug", maintenance: 8450, fuel: 4100, insurance: 2100, other: 2150 },
]

const categoryData = [
  { name: "Maintenance", value: 9845, color: "#0ea5e9" },
  { name: "Fuel", value: 4200, color: "#f97316" },
  { name: "Insurance", value: 2100, color: "#8b5cf6" },
  { name: "Cleaning", value: 1250, color: "#10b981" },
  { name: "Parking", value: 850, color: "#f59e0b" },
  { name: "Other", value: 318, color: "#6b7280" },
]

export function ExpenseCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Expense Trends</CardTitle>
          <CardDescription>Monthly expense breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bar">
            <TabsList className="mb-4">
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="line">Line Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="bar" className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                  <Legend />
                  <Bar dataKey="maintenance" name="Maintenance" stackId="a" fill="#0ea5e9" />
                  <Bar dataKey="fuel" name="Fuel" stackId="a" fill="#f97316" />
                  <Bar dataKey="insurance" name="Insurance" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="other" name="Other" stackId="a" fill="#6b7280" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="line" className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                  <Legend />
                  <Line type="monotone" dataKey="maintenance" name="Maintenance" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="fuel" name="Fuel" stroke="#f97316" strokeWidth={2} />
                  <Line type="monotone" dataKey="insurance" name="Insurance" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="other" name="Other" stroke="#6b7280" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
          <CardDescription>Current month expense breakdown by category</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value}`, undefined]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
