import Link from 'next/link'
import { Metadata } from 'next'
import { local } from '@/data-access/local'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'All Products - E-Commerce Demo',
  description:
    'Browse our complete collection of products. Find electronics, clothing, and more in our demo store.',
}

export default async function ProductsPage() {
  // Clean, domain-specific API call
  const products = await local.product.getLatest()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.docs.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>

            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">{product.inventory} in stock</span>
            </div>

            {product.category && typeof product.category === 'object' && (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {product.category.name}
              </span>
            )}
          </Link>
        ))}
      </div>

      {products.docs.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No products found. Make sure to run the seeder first.
        </p>
      )}
    </div>
  )
}
