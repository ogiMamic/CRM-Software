import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusIcon, Pencil, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Task = {
  id: string
  title: string
  status: 'To Do' | 'In Progress' | 'Completed'
  assignee: string
  dueDate: string
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filters, setFilters] = useState({
    status: 'all',
    assignee: '',
    dueDate: '',
  })
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: '',
    status: 'To Do' as const,
    assignee: '',
    dueDate: '',
  })

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockTasks: Task[] = [
        { id: "1", title: "Create marketing plan", status: "In Progress", assignee: "John Doe", dueDate: "2023-12-15" },
        { id: "2", title: "Update website content", status: "To Do", assignee: "Jane Smith", dueDate: "2023-12-20" },
        { id: "3", title: "Prepare quarterly report", status: "Completed", assignee: "Mike Johnson", dueDate: "2023-12-10" },
        { id: "4", title: "Client meeting", status: "To Do", assignee: "John Doe", dueDate: "2023-12-18" },
        { id: "5", title: "Team brainstorming session", status: "In Progress", assignee: "Jane Smith", dueDate: "2023-12-22" },
      ]
      setTasks(mockTasks)
    }, 1000)
  }, [])

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
    { accessorKey: "assignee", header: "Assignee" },
    { accessorKey: "dueDate", header: "Due Date" },
    {
      id: "actions",
      cell: ({ row }) => {
        const task = row.original
        return (
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleEditTask(task)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleDeleteTask(task.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const filteredTasks = tasks.filter(task => {
    return (
      (filters.status === 'all' || task.status === filters.status) &&
      (filters.assignee === '' || task.assignee.toLowerCase().includes(filters.assignee.toLowerCase())) &&
      (filters.dueDate === '' || task.dueDate === filters.dueDate)
    )
  })

  const handleAddTask = () => {
    const task: Task = {
      id: (tasks.length + 1).toString(),
      ...newTask,
    }
    setTasks([...tasks, task])
    setIsAddTaskOpen(false)
    resetNewTask()
    toast.success('Task added successfully!')
  }

  const handleEditTask = (task: Task) => {
    setCurrentTask(task)
    setNewTask(task)
    setIsEditTaskOpen(true)
  }

  const handleUpdateTask = () => {
    if (!currentTask) return
    const updatedTasks = tasks.map(task => 
      task.id === currentTask.id ? { ...task, ...newTask } : task
    )
    setTasks(updatedTasks)
    setIsEditTaskOpen(false)
    resetNewTask()
    toast.success('Task updated successfully!')
  }

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id)
    setTasks(updatedTasks)
    toast.success('Task deleted successfully!')
  }

  const resetNewTask = () => {
    setNewTask({
      title: '',
      status: 'To Do',
      assignee: '',
      dueDate: '',
    })
    setCurrentTask(null)
  }

  return (
    <Card className="w-full">
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
            <TaskForm task={newTask} setTask={setNewTask} onSubmit={handleAddTask} />
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
              <Input
                id="dueDate"
                type="date"
                value={filters.dueDate}
                onChange={(e) => setFilters({...filters, dueDate: e.target.value})}
              />
            </div>
          </div>
          <DataTable columns={columns} data={filteredTasks} />
        </div>
      </CardContent>
      <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm task={newTask} setTask={setNewTask} onSubmit={handleUpdateTask} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

type TaskFormProps = {
  task: Omit<Task, 'id'>
  setTask: React.Dispatch<React.SetStateAction<Omit<Task, 'id'>>>
  onSubmit: () => void
}

function TaskForm({ task, setTask, onSubmit }: TaskFormProps) {
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
        <Input
          id="assignee"
          value={task.assignee}
          onChange={(e) => setTask({...task, assignee: e.target.value})}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dueDate" className="text-right">
          Due Date
        </Label>
        <Input
          id="dueDate"
          type="date"
          value={task.dueDate}
          onChange={(e) => setTask({...task, dueDate: e.target.value})}
          className="col-span-3"
        />
      </div>
      <Button onClick={onSubmit} className="ml-auto">Submit</Button>
    </div>
  )
}