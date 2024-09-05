import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

type Campaign = {
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
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return <Badge variant={status === 'Active' ? "success" : status === 'Inactive' ? "destructive" : "secondary"}>{status}</Badge>
    },
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
      const budget = parseFloat(row.getValue("budget"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(budget)
      return <div className="font-medium">{formatted}</div>
    },
  },
]