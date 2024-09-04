import Link from 'next/link'

export function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          CRM Software
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>
          <Link href="/subscribers" className="hover:text-gray-300">
            Subscribers
          </Link>
          <Link href="/campaigns" className="hover:text-gray-300">
            Campaigns
          </Link>
          <Link href="/orders" className="hover:text-gray-300">
            Orders
          </Link>
        </div>
      </div>
    </nav>
  )
}