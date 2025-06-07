import { formatPrice } from '@/lib/utils'
import { Product } from '@/payload-types'
import Link from 'next/link'

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link
      key={product.id}
      href={`/products/${product.slug}`}
      className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
    >
      <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>

      <div className="flex justify-between items-center mb-2">
        <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
        <span className="text-sm text-gray-500">{product.inventory} in stock</span>
      </div>

      {product.category && typeof product.category === 'object' && (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {product.category.name}
        </span>
      )}
    </Link>
  )
}
