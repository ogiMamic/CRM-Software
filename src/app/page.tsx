import { SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to CRM Software</h1>
      <SignedIn>
        <p className="mb-4">You are signed in. Access your dashboard below.</p>
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </SignedIn>
      <SignedOut>
        <p className="mb-4">Please sign up or sign in to access the CRM.</p>
        <div className="space-x-4">
          <Button asChild variant="outline">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </SignedOut>
    </div>
  )
}