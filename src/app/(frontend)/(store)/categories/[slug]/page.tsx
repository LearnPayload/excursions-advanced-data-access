import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { formatPrice } from '@/lib/utils'
import { local } from '@/data-access/local'
import { Product } from '@/payload-types'
import { ProductCard } from '@/components/ProductCard'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const category = await local.category.findBy('slug', slug)

    if (!category) {
      return {
        title: 'Category Not Found - E-Commerce Demo',
        description: 'The category you are looking for could not be found.',
      }
    }

    return {
      title: `${category.name} - E-Commerce Demo`,
      description: category.description || `Shop ${category.name} products in our demo store.`,
    }
  } catch (error) {
    return {
      title: 'Category Not Found - E-Commerce Demo',
      description: 'The category you are looking for could not be found.',
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  // Get the category details
  const category = await local.category.findBy('slug', slug)

  // Get products in this category
  const products = (category?.products?.docs as Product[]) ?? []

  return (
    <div className="container mx-auto px-4 py-8">
      {products.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
