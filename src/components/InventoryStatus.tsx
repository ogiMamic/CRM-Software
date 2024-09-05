import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

type InventoryItem = {
  id: string
  name: string
  type: string
  quantity: number
  status: 'Available' | 'Low Stock' | 'Out of Stock'
}

const columns: ColumnDef<InventoryItem>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "quantity", header: "Quantity" },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === 'Available' ? 'success' : status === 'Low Stock' ? 'warning' : 'destructive'}>
          {status}
        </Badge>
      )
    },
  },
]

export function InventoryStatus() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
  })

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockInventory: InventoryItem[] = [
        { id: "1", name: "Painting - Landscape", type: "Painting", quantity: 5, status: "Available" },
        { id: "2", name: "Rosary", type: "Religious Item", quantity: 2, status: "Low Stock" },
        { id: "3", name: "Bible", type: "Book", quantity: 0, status: "Out of Stock" },
        { id: "4", name: "Sculpture - Abstract", type: "Sculpture", quantity: 3, status: "Available" },
      ]
      setInventory(mockInventory)
    }, 1000)
  }, [])

  const filteredInventory = inventory.filter(item => {
    return (
      (filters.type === 'all' || item.type === filters.type) &&
      (filters.status === 'all' || item.status === filters.status)
    )
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Inventory Status</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Item Type</Label>
          <Select 
            value={filters.type} 
            onValueChange={(value) => setFilters({...filters, type: value})}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Painting">Painting</SelectItem>
              <SelectItem value="Religious Item">Religious Item</SelectItem>
              <SelectItem value="Book">Book</SelectItem>
              <SelectItem value="Sculpture">Sculpture</SelectItem>
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
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable columns={columns} data={filteredInventory} />
    </div>
  )
}