"use client";

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
};

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
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const fetchContacts = async () => {
      // Simulating an API call with setTimeout
      setTimeout(() => {
        const mockContacts: Contact[] = [
          { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', company: 'ABC Corp' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321', company: 'XYZ Inc' },
          // Add more mock contacts as needed
        ];
        setContacts(mockContacts);
      }, 1000);
    };

    fetchContacts();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Contact
        </Button>
      </div>
      <DataTable columns={columns} data={contacts} />
    </div>
  );
}