import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrderReports() {
  // In a real application, you would fetch this data from your backend
  const deliveryRate = 95
  const returnRate = 3

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Order Reports</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">{deliveryRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Return Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">{returnRate}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}