import { Metadata } from 'next'
import { local } from '@/data-access/local'
import { Product } from '@/payload-types'
import { ProductCard } from '@/components/ProductCard'
import { getPayloadClient } from '@/db/client'
import { notFound } from 'next/navigation'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayloadClient()

    // Get the category details
    const result = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    const category = result.docs[0]

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

  const payload = await getPayloadClient()

  // Get the category details
  const result = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (result.totalDocs === 0) {
    notFound()
  }

  const category = result.docs[0]

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
