import { Metadata } from 'next'
import { ProductCard } from '@/components/ProductCard'
import { local } from '@/repository'

export const metadata: Metadata = {
  title: 'All Products - E-Commerce Demo',
  description:
    'Browse our complete collection of products. Find electronics, clothing, and more in our demo store.',
}

export default async function ProductsPage() {
  const products = await local.product.getAll()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No products found. Make sure to run the seeder first.
        </p>
      )}
    </div>
  )
}
