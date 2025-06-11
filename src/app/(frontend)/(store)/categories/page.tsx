import Link from 'next/link'
import { Metadata } from 'next'
import { local } from '@/repository'

export const metadata: Metadata = {
  title: 'Shop by Category - E-Commerce Demo',
  description:
    'Browse products by category. Find electronics, clothing, books, and more organized by type.',
}

export default async function CategoriesPage() {
  const categories = await local.category.getAll()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Shop by Category</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
          >
            <h2 className="text-2xl font-semibold mb-3">{category.name}</h2>
            {category.description && (
              <p className="text-gray-600 line-clamp-3">{category.description}</p>
            )}
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No categories found. Make sure to run the seeder first.
        </p>
      )}
    </div>
  )
}
