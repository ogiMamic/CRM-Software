import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'

export function TaskNotifications() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    deadlineReminder: '1 day',
    completionNotification: true,
    notificationEmail: '',
  })

  const handleSave = () => {
    // Here you would typically save these settings to your backend
    console.log("Saved notification settings:", settings)
    toast.success('Notification settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Task Notifications</h2>
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
            />
            <Label htmlFor="email-notifications">Enable email notifications</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline-reminder">Deadline Reminder</Label>
            <Select 
              value={settings.deadlineReminder} 
              onValueChange={(value) => setSettings({...settings, deadlineReminder: value})}
            >
              <SelectTrigger id="deadline-reminder">
                <SelectValue placeholder="Select reminder time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1 hour">1 hour before</SelectItem>
                <SelectItem value="1 day">1 day before</SelectItem>
                <SelectItem value="2 days">2 days before</SelectItem>
                <SelectItem value="1 week">1 week before</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="completion-notification"
              checked={settings.completionNotification}
              onCheckedChange={(checked) => setSettings({...settings, completionNotification: checked})}
            />
            <Label htmlFor="completion-notification">Notify when tasks are completed</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notification-email">Notification Email</Label>
            <Input
              id="notification-email"
              type="email"
              placeholder="Enter your email"
              value={settings.notificationEmail}
              onChange={(e) => setSettings({...settings, notificationEmail: e.target.value})}
            />
          </div>
          <Button onClick={handleSave}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}