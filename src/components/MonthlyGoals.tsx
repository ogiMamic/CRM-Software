import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Goal = {
  month: string
  target: number
  current: number
}

export function MonthlyGoals() {
  const [goals, setGoals] = useState<Goal[]>([])

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockGoals: Goal[] = [
        { month: "January", target: 10000, current: 8500 },
        { month: "February", target: 12000, current: 11000 },
        { month: "March", target: 15000, current: 7500 },
      ]
      setGoals(mockGoals)
    }, 1000)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Monthly Donor Goals</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.month}>
            <CardHeader>
              <CardTitle>{goal.month}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Progress</span>
                  <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Current: ${goal.current}</span>
                  <span>Target: ${goal.target}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}