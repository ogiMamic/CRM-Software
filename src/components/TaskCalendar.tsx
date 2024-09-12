import React, { useState, useEffect } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

type Task = {
  id: string
  title: string
  status: 'To Do' | 'In Progress' | 'Completed'
  assignee: string
  dueDate: Date
}

export function TaskCalendar() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    status: 'To Do',
    assignee: '',
    dueDate: new Date(),
  })

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks).map((task: Task) => ({
        ...task,
        dueDate: new Date(task.dueDate)
      })))
    }
  }, [])

  useEffect(() => {
    // Save tasks to localStorage whenever tasks change
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const tasksForSelectedDate = tasks.filter(task => 
    task.dueDate.toDateString() === selectedDate.toDateString()
  )

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignee) {
      toast.error("Please fill in all fields")
      return
    }
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      dueDate: selectedDate
    }
    setTasks([...tasks, task])
    setIsAddTaskOpen(false)
    setNewTask({
      title: '',
      status: 'To Do',
      assignee: '',
      dueDate: new Date(),
    })
    toast.success("Task added successfully")
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    toast.success("Task deleted successfully")
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Calendar</h2>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({...newTask, status: value as 'To Do' | 'In Progress' | 'Completed'})}
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
                <Label htmlFor="assignee" className="text-right">Assignee</Label>
                <Input
                  id="assignee"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              date={selectedDate}
              onDateChange={handleDateSelect}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks for {selectedDate.toDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length > 0 ? (
              <ul className="space-y-2">
                {tasksForSelectedDate.map(task => (
                  <li key={task.id} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <div>
                      <span className="font-medium">{task.title}</span>
                      <span className="text-sm text-gray-500 ml-2">({task.assignee})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        task.status === 'Completed' ? 'success' :
                        task.status === 'In Progress' ? 'warning' : 'default'
                      }>
                        {task.status}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No tasks scheduled for this date.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}