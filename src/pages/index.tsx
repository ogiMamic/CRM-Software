// src/pages/index.tsx
import Head from 'next/head'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs';
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>CRM Software</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">CRM Software</h1>
          <UserButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <nav className="space-y-4">
            <Link href="/newsletter" className="block p-4 bg-white shadow rounded-lg hover:bg-gray-50">
              Newsletter Subscribers
            </Link>
            <Link href="/campaigns" className="block p-4 bg-white shadow rounded-lg hover:bg-gray-50">
              Campaign Management
            </Link>
            <Link href="/orders" className="block p-4 bg-white shadow rounded-lg hover:bg-gray-50">
              Order Management
            </Link>
          </nav>
        </div>
      </main>
    </div>
  )
}