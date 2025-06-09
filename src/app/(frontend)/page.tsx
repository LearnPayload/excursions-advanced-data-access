import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home - E-Commerce Demo',
  description:
    'Welcome to our educational e-commerce demo showcasing advanced data access patterns in Payload CMS.',
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">E-Commerce Demo</h1>

      <p className="text-lg text-gray-600 mb-8">
        Educational demo showcasing advanced data access patterns in Payload CMS
      </p>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
          <Link
            href="/categories"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Shop by Category
          </Link>
        </div>

        <div className="text-sm text-gray-500">
          <p>
            This demo shows the progression from scattered Payload queries to clean abstractions.
          </p>
          <p>Currently using direct Payload calls - we&apos;ll refactor these later!</p>
        </div>
      </div>
    </div>
  )
}
