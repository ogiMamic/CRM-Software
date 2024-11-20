"use client"

import { useEffect, useState, useMemo } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusIcon, FilterIcon } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { toast, Toaster } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  createdAt: string
  updatedAt: string
}

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('sr-RS');
    },
  },
]

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts')
        if (!response.ok) {
          throw new Error('Failed to fetch contacts')
        }
        const data = await response.json()
        setContacts(data)
      } catch (error) {
        console.error('Error fetching contacts:', error)
        toast.error('Failed to load contacts. Please try again.')
      }
    }

    fetchContacts()
  }, [])

  useEffect(() => {
    const newContact = JSON.parse(localStorage.getItem('newContact') || 'null')
    if (newContact) {
      setContacts(prev => [...prev, { ...newContact, id: String(prev.length + 1) }])
      toast.success('New contact has been added successfully.')
      localStorage.removeItem('newContact')
    }
  }, [])

  const table = useReactTable({
    data: contacts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const visibleColumns = useMemo(() => 
    columns.filter(column => columnVisibility[column.accessorKey as string] !== false),
    [columnVisibility]
  )

  return (
    <div className="container mx-auto py-10">
      <Toaster position="top-right" />
      <Breadcrumbs items={[{ label: 'Contacts', href: '/contacts' }]} />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <Input
                id="search"
                type="search"
                placeholder="Search contacts..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="w-full sm:w-[300px]"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="Filter contacts">
                    <FilterIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px]">
                  <div className="space-y-2">
                    <h3 className="font-medium">Show columns:</h3>
                    {columns.map((column) => {
                      const columnId = `column-${column.accessorKey}`;
                      return (
                        <div key={column.accessorKey} className="flex items-center space-x-2">
                          <Checkbox
                            id={columnId}
                            checked={table.getColumn(column.accessorKey as string)?.getIsVisible()}
                            onCheckedChange={(value) =>
                              table.getColumn(column.accessorKey as string)?.toggleVisibility(!!value)
                            }
                          />
                          <Label htmlFor={columnId} className="capitalize">
                            {column.header as string}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Link href="/contacts/add">
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </Link>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}