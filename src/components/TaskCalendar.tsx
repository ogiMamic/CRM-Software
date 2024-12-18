"use client"

import React, { useState, useEffect } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from 'lucide-react'
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AlertDialogOverlay } from "@/components/ui/alert-dialog"

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

export function TaskCalendar() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
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
      setTasks(data.map((task: Task) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null
      })))
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

  const tasksForSelectedDate = tasks.filter(task => 
    task.dueDate && task.dueDate.toDateString() === selectedDate.toDateString()
  )

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.assigneeId) {
      toast.error("Please fill in all fields")
      return
    }
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...newTask, dueDate: selectedDate}),
      })
      if (!response.ok) {
        throw new Error('Failed to add task')
      }
      await fetchTasks()
      setIsAddTaskOpen(false)
      setNewTask({
        title: '',
        status: 'To Do',
        assigneeId: '',
        dueDate: null,
      })
      toast.success("Task added successfully")
    } catch (error) {
      console.error('Error adding task:', error)
      toast.error('Failed to add task. Please try again.')
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return

    try {
      const response = await fetch(`/api/tasks/${taskToDelete}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete task')
      }
      await fetchTasks()
      toast.success("Task deleted successfully")
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task. Please try again.')
    } finally {
      setIsDeleteConfirmOpen(false)
      setTaskToDelete(null)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
    }
  }

  const AlertDialogWithOverlay = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof AlertDialog>
  >((props, ref) => (
    <AlertDialog {...props}>
      <AlertDialogOverlay className="fixed inset-0 bg-black/50 z-[9999]" />
      {props.children}
    </AlertDialog>
  ));
  AlertDialogWithOverlay.displayName = "AlertDialogWithOverlay";

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
          <DialogPortal>
            <DialogOverlay className="fixed inset-0 bg-black/50 z-[9999]" />
            <DialogContent className="fixed left-[50%] top-[50%] z-[10000] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-md bg-background p-6 shadow-lg" onMouseDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
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
                    <SelectContent className="z-[10001]">
                      <SelectItem value="To Do">To Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assignee" className="text-right">Assignee</Label>
                  <Select
                    value={newTask.assigneeId}
                    onValueChange={(value) => setNewTask({...newTask, assigneeId: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent className="z-[10001]">
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTask}>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
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
                      <span className="text-sm text-gray-500 ml-2">({task.assignee.name})</span>
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
      <AlertDialogWithOverlay open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent className="fixed left-[50%] top-[50%] z-[10000] w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-md bg-background p-6 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogWithOverlay>
    </div>
  )
}

