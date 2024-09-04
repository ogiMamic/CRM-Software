import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ContactList() {
  const [contacts, setContacts] = useState<any[]>([])

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
          <div key={contact.id}>{contact.name} - {contact.email}</div>
        ))}
        <Button>Add New Contact</Button>
      </CardContent>
    </Card>
  )
}