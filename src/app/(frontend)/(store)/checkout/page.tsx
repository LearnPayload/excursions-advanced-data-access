import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth'
import { formatPrice } from '@/lib/utils'
import { CheckoutForm } from '@/forms/checkout/form'
import { local } from '@/repository'

export const metadata: Metadata = {
  title: 'Checkout - E-Commerce Demo',
  description: 'Complete your order by providing shipping details and payment information.',
}

export default async function CheckoutPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth')
  }

  const cart = await local.cart.getCartByUser(user.id)

  if (!cart || cart.items.length === 0) {
    redirect('/cart')
  }

  // Calculate totals
  const subtotal = cart.items.reduce((sum, item) => {
    if (typeof item.product === 'object' && item.product.price) {
      return sum + item.product.price * item.quantity
    }
    return sum
  }, 0)

  const shipping = 0 // Free shipping
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <CheckoutForm user={user} />
        </div>

        {/* Order Summary */}
        <div className="lg:pl-8">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => {
                const product = typeof item.product === 'object' ? item.product : null

                if (!product) return null

                return (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(product.price * item.quantity)}</p>
                      <p className="text-sm text-gray-600">{formatPrice(product.price)} each</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
