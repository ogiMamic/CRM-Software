import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'

export function AddInventory() {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData)
    toast.success('Inventory item added successfully!')
    // Reset form
    setFormData({
      name: '',
      type: '',
      quantity: '',
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Add Inventory Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name</Label>
          <Input id="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Item Type</Label>
          <Select onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Painting">Painting</SelectItem>
              <SelectItem value="Religious Item">Religious Item</SelectItem>
              <SelectItem value="Book">Book</SelectItem>
              <SelectItem value="Sculpture">Sculpture</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
        </div>
        <Button type="submit">Add Item</Button>
      </form>
    </div>
  )
}