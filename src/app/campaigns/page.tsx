"use client"

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { PlusIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateCampaignForm } from '@/components/CreateCampaignForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

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
  owner: string
  comments: number
  createdOn: string
  notes: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filters, setFilters] = useState({
    status: 'all',
    platform: 'all',
    assignee: 'all',
    property: 'all',
    startingThisQuarter: false,
    recentlyCreated: false,
  })
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [assignees, setAssignees] = useState<string[]>([])
  const [properties, setProperties] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [activeTab, setActiveTab] = useState('manage')

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const fetchCampaigns = async () => {
      // Simulating an API call with setTimeout
      setTimeout(() => {
        const mockCampaigns: Campaign[] = [
          { id: '1', name: 'Summer Sale', status: 'Active', startDate: '2023-06-01', endDate: '2023-08-31', budget: 5000, platform: 'Google Ads', roi: 2.5, costs: 4000, channel: 'Search', assignee: 'John Doe', property: 'E-commerce Store', workflow: 'Planning > Design > Launch > Monitor', owner: 'Vladimir Radosevic', comments: 0, createdOn: '2023-05-15', notes: '' },
          { id: '2', name: 'Black Friday', status: 'Draft', startDate: '2023-11-24', endDate: '2023-11-27', budget: 10000, platform: 'Meta Ads', roi: 0, costs: 0, channel: 'Social', assignee: 'Jane Smith', property: 'Retail Store', workflow: 'Ideation > Approval > Setup', owner: 'Roland Biczysko', comments: 2, createdOn: '2023-10-01', notes: 'Needs budget approval' },
          { id: '3', name: 'Holiday Special', status: 'Inactive', startDate: '2022-12-01', endDate: '2022-12-31', budget: 7500, platform: 'Google Ads', roi: 3.2, costs: 7000, channel: 'Display', assignee: 'Mike Johnson', property: 'Online Marketplace', workflow: 'Completed', owner: 'Felipe Del Campo', comments: 5, createdOn: '2022-11-15', notes: 'Very successful campaign' },
        ]
        setCampaigns(mockCampaigns)

        // Extract unique assignees and properties
        const uniqueAssignees = Array.from(new Set(mockCampaigns.map(c => c.assignee)))
        const uniqueProperties = Array.from(new Set(mockCampaigns.map(c => c.property)))
        setAssignees(uniqueAssignees)
        setProperties(uniqueProperties)
      }, 1000)
    }

    fetchCampaigns()
  }, [])

  const filteredCampaigns = campaigns.filter(campaign => {
    const quarterStart = new Date()
    quarterStart.setMonth(Math.floor(quarterStart.getMonth() / 3) * 3, 1)
    const isStartingThisQuarter = new Date(campaign.startDate) >= quarterStart && new Date(campaign.startDate) < new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0)
    
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const isRecentlyCreated = new Date(campaign.createdOn) >= thirtyDaysAgo

    return (
      (filters.status === 'all' || campaign.status === filters.status) &&
      (filters.platform === 'all' || campaign.platform === filters.platform) &&
      (filters.assignee === 'all' || campaign.assignee === filters.assignee) &&
      (filters.property === 'all' || campaign.property === filters.property) &&
      (!filters.startingThisQuarter || isStartingThisQuarter) &&
      (!filters.recentlyCreated || isRecentlyCreated)
    )
  })

  const pageCount = Math.ceil(filteredCampaigns.length / itemsPerPage)
  const paginatedCampaigns = filteredCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={[{ label: 'Campaigns', href: '/campaigns' }]} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <div className="flex space-x-2">
          <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="mr-2 h-4 w-4" /> Advanced filters ({Object.values(filters).filter(Boolean).length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
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
                  <Select
                    value={filters.assignee}
                    onValueChange={(value) => setFilters({...filters, assignee: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="property" className="text-right">Property</Label>
                  <Select
                    value={filters.property}
                    onValueChange={(value) => setFilters({...filters, property: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      {properties.map((property) => (
                        <SelectItem key={property} value={property}>{property}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="startingThisQuarter"
                    checked={filters.startingThisQuarter}
                    onCheckedChange={(checked) => setFilters({...filters, startingThisQuarter: checked as boolean})}
                  />
                  <label
                    htmlFor="startingThisQuarter"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Starting this quarter
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recentlyCreated"
                    checked={filters.recentlyCreated}
                    onCheckedChange={(checked) => setFilters({...filters, recentlyCreated: checked as boolean})}
                  />
                  <label
                    htmlFor="recentlyCreated"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Recently created
                  </label>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="manage">
          <DataTable columns={columns} data={paginatedCampaigns} />
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))}
                disabled={currentPage === pageCount}
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="calendar">
          {/* Implement calendar view here */}
          <p>Calendar view coming soon...</p>
        </TabsContent>
        <TabsContent value="tasks">
          {/* Implement tasks view here */}
          <p>Tasks view coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}