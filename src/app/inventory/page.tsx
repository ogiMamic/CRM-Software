// src/pages/inventory.tsx
import Head from 'next/head'
import { useUser } from '@clerk/nextjs';
import { UserButton } from "@clerk/nextjs";
import InventoryManagement from '../components/InventoryManagement'

export default function InventoryPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Inventory Management - CRM Software</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <UserButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <InventoryManagement />
        </div>
      </main>
    </div>
  )
}