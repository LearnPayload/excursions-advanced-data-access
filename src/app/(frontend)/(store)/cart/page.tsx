import Link from 'next/link'
import { Metadata } from 'next'
import { requireAuth } from '@/lib/auth'
import { formatPrice } from '@/lib/utils'
import { RemoveFromCartButton } from '@/components/RemoveFromCartButton'
import { local } from '@/data-access/local'

export const metadata: Metadata = {
  title: 'Shopping Cart - E-Commerce Demo',
  description: 'Review items in your shopping cart and proceed to checkout.',
}

export default async function CartPage() {
  const user = await requireAuth()

  const cart = await local.cart.getCartByUser(user.id)

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => {
              const product = typeof item.product === 'object' ? item.product : null

              if (!product) return null

              return (
                <div key={item.id} className="border rounded-lg p-6 bg-white">
                  <div className="flex items-center space-x-4">
                    {/* Product Info */}
                    <div className="flex-1">
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-xl font-semibold hover:text-blue-600 transition-colors"
                      >
                        {product.name}
                      </Link>

                      {product.category && typeof product.category === 'object' && (
                        <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
                      )}

                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-lg font-bold text-green-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-gray-600">Qty: {item.quantity}</span>
                        <span className="text-lg font-semibold">
                          {formatPrice(product.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <RemoveFromCartButton cartItemId={Number(item.id)} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-white sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Items ({cart.items.length})</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">{formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="block text-center text-blue-600 hover:text-blue-800 mt-4"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
