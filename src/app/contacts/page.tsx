"use client"

import React, { useState, useEffect, useRef } from 'react'
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
import { PlusIcon, FilterIcon, MoreHorizontal, Check, X, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { toast, Toaster } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Contact = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  createdAt: string
  updatedAt: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: false }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [editingContact, setEditingContact] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Contact>>({})
  const inputRefs = useRef<{ [key: string]: React.RefObject<HTMLInputElement> }>({
    name: React.createRef(),
    email: React.createRef(),
    phone: React.createRef(),
    company: React.createRef(),
  });

  useEffect(() => {
    fetchContacts()
  }, [])

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

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact.id);
    setTimeout(() => {
      inputRefs.current['name']?.current?.focus();
    }, 0);
  }

  const handleEditSubmit = async () => {
    if (!editingContact) return;

    const updatedContact = {
      name: inputRefs.current['name']?.current?.value || '',
      email: inputRefs.current['email']?.current?.value || '',
      phone: inputRefs.current['phone']?.current?.value || '',
      company: inputRefs.current['company']?.current?.value || '',
    };

    try {
      const response = await fetch(`/api/contacts/${editingContact}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContact),
      });
      if (!response.ok) {
        throw new Error('Failed to update contact');
      }
      await fetchContacts();
      setEditingContact(null);
      toast.success('Contact updated successfully');
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Failed to update contact. Please try again.');
    }
  };

  const handleEditCancel = () => {
    setEditingContact(null)
    setEditForm({})
  }

  const handleDeleteContact = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await fetch(`/api/contacts/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) {
          throw new Error('Failed to delete contact')
        }
        fetchContacts()
        toast.success('Contact deleted successfully')
      } catch (error) {
        console.error('Error deleting contact:', error)
        toast.error('Failed to delete contact. Please try again.')
      }
    }
  }

  const columns: ColumnDef<Contact>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const contact = row.original
        return editingContact === contact.id ? (
          <Input
            name="name"
            defaultValue={contact.name}
            ref={inputRefs.current['name']}
          />
        ) : (
          contact.name
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const contact = row.original
        return editingContact === contact.id ? (
          <Input
            name="email"
            defaultValue={contact.email || ''}
            ref={inputRefs.current['email']}
          />
        ) : (
          contact.email
        )
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const contact = row.original
        return editingContact === contact.id ? (
          <Input
            name="phone"
            defaultValue={contact.phone || ''}
            ref={inputRefs.current['phone']}
          />
        ) : (
          contact.phone
        )
      },
    },
    {
      accessorKey: "company",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const contact = row.original
        return editingContact === contact.id ? (
          <Input
            name="company"
            defaultValue={contact.company || ''}
            ref={inputRefs.current['company']}
          />
        ) : (
          contact.company
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <div>{date.toLocaleDateString('sr-RS')}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const contact = row.original
        return (
          <div className="text-right">
            {editingContact === contact.id ? (
              <div className="flex justify-end space-x-2">
                <Button onClick={handleEditSubmit} size="sm">
                  <Check className="h-4 w-4" />
                </Button>
                <Button onClick={handleEditCancel} size="sm" variant="outline">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleEditClick(contact)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDeleteContact(contact.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )
      },
    },
  ]

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
                    {table.getAllColumns().filter(column => column.id !== 'actions').map((column) => {
                      return (
                        <div key={column.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            aria-label={`Toggle ${column.id} column`}
                            id={`column-${column.id}`}
                          />
                          <Label htmlFor={`column-${column.id}`} className="capitalize">
                            {column.id}
                          </Label>
                        </div>
                      )
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
                    <TableCell colSpan={columns.length} className="h-24 text-center">
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