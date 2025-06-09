import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { CheckCircle, Package, Truck } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { formatPrice } from '@/lib/utils'
import { local } from '@/repository/local'

interface OrderPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { id } = await params

  return {
    title: `Order #${id} - E-Commerce Demo`,
    description: `View details and track the status of your order #${id}.`,
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth')
  }

  const order = await local.order.getFirstOrFail({
    id: { equals: Number(id) },
    user: { equals: user.id },
  })

  // Verify the order belongs to the current user
  const orderUserId = typeof order.user === 'object' ? order.user.id : order.user
  if (orderUserId !== user.id) {
    notFound()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="w-6 h-6 border-2 border-yellow-500 rounded-full animate-spin border-t-transparent" />
        )
      case 'processing':
        return <Package className="w-6 h-6 text-blue-600" />
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-600" />
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      default:
        return <div className="w-6 h-6 bg-gray-300 rounded-full" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Pending'
      case 'processing':
        return 'Order Processing'
      case 'shipped':
        return 'Order Shipped'
      case 'delivered':
        return 'Order Delivered'
      case 'cancelled':
        return 'Order Cancelled'
      default:
        return 'Unknown Status'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">
          Thank you for your order. We'll send you updates as your order progresses.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Order Status */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Order #{order.id}</h2>
            <div className="flex items-center space-x-2">
              {getStatusIcon(order.status)}
              <span className="font-medium capitalize">{getStatusText(order.status)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Order Date:</span>
              <span className="ml-2">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="font-medium">Order Total:</span>
              <span className="ml-2 text-green-600 font-semibold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>

          <div className="space-y-4">
            {order.items.map((item: any, index: number) => {
              const product = typeof item.product === 'object' ? item.product : null

              if (!product) return null

              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 py-4 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    {product.category && typeof product.category === 'object' && (
                      <p className="text-sm text-gray-500">{product.category.name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="text-right font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-lg font-bold text-green-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>We'll prepare your items for shipping</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>You'll receive a tracking number via email</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Your order will be delivered in 3-5 business days</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/products"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
          >
            Continue Shopping
          </Link>
          <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Track Order
          </button>
        </div>
      </div>
    </div>
  )
}
