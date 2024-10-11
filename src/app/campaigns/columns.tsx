"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Campaign } from "./types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

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
      return <Badge variant={status === 'Active' ? "success" : status === 'Draft' ? "warning" : "secondary"}>{status}</Badge>
    },
  },
  {
    accessorKey: "owner",
    header: "Campaign Owner",
  },
  {
    accessorKey: "comments",
    header: "Comments",
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
  },
  {
    accessorKey: "notes",
    header: "Campaign Notes",
  },
  {
    accessorKey: "startDate",
    header: "Campaign Start Date",
  },
  {
    accessorKey: "endDate",
    header: "Campaign End Date",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const campaign = row.original
 
      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )
    },
  },
]