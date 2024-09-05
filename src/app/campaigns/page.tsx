"use client"

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateCampaignForm } from '@/components/CreateCampaignForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'

type Campaign = {
  id: string
  name: string
  status: 'Active' | 'Inactive' | 'Draft'
  startDate: string
  endDate: string
  budget: number
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const fetchCampaigns = async () => {
      // Simulating an API call with setTimeout
      setTimeout(() => {
        const mockCampaigns: Campaign[] = [
          { id: '1', name: 'Summer Sale', status: 'Active', startDate: '2023-06-01', endDate: '2023-08-31', budget: 5000 },
          { id: '2', name: 'Black Friday', status: 'Draft', startDate: '2023-11-24', endDate: '2023-11-27', budget: 10000 },
          { id: '3', name: 'Holiday Special', status: 'Inactive', startDate: '2022-12-01', endDate: '2022-12-31', budget: 7500 },
        ]
        setCampaigns(mockCampaigns)
      }, 1000)
    }

    fetchCampaigns()
  }, [])

  const activeCampaigns = campaigns.filter(campaign => campaign.status === 'Active')
  const inactiveCampaigns = campaigns.filter(campaign => campaign.status === 'Inactive')

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={[{ label: 'Campaigns', href: '/campaigns' }]} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <CreateCampaignForm onSubmit={(newCampaign) => {
              setCampaigns([...campaigns, { ...newCampaign, id: String(campaigns.length + 1) }])
            }} />
          </DialogContent>
        </Dialog>
      </div>
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Campaigns</TabsTrigger>
          <TabsTrigger value="history">Campaign History</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <DataTable columns={columns} data={activeCampaigns} />
        </TabsContent>
        <TabsContent value="history">
          <DataTable columns={columns} data={inactiveCampaigns} />
        </TabsContent>
      </Tabs>
    </div>
  )
}