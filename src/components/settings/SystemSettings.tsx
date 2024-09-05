import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'

export function SystemSettings() {
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
    twoFactorAuth: false,
    sessionTimeout: '30',
  })

  const handleSave = () => {
    // Here you would typically save these settings to your backend
    console.log("Saved system settings:", settings)
    toast.success('System settings saved successfully!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select
            value={settings.language}
            onValueChange={(value) => setSettings({...settings, language: value})}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
              <SelectItem value="de">Deutsch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
          />
          <Label htmlFor="notifications">Enable Notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="twoFactorAuth"
            checked={settings.twoFactorAuth}
            onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
          />
          <Label htmlFor="twoFactorAuth">Enable Two-Factor Authentication</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
          <Input
            id="sessionTimeout"
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
          />
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </CardContent>
    </Card>
  )
}