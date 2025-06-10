import { Metadata } from 'next'
import { Product } from '@/payload-types'
import { ProductCard } from '@/components/ProductCard'
import { local } from '@/repository'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const category = await local.category.getBySlug(slug)

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

  const category = await local.category.getBySlugOrFail(slug)

  // Get products in this category
  const products = (category?.products?.docs as Product[]) ?? []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-bold text-2xl mb-3">{category.name}</h1>
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
