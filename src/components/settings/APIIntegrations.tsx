import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from 'sonner'

type Integration = {
  name: string
  enabled: boolean
  apiKey: string
}

export function APIIntegrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { name: 'Google Ads', enabled: false, apiKey: '' },
    { name: 'Meta Ads', enabled: false, apiKey: '' },
    { name: 'Google Analytics', enabled: false, apiKey: '' },
  ])

  const handleToggle = (index: number) => {
    const newIntegrations = [...integrations]
    newIntegrations[index].enabled = !newIntegrations[index].enabled
    setIntegrations(newIntegrations)
  }

  const handleApiKeyChange = (index: number, value: string) => {
    const newIntegrations = [...integrations]
    newIntegrations[index].apiKey = value
    setIntegrations(newIntegrations)
  }

  const handleSave = () => {
    // Here you would typically save these settings to your backend
    console.log("Saved API integrations:", integrations)
    toast.success('API integrations saved successfully!')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {integrations.map((integration, index) => (
            <div key={integration.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${integration.name}-toggle`}>{integration.name}</Label>
                <Switch
                  id={`${integration.name}-toggle`}
                  checked={integration.enabled}
                  onCheckedChange={() => handleToggle(index)}
                />
              </div>
              {integration.enabled && (
                <div className="space-y-2">
                  <Label htmlFor={`${integration.name}-api-key`}>API Key</Label>
                  <Input
                    id={`${integration.name}-api-key`}
                    type="password"
                    value={integration.apiKey}
                    onChange={(e) => handleApiKeyChange(index, e.target.value)}
                    placeholder="Enter API Key"
                  />
                </div>
              )}
            </div>
          ))}
          <Button onClick={handleSave}>Save Integrations</Button>
        </div>
      </CardContent>
    </Card>
  )
}