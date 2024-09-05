import { ClerkProvider } from '@clerk/nextjs'
import { Sidebar } from '@/components/Sidebar'
import { UserButton } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="h-full relative">
              <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-background">
                <Sidebar />
              </div>
              <main className="md:pl-72 pb-10">
                <div className="flex items-center p-4">
                  <UserButton afterSignOutUrl="/" />
                </div>
                {children}
              </main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}