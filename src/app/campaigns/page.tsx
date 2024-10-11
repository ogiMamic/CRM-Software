"use client"

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { PlusIcon, FilterIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateCampaignForm } from '@/components/CreateCampaignForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Campaign = {
  id: string
  name: string
  status: 'Active' | 'Inactive' | 'Draft'
  startDate: string
  endDate: string
  budget: number
  platform: 'Google Ads' | 'Meta Ads'
  roi: number
  costs: number
  channel: string
  assignee: string
  property: string
  workflow: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filters, setFilters] = useState({
    status: 'all',
    platform: 'all',
    assignee: '',
    property: '',
  })
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const fetchCampaigns = async () => {
      // Simulating an API call with setTimeout
      setTimeout(() => {
        const mockCampaigns: Campaign[] = [
          { id: '1', name: 'Summer Sale', status: 'Active', startDate: '2023-06-01', endDate: '2023-08-31', budget: 5000, platform: 'Google Ads', roi: 2.5, costs: 4000, channel: 'Search', assignee: 'John Doe', property: 'E-commerce Store', workflow: 'Planning > Design > Launch > Monitor' },
          { id: '2', name: 'Black Friday', status: 'Draft', startDate: '2023-11-24', endDate: '2023-11-27', budget: 10000, platform: 'Meta Ads', roi: 0, costs: 0, channel: 'Social', assignee: 'Jane Smith', property: 'Retail Store', workflow: 'Ideation > Approval > Setup' },
          { id: '3', name: 'Holiday Special', status: 'Inactive', startDate: '2022-12-01', endDate: '2022-12-31', budget: 7500, platform: 'Google Ads', roi: 3.2, costs: 7000, channel: 'Display', assignee: 'Mike Johnson', property: 'Online Marketplace', workflow: 'Completed' },
        ]
        setCampaigns(mockCampaigns)
      }, 1000)
    }

    fetchCampaigns()
  }, [])

  const filteredCampaigns = campaigns.filter(campaign => {
    return (
      (filters.status === 'all' || campaign.status === filters.status) &&
      (filters.platform === 'all' || campaign.platform === filters.platform) &&
      (filters.assignee === '' || campaign.assignee.toLowerCase().includes(filters.assignee.toLowerCase())) &&
      (filters.property === '' || campaign.property.toLowerCase().includes(filters.property.toLowerCase()))
    )
  })

  const activeCampaigns = filteredCampaigns.filter(campaign => campaign.status === 'Active')
  const inactiveCampaigns = filteredCampaigns.filter(campaign => campaign.status === 'Inactive')

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={[{ label: 'Campaigns', href: '/campaigns' }]} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <div className="flex space-x-2">
          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="mr-2 h-4 w-4" /> Filter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Campaigns</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters({...filters, status: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">Platform</Label>
                  <Select
                    value={filters.platform}
                    onValueChange={(value) => setFilters({...filters, platform: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Google Ads">Google Ads</SelectItem>
                      <SelectItem value="Meta Ads">Meta Ads</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assignee" className="text-right">Assignee</Label>
                  <Input
                    id="assignee"
                    value={filters.assignee}
                    onChange={(e) => setFilters({...filters, assignee: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="property" className="text-right">Property</Label>
                  <Input
                    id="property"
                    value={filters.property}
                    onChange={(e) => setFilters({...filters, property: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={() => setIsFilterDialogOpen(false)}>Apply Filters</Button>
            </DialogContent>
          </Dialog>
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
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>ROI Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add a chart or summary of ROI here */}
            <p>Average ROI: {(activeCampaigns.reduce((sum, campaign) => sum + campaign.roi, 0) / activeCampaigns.length).toFixed(2)}x</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add a chart or summary of costs here */}
            <p>Total Costs: ${activeCampaigns.reduce((sum, campaign) => sum + campaign.costs, 0).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add a chart or summary of channel performance here */}
            <ul>
              {Array.from(new Set(activeCampaigns.map(c => c.channel))).map(channel => (
                <li key={channel}>{channel}: {activeCampaigns.filter(c => c.channel === channel).length} campaigns</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}