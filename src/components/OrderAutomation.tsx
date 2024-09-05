import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function OrderAutomation() {
  const [autoNotify, setAutoNotify] = useState(false)
  const [threshold, setThreshold] = useState("10")

  const handleSave = () => {
    // Here you would typically save these settings to your backend
    console.log("Saved automation settings:", { autoNotify, threshold })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Order Automation</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-notify"
            checked={autoNotify}
            onCheckedChange={setAutoNotify}
          />
          <Label htmlFor="auto-notify">Automatically notify logistics center for new orders</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="threshold">Notification threshold (number of items)</Label>
          <Input
            id="threshold"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}