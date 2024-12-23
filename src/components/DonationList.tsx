"use client"

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast, Toaster } from 'sonner'

type Donation = {
  id: string
  amount: number
  currency: string
  type: string
  status: string
  donor: {
    contact: {
      name: string
    }
  }
  date: Date
  campaign: string | null
}

export function DonationList() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    minAmount: '',
    campaign: '',
  })

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      const response = await fetch('/api/donations')
      const data = await response.json()
      setDonations(data)
    } catch (error) {
      console.error('Failed to fetch donations:', error)
      toast.error('Failed to load donations')
    }
  }

  const handleStatusChange = async (donationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update donation status')
      }
      toast.success('Donation status updated successfully')
      fetchDonations() // Refresh the donation list
    } catch (error) {
      console.error('Error updating donation status:', error)
      toast.error(`Failed to update donation status: ${(error as Error).message}`)
    }
  }

  const columns: ColumnDef<Donation>[] = [
    { accessorKey: "donor.contact.name", header: "Donor Name" },
    { 
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const currency = row.original.currency
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currency,
        }).format(amount)
      },
    },
    { accessorKey: "type", header: "Donation Type" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const donation = row.original
        return (
          <Select
            value={donation.status}
            onValueChange={(value) => handleStatusChange(donation.id, value)}
          >
            <SelectTrigger>
              <SelectValue>{donation.status}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    { 
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        return new Date(row.getValue("date")).toLocaleDateString()
      },
    },
    { accessorKey: "campaign", header: "Campaign" },
  ]

  const filteredDonations = donations.filter(donation => {
    return (
      (filters.type === 'all' || donation.type === filters.type) &&
      (filters.status === 'all' || donation.status === filters.status) &&
      (filters.minAmount === '' || donation.amount >= parseFloat(filters.minAmount)) &&
      (filters.campaign === '' || (donation.campaign && donation.campaign.toLowerCase().includes(filters.campaign.toLowerCase())))
    )
  })

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold">Donation List</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="type">Donation Type</Label>
          <Select 
            value={filters.type} 
            onValueChange={(value) => setFilters({...filters, type: value})}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="One-time">One-time</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => setFilters({...filters, status: value})}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="minAmount">Min Amount</Label>
          <Input
            id="minAmount"
            type="number"
            placeholder="Min amount"
            value={filters.minAmount}
            onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="campaign">Campaign</Label>
          <Input
            id="campaign"
            placeholder="Campaign"
            value={filters.campaign}
            onChange={(e) => setFilters({...filters, campaign: e.target.value})}
          />
        </div>
      </div>
      <DataTable columns={columns} data={filteredDonations} />
    </div>
  )
}

