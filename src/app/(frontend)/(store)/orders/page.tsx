import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { Package, CheckCircle, Truck, Clock } from 'lucide-react'
import { getPayloadClient } from '@/db/client'
import { getCurrentUser } from '@/lib/auth'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'My Orders - E-Commerce Demo',
  description: 'View your order history and track the status of your orders.',
}

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth')
  }

  const payload = await getPayloadClient()

  // Get user's orders
  const orders = await payload.find({
    collection: 'orders',
    where: {
      user: { equals: user.id },
    },
    depth: 2, // Populate items.product and user
    sort: '-createdAt',
    limit: 50,
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'processing':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-600" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'cancelled':
        return <div className="w-5 h-5 bg-red-600 rounded-full" />
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'shipped':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (orders.docs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-6">
            You haven&apos;t placed any orders yet. Start shopping to see your orders here.
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
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.docs.map((order) => (
          <div key={order.id} className="bg-white border rounded-lg p-6">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <p className="text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  <span className="ml-2 capitalize">{order.status}</span>
                </div>
                <p className="text-lg font-bold text-green-600 mt-1">{formatPrice(order.total)}</p>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="space-y-3 mb-4">
              {order.items.slice(0, 3).map((item, index: number) => {
                const product = typeof item.product === 'object' ? item.product : null

                if (!product) return null

                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                )
              })}

              {order.items.length > 3 && (
                <p className="text-sm text-gray-600">
                  +{order.items.length - 3} more item{order.items.length - 3 > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Order Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Link
                href={`/orders/${order.id}`}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
              >
                View Details
              </Link>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                Track Order
              </button>
              {order.status === 'delivered' && (
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Reorder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary Stats */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{orders.docs.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(orders.docs.reduce((sum, order) => sum + order.total, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {orders.docs.filter((order) => order.status === 'delivered').length}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {
                orders.docs.filter((order) =>
                  ['pending', 'processing', 'shipped'].includes(order.status),
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}
