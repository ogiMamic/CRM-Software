'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import SubscriberForm from '@/components/SubscriberForm'
import SubscriberList from '@/components/SubscriberList'
import SubscriberFilter from '@/components/SubscriberFilter'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchSubscribers()
  }, [])

  async function fetchSubscribers() {
    let query = supabase.from('subscribers').select('*')
    if (filter !== 'all') {
      query = query.eq('contact_type', filter)
    }
    const { data, error } = await query
    if (error) console.error('Error fetching subscribers:', error)
    else setSubscribers(data)
  }

  async function addSubscriber(newSubscriber) {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([newSubscriber])
    if (error) console.error('Error adding subscriber:', error)
    else fetchSubscribers()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Newsletter Subscribers</h1>
      <SubscriberForm onSubmit={addSubscriber} />
      <SubscriberFilter currentFilter={filter} onFilterChange={setFilter} />
      <SubscriberList subscribers={subscribers} />
    </div>
  )
}