import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type Donor = {
  id: string
  name: string
  email: string
  donationType: 'One-time' | 'Monthly' | 'Annual'
  amount: number
  country: string
  age: number
}

const columns: ColumnDef<Donor>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "donationType", header: "Donation Type" },
  { 
    accessorKey: "amount", 
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "age", header: "Age" },
]

export function DonorList() {
  const [donors, setDonors] = useState<Donor[]>([])
  const [filters, setFilters] = useState({
    donationType: 'all',
    minAmount: '',
    country: '',
    minAge: '',
    maxAge: '',
  })

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockDonors: Donor[] = [
        { id: "1", name: "John Doe", email: "john@example.com", donationType: "Monthly", amount: 50, country: "USA", age: 35 },
        { id: "2", name: "Jane Smith", email: "jane@example.com", donationType: "One-time", amount: 1000, country: "Canada", age: 42 },
        { id: "3", name: "Bob Johnson", email: "bob@example.com", donationType: "Annual", amount: 500, country: "UK", age: 28 },
      ]
      setDonors(mockDonors)
    }, 1000)
  }, [])

  const filteredDonors = donors.filter(donor => {
    return (
      (filters.donationType === 'all' || donor.donationType === filters.donationType) &&
      (filters.minAmount === '' || donor.amount >= parseFloat(filters.minAmount)) &&
      (filters.country === '' || donor.country.toLowerCase().includes(filters.country.toLowerCase())) &&
      (filters.minAge === '' || donor.age >= parseInt(filters.minAge)) &&
      (filters.maxAge === '' || donor.age <= parseInt(filters.maxAge))
    )
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Donor List</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <Label htmlFor="donationType">Donation Type</Label>
          <Select 
            value={filters.donationType} 
            onValueChange={(value) => setFilters({...filters, donationType: value})}
          >
            <SelectTrigger id="donationType">
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
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="Country"
            value={filters.country}
            onChange={(e) => setFilters({...filters, country: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="minAge">Min Age</Label>
          <Input
            id="minAge"
            type="number"
            placeholder="Min age"
            value={filters.minAge}
            onChange={(e) => setFilters({...filters, minAge: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="maxAge">Max Age</Label>
          <Input
            id="maxAge"
            type="number"
            placeholder="Max age"
            value={filters.maxAge}
            onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
          />
        </div>
      </div>
      <DataTable columns={columns} data={filteredDonors} />
    </div>
  )
}