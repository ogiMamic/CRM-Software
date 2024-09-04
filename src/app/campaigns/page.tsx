"use client"

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

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

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Create Campaign
        </Button>
      </div>
      <DataTable columns={columns} data={campaigns} />
    </div>
  )
}