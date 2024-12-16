"use client"

import React, { useState, useEffect } from 'react'
import { format } from "date-fns"
import { CalendarIcon, PlusIcon, Pencil, Trash2, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from '@/components/ui/calendar'
import { toast, Toaster } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Task = {
  id: string
  title: string
  status: 'To Do' | 'In Progress' | 'Completed'
  assigneeId: string
  assignee: {
    id: string
    name: string
  }
  dueDate: Date | null
}

type TeamMember = {
  id: string
  name: string
}

function DatePickerDemo({ date, setDate }: { date: Date | null, setDate: (date: Date | null) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            onClick={(e) => {
              e.preventDefault()
              setOpen(true)
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          onMouseDown={(e) => e.preventDefault()}
          style={{ position: 'relative', zIndex: 100 }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            onMouseDown={(e) => e.stopPropagation()}
          >
            <Calendar
              date={date || new Date()}
              onDateChange={(newDate) => {
                setDate(newDate)
                setOpen(false)
              }}
              initialFocus
            />
          </div>
        </PopoverContent>
      </Popover>
      {date && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => { 
            e.stopPropagation()
            e.preventDefault()
            setDate(null)
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear date</span>
        </Button>
      )}
    </div>
  )
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [filters, setFilters] = useState({
    status: 'all',
    assignee: '',
    dueDate: null as Date | null,
  })
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'assignee'>>({
    title: '',
    status: 'To Do',
    assigneeId: '',
    dueDate: null,
  })

  useEffect(() => {
    fetchTasks()
    fetchTeamMembers()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks. Please try again.')
    }
  }

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team-members')
      if (!response.ok) {
        throw new Error('Failed to fetch team members')
      }
      const data = await response.json()
      setTeamMembers(data)
    } catch (error) {
      console.error('Error fetching team members:', error)
      toast.error('Failed to load team members. Please try again.')
    }
  }

  const columns: ColumnDef<Task>[] = [
    { accessorKey: "title", header: "Title" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === 'Completed' ? 'success' : status === 'In Progress' ? 'warning' : 'default'}>
            {status}
          </Badge>
        )
      },
    },
    { 
      accessorKey: "assignee.name", 
      header: "Assignee",
    },
    { 
      accessorKey: "dueDate", 
      header: "Due Date",
      cell: ({ row }) => {
        const date = row.getValue("dueDate") as Date | null
        return date ? format(new Date(date), "PPP") : "Not set"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleEditTask(task)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit task</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleDeleteTask(task.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete task</span>
            </Button>
          </div>
        )
      },
    },
  ]

  const filteredTasks = tasks.filter(task => {
    return (
      (filters.status === 'all' || task.status === filters.status) &&
      (filters.assignee === '' || task.assignee.name.toLowerCase().includes(filters.assignee.toLowerCase())) &&
      (!filters.dueDate || (task.dueDate && new Date(task.dueDate).toDateString() === filters.dueDate.toDateString()))
    )
  })

  const handleAddTask = async () => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
      if (!response.ok) {
        throw new Error('Failed to add task')
      }
      await fetchTasks()
      setIsAddTaskOpen(false)
      resetNewTask()
      toast.success('Task added successfully!')
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to add task. Please try again.')
    }
  }

  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setNewTask({
      title: task.title,
      status: task.status,
      assigneeId: task.assigneeId,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
    })
    setIsEditTaskOpen(true)
  }

  const handleUpdateTask = async () => {
    if (!currentTask) return
    try {
      const response = await fetch(`/api/tasks/${currentTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
      if (!response.ok) {
        throw new Error('Failed to update task')
      }
      const updatedTask = await response.json()
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
      setIsEditTaskOpen(false)
      resetNewTask()
      toast.success('Task updated successfully!')
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task. Please try again.')
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      await fetchTasks()
      toast.success('Task deleted successfully!')
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task. Please try again.')
    }
  }

  const resetNewTask = () => {
    setNewTask({
      title: '',
      status: 'To Do',
      assigneeId: '',
      dueDate: null,
    })
    setCurrentTask(null)
  }

  return (
    <Card className="w-full">
      <Toaster position="top-right" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Task List</CardTitle>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <TaskForm task={newTask} setTask={setNewTask} onSubmit={handleAddTask} teamMembers={teamMembers} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters({...filters, status: value})}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                placeholder="Filter by assignee"
                value={filters.assignee}
                onChange={(e) => setFilters({...filters, assignee: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <DatePickerDemo
                date={filters.dueDate}
                setDate={(date) => setFilters({...filters, dueDate: date})}
              />
            </div>
          </div>
          <DataTable columns={columns} data={filteredTasks} />
        </div>
      </CardContent>
      <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
        <DialogContent style={{ zIndex: 99 }}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm task={newTask} setTask={setNewTask} onSubmit={handleUpdateTask} teamMembers={teamMembers} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

type TaskFormProps = {
  task: Omit<Task, 'id' | 'assignee'>
  setTask: React.Dispatch<React.SetStateAction<Omit<Task, 'id' | 'assignee'>>>
  onSubmit: () => void
  teamMembers: TeamMember[]
}

function TaskForm({ task, setTask, onSubmit, teamMembers }: TaskFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          value={task.title}
          onChange={(e) => setTask({...task, title: e.target.value})}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Select
          value={task.status}
          onValueChange={(value) => setTask({...task, status: value as 'To Do' | 'In Progress' | 'Completed'})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="assignee" className="text-right">
          Assignee
        </Label>
        <Select
          value={task.assigneeId}
          onValueChange={(value) => setTask({...task, assigneeId: value})}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select assignee" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="taskDueDate" className="text-right">
          Due Date
        </Label>
        <div className="col-span-3">
          <DatePickerDemo
            date={task.dueDate ? new Date(task.dueDate) : null}
            setDate={(date) => setTask({...task, dueDate: date})}
          />
        </div>
      </div>
      <Button onClick={onSubmit} className="ml-auto">Submit</Button>
    </div>
  )
}

export default TaskList;

