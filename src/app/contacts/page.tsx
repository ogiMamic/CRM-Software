"use client"

import React, { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { PlusIcon, FilterIcon, MoreHorizontal, ArrowUpDown, Trash2 } from 'lucide-react'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+?[0-9\s-()]+$/, "Invalid phone number").optional().or(z.literal('')),
  company: z.string().optional(),
});

type Contact = z.infer<typeof contactSchema> & {
  id: string
  createdAt: string
  updatedAt: string
}

type EditingContact = {
  id: string
  data: Partial<Contact>
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [editingContact, setEditingContact] = useState<EditingContact | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Contact>({
    resolver: zodResolver(contactSchema)
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
    setEditingContact({ id: contact.id, data: { ...contact } });
    reset(contact);
  }

  const handleEditSubmit = async (data: Contact) => {
    if (!editingContact) return;

    try {
      const response = await fetch(`/api/contacts/${editingContact.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
    reset()
  }

  const handleDeleteContact = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete contact')
      }
      await fetchContacts()
      toast.success('Contact deleted successfully')
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error('Failed to delete contact. Please try again.')
    }
  }

  const handleDeleteMultipleContacts = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map(row => row.original.id);

    try {
      const response = await fetch('/api/contacts/bulk-delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      await fetchContacts();
      toast.success(`${result.count} contacts deleted successfully`);
      table.toggleAllRowsSelected(false);
    } catch (error) {
      console.error('Error deleting contacts:', error);
      toast.error(`Failed to delete contacts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const columns: ColumnDef<Contact>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
        return (
          <div>
            {editingContact?.id === contact.id ? (
              <Input
                {...register('name')}
                defaultValue={contact.name}
              />
            ) : (
              contact.name
            )}
            {editingContact?.id === contact.id && errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
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
        return (
          <div>
            {editingContact?.id === contact.id ? (
              <Input
                {...register('email')}
                defaultValue={contact.email}
              />
            ) : (
              contact.email
            )}
            {editingContact?.id === contact.id && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
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
        return (
          <div>
            {editingContact?.id === contact.id ? (
              <Input
                {...register('phone')}
                defaultValue={contact.phone || ''}
              />
            ) : (
              contact.phone
            )}
            {editingContact?.id === contact.id && errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
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
        return (
          <div>
            {editingContact?.id === contact.id ? (
              <Input
                {...register('company')}
                defaultValue={contact.company || ''}
              />
            ) : (
              contact.company
            )}
            {editingContact?.id === contact.id && errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
            )}
          </div>
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
            {editingContact?.id === contact.id ? (
              <div className="flex justify-end space-x-2">
                <Button onClick={handleSubmit(handleEditSubmit)} size="sm">
                  Save
                </Button>
                <Button onClick={handleEditCancel} size="sm" variant="outline">
                  Cancel
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the contact
                          and remove the data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteContact(contact.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
                    {table.getAllColumns().filter(column => column.id !== 'actions' && column.id !== 'select').map((column) => {
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
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Link href="/contacts/import-export" className="w-full sm:w-auto mb-2 sm:mb-0">
                <Button variant="outline" className="w-full">
                  Import/Export
                </Button>
              </Link>
              <Link href="/contacts/add" className="w-full sm:w-auto">
                <Button className="w-full">
                  <PlusIcon className="mr-2 h-4 w-4" /> Add Contact
                </Button>
              </Link>
            </div>
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
          <div className="flex items-center justify-between space-x-2 py-4">
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={table.getFilteredSelectedRowModel().rows.length === 0}
              >
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the selected contacts
                  and remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteMultipleContacts}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}

