"use client"

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type DonationActivity = {
  type: 'donation'
  name: string
  amount: number
  date: string
}

type TaskActivity = {
  type: 'task'
  title: string
  status: string
  assignee: string
  dueDate: string | null
}

type Activity = DonationActivity | TaskActivity

export function RecentTasksNotifications() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/recent-activities')
        if (!response.ok) {
          throw new Error('Failed to fetch recent activities')
        }
        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.error('Error fetching recent activities:', error)
      }
    }

    fetchActivities()
  }, [])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />
            <AvatarFallback>
              {activity.type === 'donation' ? activity.name.slice(0, 2).toUpperCase() : 'AA'}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            {activity.type === 'donation' ? (
              <>
                <p className="text-sm font-medium leading-none">New donor: {activity.name}</p>
                <p className="text-sm text-muted-foreground">
                  Donated ${activity.amount.toFixed(2)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  Status: {activity.status} | Assignee: {activity.assignee}
                </p>
                {activity.dueDate && (
                  <p className="text-sm text-muted-foreground">
                    Due: {new Date(activity.dueDate).toLocaleDateString()}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="ml-auto font-medium">
            {activity.type === 'donation' 
              ? getTimeAgo(activity.date)
              : (activity.dueDate ? getTimeAgo(activity.dueDate) : 'No due date')}
          </div>
        </div>
      ))}
    </div>
  )
}

