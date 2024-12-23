"use client"

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast, Toaster } from 'sonner'

type Donor = {
  id: string
  contact: {
    name: string
    email: string
    phone: string
    company: string
    country: string
  }
  type: string
  status: string
  donations: {
    amount: number
    type: string
    date: string
  }[]
}

export function DonorList() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    minAmount: '',
    country: '',
  })

  useEffect(() => {
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    try {
      const response = await fetch('/api/donors')
      const data = await response.json()
      setDonors(data)
    } catch (error) {
      console.error('Failed to fetch donors:', error)
      toast.error('Failed to load donors')
    }
  }

  const handleStatusChange = async (donorId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/donors/${donorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update donor status')
      }
      toast.success('Donor status updated successfully')
      fetchDonors() // Refresh the donor list
    } catch (error) {
      console.error('Error updating donor status:', error)
      toast.error(`Failed to update donor status: ${(error as Error).message}`)
    }
  }

  const columns: ColumnDef<Donor>[] = [
    { accessorKey: "contact.name", header: "Name" },
    { accessorKey: "contact.email", header: "Email" },
    { accessorKey: "type", header: "Donor Type" },
    { 
      accessorKey: "status", 
      header: "Status",
      cell: ({ row }) => {
        const donor = row.original
        return (
          <Select
            value={donor.status}
            onValueChange={(value) => handleStatusChange(donor.id, value)}
          >
            <SelectTrigger>
              <SelectValue>{donor.status}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    { 
      accessorKey: "totalDonations",
      header: "Total Donations",
      cell: ({ row }) => {
        const donations = row.original.donations
        const total = donations.reduce((sum, donation) => sum + Number(donation.amount), 0)
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(total)
      },
    },
    { 
      accessorKey: "lastDonation",
      header: "Last Donation",
      cell: ({ row }) => {
        const donations = row.original.donations
        if (donations.length === 0) return "No donations"
        const lastDonation = new Date(Math.max(...donations.map(d => new Date(d.date).getTime())))
        return lastDonation.toLocaleDateString()
      },
    },
    { accessorKey: "contact.country", header: "Country" },
  ]

  const filteredDonors = donors.filter(donor => {
    return (
      (filters.type === 'all' || donor.type === filters.type) &&
      (filters.status === 'all' || donor.status === filters.status) &&
      (filters.minAmount === '' || donor.donations.reduce((sum, d) => sum + d.amount, 0) >= parseFloat(filters.minAmount)) &&
      (filters.country === '' || (donor.contact.country && donor.contact.country.toLowerCase().includes(filters.country.toLowerCase())))
    )
  })

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold">Donor List</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="type">Donor Type</Label>
          <Select 
            value={filters.type} 
            onValueChange={(value) => setFilters({...filters, type: value})}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Corporate">Corporate</SelectItem>
              <SelectItem value="Foundation">Foundation</SelectItem>
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
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="minAmount">Min Total Donation</Label>
          <Input
            id="minAmount"
            type="number"
            placeholder="Min amount"
            value={filters.minAmount}
            onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="Country"
            value={filters.country}
            onChange={(e) => setFilters({...filters, country: e.target.value})}
          />
        </div>
      </div>
      <DataTable columns={columns} data={filteredDonors} />
    </div>
  )
}

