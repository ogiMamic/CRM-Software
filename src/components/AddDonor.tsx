import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'

export function AddDonor() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    donationType: '',
    amount: '',
    country: '',
    age: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData)
    toast.success('Donor added successfully!')
    // Reset form
    setFormData({
      name: '',
      email: '',
      donationType: '',
      amount: '',
      country: '',
      age: '',
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Add Donor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="donationType">Donation Type</Label>
          <Select onValueChange={(value) => setFormData({...formData, donationType: value})}>
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
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" type="number" value={formData.amount} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" value={formData.country} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" value={formData.age} onChange={handleChange} required />
        </div>
        <Button type="submit">Add Donor</Button>
      </form>
    </div>
  )
}