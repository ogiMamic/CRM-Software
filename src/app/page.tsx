import { SignedIn, SignedOut } from '@clerk/nextjs'
import { ContactList } from '@/components/ContactList'

export default function Home() {
  return (
    <main>
      <h1>CRM Software</h1>
      <SignedIn>
        <ContactList />
      </SignedIn>
      <SignedOut>
        <p>Please sign in to access the CRM.</p>
      </SignedOut>
    </main>
  )
}