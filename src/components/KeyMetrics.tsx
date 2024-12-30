"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, ShoppingCart, BarChart } from 'lucide-react'

type NewContactsData = {
  newContacts: number
  percentageIncrease: string
}

type TotalDonationsData = {
  totalDonations: number
  percentageIncrease: string
}

export function KeyMetrics() {
  const [newContactsData, setNewContactsData] = useState<NewContactsData | null>(null)
  const [totalDonationsData, setTotalDonationsData] = useState<TotalDonationsData | null>(null)

  useEffect(() => {
    const fetchNewContactsData = async () => {
      try {
        const response = await fetch('/api/metrics/new-contacts')
        if (!response.ok) {
          throw new Error('Failed to fetch new contacts data')
        }
        const data = await response.json()
        setNewContactsData(data)
      } catch (error) {
        console.error('Error fetching new contacts data:', error)
      }
    }

    const fetchTotalDonationsData = async () => {
      try {
        const response = await fetch('/api/metrics/total-donations')
        if (!response.ok) {
          throw new Error('Failed to fetch total donations data')
        }
        const data = await response.json()
        setTotalDonationsData(data)
      } catch (error) {
        console.error('Error fetching total donations data:', error)
      }
    }

    fetchNewContactsData()
    fetchTotalDonationsData()
  }, [])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Contacts</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{newContactsData?.newContacts || 0}</div>
          <p className="text-xs text-muted-foreground">
            +{newContactsData?.percentageIncrease || '0'}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalDonationsData?.totalDonations.toFixed(2) || '0.00'}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalDonationsData && parseFloat(totalDonationsData.percentageIncrease) >= 0 ? '+' : ''}
            {totalDonationsData?.percentageIncrease || '0'}% from last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Number of Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-muted-foreground">+201 since last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">2 ending this week</p>
        </CardContent>
      </Card>
    </>
  )
}

