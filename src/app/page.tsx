import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to CRM Software</h1>
      <SignedIn>
        <p className="mb-4">You are signed in. Access your dashboard below.</p>
        <Link href="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded">
          Go to Dashboard
        </Link>
      </SignedIn>
      <SignedOut>
        <p className="mb-4">Please sign up or sign in to access the CRM.</p>
      </SignedOut>
    </div>
  )
}