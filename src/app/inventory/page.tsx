"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { InventoryStatus } from '@/components/InventoryStatus'
import { AddInventory } from '@/components/AddInventory'
import { InventoryReports } from '@/components/InventoryReports'

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("status")

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={[{ label: 'Inventory', href: '/inventory' }]} />
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="status">Inventory Status</TabsTrigger>
          <TabsTrigger value="add">Add Inventory</TabsTrigger>
          <TabsTrigger value="reports">Inventory Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="status">
          <InventoryStatus />
        </TabsContent>
        <TabsContent value="add">
          <AddInventory />
        </TabsContent>
        <TabsContent value="reports">
          <InventoryReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}