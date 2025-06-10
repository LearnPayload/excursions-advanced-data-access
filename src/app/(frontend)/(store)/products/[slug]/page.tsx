import Link from 'next/link'
import { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth'
import { formatPrice } from '@/lib/utils'
import { AddToCartForm } from '@/forms/cart/form'
import { local } from '@/repository'

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await local.product.getBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found - E-Commerce Demo',
      description: 'The product you are looking for could not be found.',
    }
  }

  const categoryName =
    product.category && typeof product.category === 'object' ? product.category.name : ''

  return {
    title: `${product.name} - E-Commerce Demo`,
    description:
      product.description ||
      `${product.name} ${categoryName ? `in ${categoryName}` : ''} - ${product.price}`,
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const user = await getCurrentUser()

  const product = await local.product.getBySlugOrFail(slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

        {product.category && typeof product.category === 'object' && (
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded mb-4">
            {product.category.name}
          </span>
        )}

        <div className="flex items-center gap-6 mb-6">
          <span className="text-3xl font-bold text-green-600">{formatPrice(product.price)}</span>
          <span className="text-lg text-gray-600">{product.inventory} in stock</span>
        </div>

        {product.description && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}

        <div className="border-t pt-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add to Cart</h2>
          <div className="max-w-md">
            <AddToCartForm
              productId={product.id}
              maxQuantity={product.inventory}
              isAuthenticated={!!user}
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Product Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Price:</span>
              <span className="ml-2">{formatPrice(product.price)}</span>
            </div>
            <div>
              <span className="font-medium">Inventory:</span>
              <span className="ml-2">{product.inventory} units</span>
            </div>
            <div>
              <span className="font-medium">Category:</span>
              <span className="ml-2">
                {product.category && typeof product.category === 'object'
                  ? product.category.name
                  : 'Uncategorized'}
              </span>
            </div>
            <div>
              <span className="font-medium">Product ID:</span>
              <span className="ml-2 font-mono text-sm">{product.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
