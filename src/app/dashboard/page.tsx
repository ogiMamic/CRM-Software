'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [recentSubscribers, setRecentSubscribers] = useState([])

  useEffect(() => {
    // Simulacija provjere je li korisnik prijavljen
    // U stvarnoj aplikaciji, ovdje biste provjerili stanje prijave korisnika
    setIsLoggedIn(true)
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    // Dohvaćanje ukupnog broja pretplatnika
    const { count } = await supabase
      .from('subscribers')
      .select('*', { count: 'exact', head: true })
    setSubscriberCount(count || 0)

    // Dohvaćanje 5 najnovijih pretplatnika
    const { data } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    setRecentSubscribers(data || [])
  }

  if (!isLoggedIn) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p className="mb-4">Welcome to your dashboard!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Subscribers</h2>
          <p className="text-3xl font-bold text-blue-600">{subscriberCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/subscribers" className="block text-blue-600 hover:underline">
              Manage Subscribers
            </Link>
            <Link href="/campaigns" className="block text-blue-600 hover:underline">
              View Campaigns
            </Link>
            <Link href="/orders" className="block text-blue-600 hover:underline">
              Manage Orders
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Subscribers</h2>
        {recentSubscribers.length > 0 ? (
          <ul className="space-y-2">
            {recentSubscribers.map((subscriber) => (
              <li key={subscriber.id} className="flex justify-between items-center border-b pb-2">
                <span>{subscriber.email}</span>
                <span className="text-sm text-gray-500">
                  {new Date(subscriber.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent subscribers.</p>
        )}
      </div>
    </div>
  )
}