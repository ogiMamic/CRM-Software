"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRolesPermissions } from '@/components/settings/UserRolesPermissions'
import { APIIntegrations } from '@/components/settings/APIIntegrations'
import { SystemSettings } from '@/components/settings/SystemSettings'
import { Breadcrumbs } from '@/components/Breadcrumbs'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("roles")

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={[{ label: 'Settings', href: '/settings' }]} />
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">User Roles & Permissions</TabsTrigger>
          <TabsTrigger value="api">API Integrations</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="roles">
          <UserRolesPermissions />
        </TabsContent>
        <TabsContent value="api">
          <APIIntegrations />
        </TabsContent>
        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}