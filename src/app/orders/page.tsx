"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { OrderList } from '@/components/OrderList'
import { OrderAutomation } from '@/components/OrderAutomation'
import { OrderReports } from '@/components/OrderReports'

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("list")

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={[{ label: 'Orders', href: '/orders' }]} />
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Order List</TabsTrigger>
          <TabsTrigger value="automation">Order Automation</TabsTrigger>
          <TabsTrigger value="reports">Order Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <OrderList />
        </TabsContent>
        <TabsContent value="automation">
          <OrderAutomation />
        </TabsContent>
        <TabsContent value="reports">
          <OrderReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}