"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TaskOverview } from "@/components/tasks/task-overview"
import { TaskFilters, type TaskFilters as TaskFiltersType } from "@/components/tasks/task-filters"
import { TaskTable, type Task } from "@/components/tasks/task-table"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { useToast } from "@/hooks/use-toast"

// Sample data for demonstration
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Oil Change for Toyota Camry",
    description: "Perform routine oil change and filter replacement",
    status: "todo",
    priority: "medium",
    category: "Maintenance",
    dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
    assignee: "john",
    vehicle: {
      id: "vehicle-1",
      name: "Toyota Camry (2020)",
    },
    createdAt: new Date(),
    reservationId: "R-4589",
    guest: {
      id: "guest-1",
      name: "Michael Johnson",
      email: "michael.j@example.com",
    },
    location: "Downtown Branch",
    tripStartDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    tripEndDate: new Date(Date.now() + 86400000 * 10), // 10 days from now
  },
  {
    id: "task-2",
    title: "Clean and detail Honda Civic",
    description: "Full interior and exterior detailing before customer pickup",
    status: "in-progress",
    priority: "high",
    category: "Cleaning",
    dueDate: new Date(Date.now() + 86400000), // 1 day from now
    assignee: "jane",
    vehicle: {
      id: "vehicle-2",
      name: "Honda Civic (2021)",
    },
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    reservationId: "R-2378",
    guest: {
      id: "guest-2",
      name: "Sarah Williams",
      email: "s.williams@example.com",
    },
    location: "Airport Location",
    tripStartDate: new Date(Date.now() + 86400000), // 1 day from now
    tripEndDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
  },
  {
    id: "task-3",
    title: "Tire rotation for BMW X5",
    description: "Rotate tires and check pressure",
    status: "completed",
    priority: "medium",
    category: "Maintenance",
    dueDate: new Date(Date.now() - 86400000), // 1 day ago
    assignee: "robert",
    vehicle: {
      id: "vehicle-3",
      name: "BMW X5 (2019)",
    },
    createdAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
  },
  {
    id: "task-4",
    title: "Process refund for cancelled reservation",
    description: "Customer ID: 12345, Reservation #: R-789",
    status: "todo",
    priority: "urgent",
    category: "Administrative",
    dueDate: new Date(Date.now()), // Today
    assignee: "emily",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    reservationId: "R-789",
    guest: {
      id: "guest-3",
      name: "Laura Chen",
      email: "laura.chen@example.com",
    },
  },
  {
    id: "task-5",
    title: "Inspect brake system on Audi A4",
    description: "Customer reported unusual noise when braking",
    status: "todo",
    priority: "high",
    category: "Inspection",
    dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    assignee: null,
    vehicle: {
      id: "vehicle-4",
      name: "Audi A4 (2022)",
    },
    createdAt: new Date(Date.now() - 43200000), // 12 hours ago
  },
  {
    id: "task-6",
    title: "Follow up with customer about extended rental",
    description: "Customer requested information about extending their rental by 1 week",
    status: "todo",
    priority: "medium",
    category: "Customer",
    dueDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
    assignee: "john",
    createdAt: new Date(Date.now() - 21600000), // 6 hours ago
  },
  {
    id: "task-7",
    title: "Update vehicle registration documents",
    description: "Annual registration renewal for fleet vehicles",
    status: "in-progress",
    priority: "medium",
    category: "Administrative",
    dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
    assignee: "emily",
    createdAt: new Date(Date.now() - 86400000 * 4), // 4 days ago
  },
  {
    id: "task-8",
    title: "Replace windshield wipers on all vehicles",
    description: "Routine replacement before rainy season",
    status: "cancelled",
    priority: "low",
    category: "Maintenance",
    dueDate: new Date(Date.now() + 86400000 * 10), // 10 days from now
    assignee: "robert",
    createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
  },
]

// Sample vehicles for demonstration
const sampleVehicles = [
  { id: "vehicle-1", name: "Toyota Camry (2020)" },
  { id: "vehicle-2", name: "Honda Civic (2021)" },
  { id: "vehicle-3", name: "BMW X5 (2019)" },
  { id: "vehicle-4", name: "Audi A4 (2022)" },
  { id: "vehicle-5", name: "Tesla Model 3 (2023)" },
]

export default function TasksPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [filters, setFilters] = useState<TaskFiltersType>({
    search: "",
    status: "all",
    priority: "all",
    category: "all",
    assignee: "all",
  })

  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined)

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === "completed").length
  const pendingTasks = tasks.filter((task) => task.status === "todo" || task.status === "in-progress").length
  const overdueTasks = tasks.filter(
    (task) =>
      (task.status === "todo" || task.status === "in-progress") &&
      new Date() > task.dueDate &&
      new Date().toDateString() !== task.dueDate.toDateString(),
  ).length

  const handleFilterChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters)
  }

  const handleAddTask = () => {
    setCurrentTask(undefined)
    setTaskDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setTaskDialogOpen(true)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    toast({
      title: "Task deleted",
      description: "The task has been successfully deleted.",
    })
  }

  const handleStatusChange = (taskId: string, status: Task["status"]) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status } : task)))
    toast({
      title: "Task updated",
      description: `Task status changed to ${status.replace("-", " ")}.`,
    })
  }

  const handleSaveTask = (formValues: any) => {
    if (currentTask) {
      // Update existing task
      setTasks(
        tasks.map((task) =>
          task.id === currentTask.id
            ? {
                ...task,
                ...formValues,
                vehicle:
                  formValues.vehicleId && formValues.vehicleId !== "none"
                    ? sampleVehicles.find((v) => v.id === formValues.vehicleId)
                    : undefined,
                guest: formValues.guestName
                  ? {
                      id: task.guest?.id || `guest-${Date.now()}`,
                      name: formValues.guestName,
                      email: formValues.guestEmail || undefined,
                    }
                  : undefined,
              }
            : task,
        ),
      )
      toast({
        title: "Task updated",
        description: "The task has been successfully updated.",
      })
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: formValues.title,
        description: formValues.description || "",
        status: formValues.status,
        priority: formValues.priority,
        category: formValues.category,
        dueDate: formValues.dueDate,
        assignee: formValues.assignee,
        vehicle:
          formValues.vehicleId && formValues.vehicleId !== "none"
            ? sampleVehicles.find((v) => v.id === formValues.vehicleId)
            : undefined,
        createdAt: new Date(),
        reservationId: formValues.reservationId || undefined,
        guest: formValues.guestName
          ? {
              id: `guest-${Date.now()}`,
              name: formValues.guestName,
              email: formValues.guestEmail || undefined,
            }
          : undefined,
        location: formValues.location || undefined,
        tripStartDate: formValues.tripStartDate,
        tripEndDate: formValues.tripEndDate,
      }
      setTasks([newTask, ...tasks])
      toast({
        title: "Task created",
        description: "The new task has been successfully created.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Button onClick={handleAddTask}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      <TaskOverview
        totalTasks={totalTasks}
        completedTasks={completedTasks}
        pendingTasks={pendingTasks}
        overdueTasks={overdueTasks}
      />

      <div className="space-y-4">
        <TaskFilters onFilterChange={handleFilterChange} />

        <TaskTable
          tasks={tasks}
          filters={filters}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={currentTask}
        onSave={handleSaveTask}
        vehicles={sampleVehicles}
      />
    </div>
  )
}
