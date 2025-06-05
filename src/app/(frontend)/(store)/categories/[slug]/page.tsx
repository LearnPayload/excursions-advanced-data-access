import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { formatPrice } from '@/lib/utils'
import { local } from '@/data-access/local'
import { Product } from '@/payload-types'

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
  const products = category.products

  return (
    <div className="container mx-auto px-4 py-8">
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  )
}
