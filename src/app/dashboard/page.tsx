import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <nav className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/newsletter" className="block p-4 bg-white shadow rounded-lg hover:bg-gray-50">
          Newsletter Subscribers
        </Link>
        <Link href="/campaigns" className="block p-4 bg-white shadow rounded-lg hover:bg-gray-50">
          Campaign Management
        </Link>
        <Link href="/orders" className="block p-4 bg-white shadow rounded-lg hover:bg-gray-50">
          Order Management
        </Link>
        <Link href="/donors" className="block p-4 bg-white shadow rounded-lg hover:bg-gray-50">
          Donor Management
        </Link>
        <Link href="/inventory" className="block p-4 bg-white shadow rounded-lg hover:bg-gray-50">
          Inventory Management
        </Link>
      </nav>
    </div>
  )
}