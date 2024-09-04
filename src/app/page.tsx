import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to CRM Software</h1>
      <SignedIn>
        <p className="mb-4">You are signed in. Access your dashboard below.</p>
        <Link href="/dashboard" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Go to Dashboard
        </Link>
      </SignedIn>
      <SignedOut>
        <p className="mb-4">Please sign up or sign in to access the CRM.</p>
        <div className="space-x-4">
          <Link href="/sign-up" className="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Sign Up
          </Link>
          <Link href="/sign-in" className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Sign In
          </Link>
        </div>
      </SignedOut>
    </div>
  )
}