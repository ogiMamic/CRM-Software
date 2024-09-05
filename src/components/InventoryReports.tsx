import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type InventoryData = {
  month: string
  consumption: number
  availability: number
}

export function InventoryReports() {
  const [data, setData] = useState<InventoryData[]>([])

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockData: InventoryData[] = [
        { month: "Jan", consumption: 65, availability: 80 },
        { month: "Feb", consumption: 59, availability: 75 },
        { month: "Mar", consumption: 80, availability: 70 },
        { month: "Apr", consumption: 81, availability: 85 },
        { month: "May", consumption: 56, availability: 90 },
        { month: "Jun", consumption: 55, availability: 88 },
      ]
      setData(mockData)
    }, 1000)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Inventory Reports</h2>
      <Card>
        <CardHeader>
          <CardTitle>Inventory Consumption and Availability Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consumption" fill="#8884d8" name="Consumption" />
                <Bar dataKey="availability" fill="#82ca9d" name="Availability" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}