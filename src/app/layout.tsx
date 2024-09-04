import { ClerkProvider } from '@clerk/nextjs'
import { Navigation } from '@/components/Navigation'
import './globals.css'

export const metadata = {
  title: 'CRM Software',
  description: 'Manage your customer relationships efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navigation />
          <main className="min-h-screen bg-gray-100 p-4">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}