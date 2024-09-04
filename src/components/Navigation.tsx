'use client';

import Link from 'next/link'
import { UserButton } from "@clerk/nextjs";

export function Navigation() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              CRM Software
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/newsletter" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Newsletter
              </Link>
              {/* Add more navigation items as needed */}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  )
}