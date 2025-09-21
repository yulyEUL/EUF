"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash, CheckCircle } from "lucide-react"
import type { TaskFilters } from "./task-filters"

export interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  dueDate: Date
  assignee: string | null
  vehicle?: {
    id: string
    name: string
  }
  createdAt: Date
  // New trip-related fields
  reservationId?: string
  guest?: {
    id: string
    name: string
    email?: string
  }
  location?: string
  tripStartDate?: Date
  tripEndDate?: Date
}

interface TaskTableProps {
  tasks: Task[]
  filters: TaskFilters
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: Task["status"]) => void
}

export function TaskTable({ tasks, filters, onEdit, onDelete, onStatusChange }: TaskTableProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description.toLowerCase().includes(filters.search.toLowerCase())

    const matchesStatus = filters.status === "all" || task.status === filters.status
    const matchesPriority = filters.priority === "all" || task.priority === filters.priority
    const matchesCategory = filters.category === "all" || task.category === filters.category
    const matchesAssignee =
      filters.assignee === "all" ||
      (filters.assignee === "unassigned" && task.assignee === null) ||
      task.assignee === filters.assignee

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignee
  })

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

  const toggleAllTasks = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id))
    }
  }

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return <Badge variant="outline">To Do</Badge>
      case "in-progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "completed":
        return <Badge variant="success">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
    }
  }

  const getPriorityBadge = (priority: Task["priority"]) => {
    switch (priority) {
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>
      case "medium":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Medium</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>
      case "urgent":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Urgent</Badge>
    }
  }

  const isOverdue = (dueDate: Date) => {
    return new Date() > dueDate && new Date().toDateString() !== dueDate.toDateString()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                onCheckedChange={toggleAllTasks}
                aria-label="Select all tasks"
              />
            </TableHead>
            <TableHead>Task</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden sm:table-cell">Status</TableHead>
            <TableHead className="hidden lg:table-cell">Priority</TableHead>
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead className="hidden lg:table-cell">Assignee</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No tasks found.
              </TableCell>
            </TableRow>
          ) : (
            filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onCheckedChange={() => toggleTaskSelection(task.id)}
                    aria-label={`Select task ${task.title}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{task.title}</div>
                  {task.vehicle && <div className="text-xs text-muted-foreground">Vehicle: {task.vehicle.name}</div>}
                  {task.reservationId && (
                    <div className="text-xs text-muted-foreground">Reservation: #{task.reservationId}</div>
                  )}
                  {task.guest && <div className="text-xs text-muted-foreground">Guest: {task.guest.name}</div>}
                </TableCell>
                <TableCell className="hidden md:table-cell">{task.category}</TableCell>
                <TableCell className="hidden sm:table-cell">{getStatusBadge(task.status)}</TableCell>
                <TableCell className="hidden lg:table-cell">{getPriorityBadge(task.priority)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <div
                    className={isOverdue(task.dueDate) && task.status !== "completed" ? "text-red-500 font-medium" : ""}
                  >
                    {formatDate(task.dueDate)}
                  </div>
                  {task.location && <div className="text-xs text-muted-foreground">{task.location}</div>}
                  {task.tripStartDate && task.tripEndDate && (
                    <div className="text-xs text-muted-foreground">
                      Trip: {formatDate(task.tripStartDate)} - {formatDate(task.tripEndDate)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">{task.assignee || "Unassigned"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {task.status !== "completed" && (
                        <DropdownMenuItem onClick={() => onStatusChange(task.id, "completed")}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(task)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600 focus:text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
