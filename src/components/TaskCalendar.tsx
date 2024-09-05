import React, { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { format, addMonths, subMonths } from "date-fns"

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
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    status: 'To Do',
    assignee: '',
    dueDate: new Date(),
  })

  const tasksForSelectedDate = tasks.filter(task => 
    task.dueDate.toDateString() === selectedDate.toDateString()
  )

  const handleAddTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
    }
    setTasks([...tasks, task])
    setIsAddTaskOpen(false)
    setNewTask({
      title: '',
      status: 'To Do',
      assignee: '',
      dueDate: new Date(),
    })
  }

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={format(newTask.dueDate, 'yyyy-MM-dd')}
                  onChange={(e) => setNewTask({...newTask, dueDate: new Date(e.target.value)})}
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
            <CardTitle className="flex justify-between items-center">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>{format(currentMonth, 'MMMM yyyy')}</span>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length > 0 ? (
              <ul className="space-y-2">
                {tasksForSelectedDate.map(task => (
                  <li key={task.id} className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <span>{task.title}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{task.assignee}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
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