'use server'

import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/db/client'
import { getCurrentUser } from '@/lib/auth'
import { checkoutSchema, type CheckoutFormData } from './schema'

interface ActionResult {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
  orderId?: string
}

export async function processCheckoutAction(data: CheckoutFormData): Promise<ActionResult> {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'You must be signed in to checkout',
      }
    }

    // Validate input
    checkoutSchema.parse(data)

    const payload = await getPayloadClient()

    // Get user's cart items
    const cartItems = await payload.find({
      collection: 'cart-items',
      where: {
        user: { equals: user.id },
      },
      depth: 2, // Populate product details
    })

    if (cartItems.docs.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty',
      }
    }

    // Verify inventory and calculate total
    let total = 0
    const orderItems = []

    for (const cartItem of cartItems.docs) {
      const product = typeof cartItem.product === 'object' ? cartItem.product : null

      if (!product) {
        return {
          success: false,
          message: 'One or more products in your cart are no longer available',
        }
      }

      // Check inventory
      if (product.inventory < cartItem.quantity) {
        return {
          success: false,
          message: `Sorry, only ${product.inventory} ${product.name}(s) available`,
        }
      }

      const itemTotal = product.price * cartItem.quantity
      total += itemTotal

      orderItems.push({
        product: Number(product.id),
        quantity: cartItem.quantity,
        price: product.price,
      })
    }

    // Create the order
    const order = await payload.create({
      collection: 'orders',
      data: {
        user: user.id,
        status: 'pending',
        items: orderItems,
        total: total,
      },
    })

    // Update product inventory
    for (const cartItem of cartItems.docs) {
      const product = typeof cartItem.product === 'object' ? cartItem.product : null
      if (product) {
        await payload.update({
          collection: 'products',
          id: Number(product.id),
          data: {
            inventory: product.inventory - cartItem.quantity,
          },
        })
      }
    }

    // Update product inventory
    for (const cartItem of cartItems.docs) {
      const product = typeof cartItem.product === 'object' ? cartItem.product : null
      if (product) {
        await payload.update({
          collection: 'products',
          id: Number(product.id),
          data: {
            inventory: product.inventory - cartItem.quantity,
          },
        })
      }
    }

    // Clear the user's cart
    for (const cartItem of cartItems.docs) {
      await payload.delete({
        collection: 'cart-items',
        id: Number(cartItem.id),
      })
    }

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update order status to processing (simulating successful payment)
    await payload.update({
      collection: 'orders',
      id: Number(order.id),
      data: {
        status: 'processing',
      },
    })

    return {
      success: true,
      message: 'Order placed successfully!',
      orderId: String(order.id),
    }
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return {
        success: false,
        fieldErrors: error.flatten().fieldErrors,
      }
    }

    return {
      success: false,
      message: error.message || 'Failed to process checkout. Please try again.',
    }
  }
}

export async function redirectToOrderConfirmation(orderId: string) {
  redirect(`/orders/${orderId}`)
}
