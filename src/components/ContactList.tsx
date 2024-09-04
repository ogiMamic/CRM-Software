import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"

export function ContactList() {
  const [contacts, setContacts] = useState<any[]>([])

  useEffect(() => {
    async function fetchContacts() {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .limit(10)

      if (error) {
        console.error('Error fetching contacts:', error)
      } else {
        setContacts(data || [])
      }
    }

    fetchContacts()
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        {contacts.length > 0 ? (
          <ul>
            {contacts.map((contact) => (
              <li key={contact.id} className="mb-2">{contact.name}</li>
            ))}
          </ul>
        ) : (
          <p>No contacts found.</p>
        )}
        <Button className="mt-4">Add New Contact</Button>
      </CardContent>
    </Card>
  )
}