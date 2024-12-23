"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { DonorList } from '@/components/DonorList'
import { AddDonor } from '@/components/AddDonor'
import { AddDonation } from '@/components/AddDonation'
import { MonthlyGoals } from '@/components/MonthlyGoals'
import { AutomaticNotifications } from '@/components/AutomaticNotifications'
import { DonationList } from '@/components/DonationList'

export default function DonorsPage() {
  const [activeTab, setActiveTab] = useState("list")

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={[{ label: 'Donors', href: '/donors' }]} />
      <h1 className="text-3xl font-bold mb-6">Donors</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="list">Donor List</TabsTrigger>
          <TabsTrigger value="add">Add Donor</TabsTrigger>
          <TabsTrigger value="addDonation">Add Donation</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="goals">Monthly Goals</TabsTrigger>
          <TabsTrigger value="notifications">Automatic Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <DonorList />
        </TabsContent>
        <TabsContent value="add">
          <AddDonor />
        </TabsContent>
        <TabsContent value="addDonation">
          <AddDonation />
        </TabsContent>
        <TabsContent value="donations">
          <DonationList />
        </TabsContent>
        <TabsContent value="goals">
          <MonthlyGoals />
        </TabsContent>
        <TabsContent value="notifications">
          <AutomaticNotifications />
        </TabsContent>
      </Tabs>
    </div>
  )
}

