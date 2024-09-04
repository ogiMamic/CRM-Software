import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function TaskManager() {
  const [tasks, setTasks] = useState<any[]>([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
    if (error) console.error('Error fetching tasks:', error)
    else setTasks(data || [])
  }

  async function addTask() {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ description: newTask, status: 'pending' }])
    if (error) console.error('Error adding task:', error)
    else {
      setNewTask('')
      fetchTasks()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
        />
        <Button onClick={addTask}>Add Task</Button>
        {tasks.map(task => (
          <div key={task.id}>{task.description} - {task.status}</div>
        ))}
      </CardContent>
    </Card>
  )
}