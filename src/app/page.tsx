import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { ContactList } from "@/components/ContactList"

export default async function Home() {
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select('*')
    .limit(5)

  if (error) {
    console.error('Error fetching contacts:', error)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">CRM Software</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recent Contacts</CardTitle>
        </CardHeader>
        <CardContent>
          {contacts ? (
            <ul>
              {contacts.map((contact: any) => (
                <li key={contact.id} className="mb-2">{contact.name}</li>
              ))}
            </ul>
          ) : (
            <p>No contacts found.</p>
          )}
        </CardContent>
      </Card>
      <Button className="mt-4">Add New Contact</Button>
    </main>
  )
}