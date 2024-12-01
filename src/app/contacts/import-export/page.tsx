"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast, Toaster } from 'sonner';
import Papa from 'papaparse';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useRouter } from 'next/navigation';

type Contact = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
};

export default function ImportExportPage() {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const router = useRouter();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImporting(true);
      try {
        const text = await file.text();
        Papa.parse(text, {
          header: true,
          complete: async (results) => {
            const contacts = results.data as Contact[];
            // Validate contacts here if needed
            const response = await fetch('/api/contacts/import', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(contacts),
            });
            if (!response.ok) {
              throw new Error('Failed to import contacts');
            }
            const data = await response.json();
            toast.success(`Successfully imported ${data.count} contacts`);
            router.refresh(); // Refresh the page to update the contacts list
          },
          error: (error: Error) => {
            console.error('Error parsing CSV:', error);
            toast.error('Failed to parse CSV file');
          },
        });
      } catch (error) {
        console.error('Error importing contacts:', error);
        toast.error('Failed to import contacts');
      } finally {
        setImporting(false);
      }
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/contacts');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const contacts: Contact[] = await response.json();
      const csv = Papa.unparse(contacts);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'contacts.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      toast.success('Contacts exported successfully');
    } catch (error) {
      console.error('Error exporting contacts:', error);
      toast.error('Failed to export contacts');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Toaster position="top-right" />
      <Breadcrumbs items={[{ label: 'Contacts', href: '/contacts' }, { label: 'Import/Export', href: '/contacts/import-export' }]} />
      <Card>
        <CardHeader>
          <CardTitle>Import/Export Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Import Contacts</h2>
            <div className="flex items-center space-x-2">
              <Input 
                type="file" 
                onChange={handleImport} 
                accept=".csv" 
                disabled={importing}
              />
              {importing && <p className="text-sm text-muted-foreground">Importing...</p>}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a CSV file with columns: name, email, phone (optional), company (optional)
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Export Contacts</h2>
            <Button onClick={handleExport} disabled={exporting}>
              {exporting ? 'Exporting...' : 'Export to CSV'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}