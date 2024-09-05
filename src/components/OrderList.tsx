import { useState, useEffect } from 'react'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

type Order = {
  id: string
  user: string
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Returned'
  deliveryDate: string
  items: string[]
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "user",
    header: "User",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge 
          className={
            status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
            status === 'Delivered' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }
        >
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery Date",
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as string[]
      return <span>{items.join(", ")}</span>
    },
  },
]

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      const mockOrders: Order[] = [
        { id: "1", user: "John Doe", status: "Pending", deliveryDate: "2023-07-15", items: ["T-shirt", "Cap"] },
        { id: "2", user: "Jane Smith", status: "Shipped", deliveryDate: "2023-07-10", items: ["Poster", "Sticker"] },
        { id: "3", user: "Bob Johnson", status: "Delivered", deliveryDate: "2023-07-05", items: ["Mug", "Pen"] },
      ]
      setOrders(mockOrders)
    }, 1000)
  }, [])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Order List</h2>
      <DataTable columns={columns} data={orders} />
    </div>
  )
}