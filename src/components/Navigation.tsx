"use client"

import Link from 'next/link'
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export function Navigation() {
  const showToast = () => {
    toast("This is a toast notification", {
      description: "You can customize this message",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    })
  }

  return (
    <>
      <nav className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                CRM Software
              </Link>
              <div className="hidden md:flex md:ml-10 space-x-8">
                <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link href="/contacts" className="text-foreground hover:text-primary transition-colors">
                  Contacts
                </Link>
                <Link href="/campaigns" className="text-foreground hover:text-primary transition-colors">
                  Campaigns
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={showToast}>
                Show Toast
              </Button>
              <ModeToggle />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>
      <Toaster />
    </>
  )
}