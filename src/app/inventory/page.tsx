'use client'

import { useUser } from '@clerk/nextjs';
import { UserButton } from "@clerk/nextjs";
import InventoryManagement from '@/components/InventoryManagement'

export default function InventoryPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      <InventoryManagement />
    </div>
  );
}