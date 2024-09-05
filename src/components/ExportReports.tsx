import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'

const reportTypes = [
  "Google Ads Performance",
  "Meta Ads Performance",
  "Google Analytics Overview",
  "Custom Report 1",
  "Custom Report 2",
]

const exportFormats = ["PDF", "CSV", "Excel"]

export function ExportReports() {
  const [selectedReport, setSelectedReport] = useState('')
  const [exportFormat, setExportFormat] = useState('')

  const handleExport = () => {
    if (!selectedReport || !exportFormat) {
      toast.error('Please select both a report and an export format.')
      return
    }
    console.log(`Exporting ${selectedReport} as ${exportFormat}`)
    toast.success(`${selectedReport} exported successfully as ${exportFormat}!`)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Export Reports</h2>
      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reportType">Select Report</Label>
            <Select onValueChange={setSelectedReport}>
              <SelectTrigger id="reportType">
                <SelectValue placeholder="Choose a report" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((report) => (
                  <SelectItem key={report} value={report}>{report}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exportFormat">Export Format</Label>
            <Select onValueChange={setExportFormat}>
              <SelectTrigger id="exportFormat">
                <SelectValue placeholder="Choose a format" />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => (
                  <SelectItem key={format} value={format}>{format}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleExport} className="w-full">Export Report</Button>
        </CardContent>
      </Card>
    </div>
  )
}