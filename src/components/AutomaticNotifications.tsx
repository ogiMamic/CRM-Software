import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'

export function AutomaticNotifications() {
  const [settings, setSettings] = useState({
    enabled: false,
    frequency: 'weekly',
    recipients: '',
  })

  const handleSave = () => {
    // Here you would typically save these settings to your backend
    console.log("Saved notification settings:", settings)
    toast.success('Donor notification settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Automatic Donor Notifications</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="notifications-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => setSettings({...settings, enabled: checked})}
          />
          <Label htmlFor="notifications-enabled">Enable automatic email reports</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="frequency">Report Frequency</Label>
          <Select 
            value={settings.frequency} 
            onValueChange={(value) => setSettings({...settings, frequency: value})}
          >
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipients">Recipients (comma-separated emails)</Label>
          <Input
            id="recipients"
            value={settings.recipients}
            onChange={(e) => setSettings({...settings, recipients: e.target.value})}
            placeholder="email1@example.com, email2@example.com"
          />
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}