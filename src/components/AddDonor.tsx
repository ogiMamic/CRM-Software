"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast, Toaster } from 'sonner'

type Contact = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  country: string
  county: string
}

type FormData = {
  contactId: string
  newContact: {
    name: string
    email: string
    phone: string
    company: string
    country: string
    county: string
  }
  type: string
  status: string
  notes: string
  initialDonation: {
    amount: string
    currency: string
    type: string
    status: string
    date: string
  }
}

export function AddDonor() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [formData, setFormData] = useState<FormData>({
    contactId: '',
    newContact: {
      name: '',
      email: '',
      phone: '',
      company: '',
      country: '',
      county: '',
    },
    type: '',
    status: 'Active',
    notes: '',
    initialDonation: {
      amount: '',
      currency: 'USD',
      type: 'One-time',
      status: 'Completed',
      date: new Date().toISOString().split('T')[0],
    }
  })
  const [contactType, setContactType] = useState<'new' | 'existing'>('new')

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts')
        const data = await response.json()
        setContacts(data)
      } catch (error) {
        console.error('Failed to fetch contacts:', error)
        toast.error('Failed to load existing contacts')
      }
    }
    fetchContacts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let donorData: any = {
        type: formData.type,
        status: formData.status,
        notes: formData.notes,
      }

      if (contactType === 'new') {
        donorData.contact = formData.newContact
      } else {
        donorData.contactId = formData.contactId
      }

      // Create the donor
      const donorResponse = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donorData),
      })
      const donor = await donorResponse.json()
      if (donor.error) throw new Error(donor.error)

      // If there's an initial donation, create it
      if (formData.initialDonation.amount) {
        const donationResponse = await fetch('/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData.initialDonation,
            donorId: donor.id,
            amount: parseFloat(formData.initialDonation.amount),
          }),
        })
        const donation = await donationResponse.json()
        if (donation.error) throw new Error(donation.error)
      }

      toast.success('Donor added successfully!')
      // Reset form
      setFormData({
        contactId: '',
        newContact: { name: '', email: '', phone: '', company: '', country: '', county: '' },
        type: '',
        status: 'Active',
        notes: '',
        initialDonation: {
          amount: '',
          currency: 'USD',
          type: 'One-time',
          status: 'Completed',
          date: new Date().toISOString().split('T')[0],
        }
      })
      setContactType('new')
    } catch (error) {
      console.error('Error adding donor:', error)
      toast.error('Failed to add donor: ' + (error as Error).message)
    }
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold">Add Donor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <RadioGroup 
            defaultValue="new" 
            onValueChange={(value) => setContactType(value as 'new' | 'existing')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">Create New Contact</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing">Select Existing Contact</Label>
            </div>
          </RadioGroup>
          
          {contactType === 'existing' && (
            <div className="space-y-2">
              <Label htmlFor="contactSelect">Select Contact</Label>
              <Select 
                value={formData.contactId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, contactId: value }))}
              >
                <SelectTrigger id="contactSelect">
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name} ({contact.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {contactType === 'new' && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.newContact.name} 
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    newContact: { ...prev.newContact, name: e.target.value }
                  }))}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.newContact.email}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    newContact: { ...prev.newContact, email: e.target.value }
                  }))}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={formData.newContact.phone}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    newContact: { ...prev.newContact, phone: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  value={formData.newContact.company}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    newContact: { ...prev.newContact, company: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input 
                  id="country" 
                  value={formData.newContact.country}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    newContact: { ...prev.newContact, country: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="county">County</Label>
                <Input 
                  id="county" 
                  value={formData.newContact.county}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    newContact: { ...prev.newContact, county: e.target.value }
                  }))}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Donor Information</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Donor Type</Label>
              <Select 
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({...prev, type: value}))}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Foundation">Foundation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({...prev, status: value}))}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input 
                id="notes" 
                value={formData.notes}
                onChange={e => setFormData(prev => ({...prev, notes: e.target.value}))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Initial Donation</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                value={formData.initialDonation.amount}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  initialDonation: { ...prev.initialDonation, amount: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input 
                id="currency" 
                value={formData.initialDonation.currency}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  initialDonation: { ...prev.initialDonation, currency: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="donationType">Donation Type</Label>
              <Select 
                value={formData.initialDonation.type}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  initialDonation: { ...prev.initialDonation, type: value }
                }))}
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
                value={formData.initialDonation.status}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  initialDonation: { ...prev.initialDonation, status: value }
                }))}
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
                value={formData.initialDonation.date}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  initialDonation: { ...prev.initialDonation, date: e.target.value }
                }))}
              />
            </div>
          </div>
        </div>

        <Button type="submit">Add Donor</Button>
      </form>
    </div>
  )
}

