"use client";

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Contact = {
  id: number;
  name: string;
  email: string;
  type: string;
}

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    fetchContacts()
  }, [])

  async function fetchContacts() {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
    if (error) console.error('Error fetching contacts:', error)
    else setContacts(data || [])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        {contacts.map(contact => (
          <div key={contact.id} className="mb-2">
            {contact.name} - {contact.email} ({contact.type})
          </div>
        ))}
        <Button className="mt-4">Add New Contact</Button>
      </CardContent>
    </Card>
  )
}