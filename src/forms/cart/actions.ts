'use server'

import { getPayloadClient } from '@/db/client'
import { getCurrentUser } from '@/lib/auth'
import { addToCartSchema, type AddToCartFormData } from './schema'
import { local } from '@/data-access/local'

interface ActionResult {
  success: boolean
  message?: string
  fieldErrors?: Record<string, string[]>
}

export async function addToCartAction(data: AddToCartFormData): Promise<ActionResult> {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'You must be signed in to add items to cart',
      }
    }

    // Validate input
    const validatedData = addToCartSchema.parse(data)

    // Check if product exists and has sufficient inventory
    const product = await local.product.find(validatedData.productId)

    if (!product) {
      return {
        success: false,
        message: 'Product not found',
      }
    }

    if (product.inventory < validatedData.quantity) {
      return {
        success: false,
        message: `Only ${product.inventory} items available in stock`,
      }
    }

    // Check if item already exists in cart for this user
    const existingCartItem = await local.cart.cartItemExists(user.id, validatedData.productId)

    if (existingCartItem) {
      // Update existing cart item quantity
      const newQuantity = existingCartItem.quantity + validatedData.quantity

      if (newQuantity > product.inventory) {
        return {
          success: false,
          message: `Cannot add ${validatedData.quantity} more. Only ${product.inventory - existingCartItem.quantity} more available`,
        }
      }

      await local.cart.update(existingCartItem.id, {
        quantity: newQuantity,
      })

      return {
        success: true,
        message: `Updated cart: ${newQuantity} ${product.name}${newQuantity > 1 ? 's' : ''}`,
      }
    } else {
      await local.cart.create({
        user: user.id,
        product: Number(validatedData.productId),
        quantity: validatedData.quantity,
      })

      return {
        success: true,
        message: `Added ${validatedData.quantity} ${product.name}${validatedData.quantity > 1 ? 's' : ''} to cart`,
      }
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
      message: error.message || 'Failed to add item to cart. Please try again.',
    }
  }
}

export async function removeFromCartAction(cartItemId: number): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'You must be signed in to modify cart',
      }
    }

    const payload = await getPayloadClient()

    // Verify the cart item belongs to the current user
    const cartItem = await payload.findByID({
      collection: 'cart-items',
      id: cartItemId,
    })

    if (!cartItem) {
      return {
        success: false,
        message: 'Cart item not found',
      }
    }

    // Check if the cart item belongs to the current user
    const userId = typeof cartItem.user === 'object' ? cartItem.user.id : cartItem.user
    if (userId !== user.id) {
      return {
        success: false,
        message: 'Cart item not found',
      }
    }

    await payload.delete({
      collection: 'cart-items',
      id: cartItemId,
    })

    return {
      success: true,
      message: 'Item removed from cart',
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to remove item from cart. Please try again.',
    }
  }
}
