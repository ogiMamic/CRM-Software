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
      return (
        <Badge 
          className={
            status === 'Active' ? 'bg-green-100 text-green-800' :
            status === 'Inactive' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }
        >
          {status}
        </Badge>
      )
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