"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ImportExportPage() {
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically handle the file import
      console.log('Importing file:', file.name);
    }
  };

  const handleExport = () => {
    // Here you would typically handle the export process
    console.log('Exporting contacts');
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Import/Export Contacts</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Import Contacts</h2>
          <Input type="file" onChange={handleImport} accept=".csv,.xlsx" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Export Contacts</h2>
          <Button onClick={handleExport}>Export to CSV</Button>
        </div>
      </div>
    </div>
  );
}