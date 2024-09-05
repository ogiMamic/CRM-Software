import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'sonner'

export function CustomReports() {
  const [formData, setFormData] = useState({
    reportName: '',
    dateRange: '',
    metrics: [] as string[],
    dimensions: [] as string[],
  })

  const handleMetricChange = (metric: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }))
  }

  const handleDimensionChange = (dimension: string) => {
    setFormData(prev => ({
      ...prev,
      dimensions: prev.dimensions.includes(dimension)
        ? prev.dimensions.filter(d => d !== dimension)
        : [...prev.dimensions, dimension]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Custom report configuration:', formData)
    toast.success('Custom report created successfully!')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Create Custom Report</h2>
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportName">Report Name</Label>
              <Input
                id="reportName"
                value={formData.reportName}
                onChange={(e) => setFormData({...formData, reportName: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select onValueChange={(value) => setFormData({...formData, dateRange: value})}>
                <SelectTrigger id="dateRange">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="lastMonth">Last month</SelectItem>
                  <SelectItem value="lastYear">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Metrics</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Clicks', 'Impressions', 'Conversions', 'Cost'].map((metric) => (
                  <div key={metric} className="flex items-center space-x-2">
                    <Checkbox
                      id={`metric-${metric}`}
                      checked={formData.metrics.includes(metric)}
                      onCheckedChange={() => handleMetricChange(metric)}
                    />
                    <Label htmlFor={`metric-${metric}`}>{metric}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Dimensions</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Date', 'Campaign', 'Ad Group', 'Device'].map((dimension) => (
                  <div key={dimension} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dimension-${dimension}`}
                      checked={formData.dimensions.includes(dimension)}
                      onCheckedChange={() => handleDimensionChange(dimension)}
                    />
                    <Label htmlFor={`dimension-${dimension}`}>{dimension}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit">Create Report</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}