import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider"
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
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background font-sans antialiased">
              <Navigation />
              <main className="container mx-auto py-6 px-4">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}