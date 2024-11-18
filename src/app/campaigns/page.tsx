"use client"

import { useEffect, useState } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { PlusIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateCampaignForm } from '@/components/CreateCampaignForm'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Campaign } from '@prisma/client'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [assignees, setAssignees] = useState<string[]>([])
  const [properties, setProperties] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [activeTab, setActiveTab] = useState('manage')
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await fetch('/api/campaigns')
      const data = await response.json()
      setCampaigns(data)

      // Extract unique assignees and properties
      const uniqueAssignees = Array.from(new Set(data.map((c: Campaign) => c.assignee))) as string[];
      const uniqueProperties = Array.from(new Set(data.map((c: Campaign) => c.property))) as string[];
      setAssignees(uniqueAssignees);
      setProperties(uniqueProperties);
    }

    fetchCampaigns()
  }, [])

  const handleAddCampaign = async (newCampaign: Omit<Campaign, 'id' | 'createdAt'>) => {
    const response = await fetch('/api/campaigns/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCampaign),
    })
    const addedCampaign = await response.json()
    setCampaigns([...campaigns, addedCampaign])
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const quarterStart = new Date()
    quarterStart.setMonth(Math.floor(quarterStart.getMonth() / 3) * 3, 1)
    const isStartingThisQuarter = campaign.startDate >= quarterStart && campaign.startDate < new Date(quarterStart.getFullYear(), quarterStart.getMonth() + 3, 0)
    
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const isRecentlyCreated = campaign.createdAt >= thirtyDaysAgo

    const matchesSearch = searchTerm === '' || 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.property.toLowerCase().includes(searchTerm.toLowerCase())

    return (
      matchesSearch &&
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
              <CreateCampaignForm onSubmit={handleAddCampaign} />
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
          <div className="mb-4">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
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