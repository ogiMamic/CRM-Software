"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { GeneralReports } from '@/components/GeneralReports'
import { CustomReports } from '@/components/CustomReports'
import { ExportReports } from '@/components/ExportReports'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={[{ label: 'Reports', href: '/reports' }]} />
      <h1 className="text-3xl font-bold mb-6">Reports and Analytics</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Reports</TabsTrigger>
          <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          <TabsTrigger value="export">Export Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralReports />
        </TabsContent>
        <TabsContent value="custom">
          <CustomReports />
        </TabsContent>
        <TabsContent value="export">
          <ExportReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}