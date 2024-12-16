"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskList } from '@/components/TaskList'
import { TaskCalendar } from '@/components/TaskCalendar'
import { TaskNotifications } from '@/components/TaskNotifications'
import { TeamManagement } from '@/components/TeamManagement'

export default function TaskManagementPage() {
  const [activeTab, setActiveTab] = useState("list")

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Task Management</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="list">Task List</TabsTrigger>
          <TabsTrigger value="calendar">Task Calendar</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="team">Team Management</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <TaskList />
        </TabsContent>
        <TabsContent value="calendar">
          <TaskCalendar />
        </TabsContent>
        <TabsContent value="notifications">
          <TaskNotifications />
        </TabsContent>
        <TabsContent value="team">
          <TeamManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

