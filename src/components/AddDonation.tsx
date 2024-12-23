"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast, Toaster } from 'sonner'

type Donor = {
  id: string
  contact: {
    name: string
    email: string
  }
}

type DonationData = {
  donorId: string
  amount: string
  currency: string
  type: string
  status: string
  date: string
}

export function AddDonation() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [donationData, setDonationData] = useState<DonationData>({
    donorId: '',
    amount: '',
    currency: 'USD',
    type: 'One-time',
    status: 'Completed',
    date: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch('/api/donors')
        const data = await response.json()
        setDonors(data)
      } catch (error) {
        console.error('Failed to fetch donors:', error)
        toast.error('Failed to load existing donors')
      }
    }
    fetchDonors()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...donationData,
          amount: parseFloat(donationData.amount),
        }),
      })
      const donation = await response.json()
      if (donation.error) throw new Error(donation.error)

      toast.success('Donation added successfully!')
      // Reset form
      setDonationData({
        donorId: '',
        amount: '',
        currency: 'USD',
        type: 'One-time',
        status: 'Completed',
        date: new Date().toISOString().split('T')[0],
      })
    } catch (error) {
      console.error('Error adding donation:', error)
      toast.error('Failed to add donation: ' + (error as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold">Add Donation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="donorSelect">Select Donor</Label>
          <Select 
            value={donationData.donorId}
            onValueChange={(value) => setDonationData(prev => ({ ...prev, donorId: value }))}
          >
            <SelectTrigger id="donorSelect">
              <SelectValue placeholder="Select a donor" />
            </SelectTrigger>
            <SelectContent>
              {donors.map(donor => (
                <SelectItem key={donor.id} value={donor.id}>
                  {donor.contact.name} ({donor.contact.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input 
              id="amount" 
              type="number" 
              value={donationData.amount}
              onChange={e => setDonationData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input 
              id="currency" 
              value={donationData.currency}
              onChange={e => setDonationData(prev => ({ ...prev, currency: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donationType">Donation Type</Label>
            <Select 
              value={donationData.type}
              onValueChange={(value) => setDonationData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger id="donationType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="One-time">One-time</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="donationStatus">Donation Status</Label>
            <Select 
              value={donationData.status}
              onValueChange={(value) => setDonationData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger id="donationStatus">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={donationData.date}
              onChange={e => setDonationData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
        </div>

        <Button type="submit">Add Donation</Button>
      </form>
    </div>
  )
}

