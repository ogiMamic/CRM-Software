"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Campaign = {
  id: string
  name: string
  status: 'Active' | 'Inactive' | 'Draft'
  startDate: string
  endDate: string
  budget: number
}

export const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "endDate",
    header: "End Date",
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("budget"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
  },
]