import React from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { UserButton } from '@/components/UserButton'
import './globals.css'

export const metadata = {
  title: 'E-Commerce Demo - Advanced Data Access Patterns',
  description: 'Educational e-commerce demo showcasing advanced data access patterns in Payload CMS. Built for learning and demonstration purposes.',
  keywords: 'e-commerce, payload cms, next.js, data access patterns, demo',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const user = await getCurrentUser()

  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                E-Commerce Demo
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/products" className="hover:text-blue-600 transition-colors">
                  Products
                </Link>
                <Link href="/categories" className="hover:text-blue-600 transition-colors">
                  Categories
                </Link>
                {user && (
                  <Link 
                    href="/cart" 
                    className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                  </Link>
                )}
                {user ? (
                  <UserButton user={user} />
                ) : (
                  <Link 
                    href="/auth" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  )
}
