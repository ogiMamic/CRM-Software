import { ClerkProvider, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header className="p-4 bg-gray-100">
            <div className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold">CRM Software</Link>
              <nav>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded mr-2">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 bg-green-500 text-white rounded">Sign Up</button>
                </SignUpButton>
                <UserButton afterSignOutUrl="/" />
              </nav>
            </div>
          </header>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}