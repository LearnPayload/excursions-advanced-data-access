'use server'

import { getCurrentUser } from '@/lib/auth'
import { addToCartSchema, type AddToCartFormData } from './schema'
import { local } from '@/repository'

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

    const { productId, quantity } = addToCartSchema.parse(data)
    const product = await local.product.getByID(productId)

    if (!product) {
      return {
        success: false,
        message: `Product does not exist`,
      }
    }

    const getAcceptedQuantity = (inv: number, qty: number) => {
      return inv >= qty ? qty : inv
    }

    // create a cart for user if one does not exist
    const cart = await local.cart.getCartByUser(user.id)

    if (!cart) {
      await local.cart.create({
        user: user.id,
        products: [
          { product: productId, quantity: getAcceptedQuantity(product.inventory, quantity) },
        ],
      })

      return {
        success: true,
        message: `Updated cart: ${product.name}`,
      }
    }

    /**
     * 1. We have a cart
     * 2. Is the product already in the cart?
     *  a. If YES, increase the quantity (limited by inventory)
     *  b. If NO, add the product to the cart.
     */

    // add product if it has not yet been added
    const productExists = cart.items.find((item) => item.product.id === productId)
    const products = cart.items.map((item) => ({ product: item.product, quantity: item.quantity }))

    if (productExists) {
      await local.cart.update(cart.id, {
        products: products.map((item) => {
          const updatedQuantity =
            item.product.id === product.id ? item.quantity + quantity : item.quantity
          return {
            product: item.product,
            quantity: getAcceptedQuantity(product.inventory, updatedQuantity),
          }
        }),
      })
    } else {
      await local.cart.update(cart.id, {
        products: products.concat([
          {
            product: product,
            quantity,
          },
        ]),
      })
    }

    return {
      success: true,
      message: `Updated cart: ${product.name}`,
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

export async function removeFromCartAction(cartItemId: string): Promise<ActionResult> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'You must be signed in to modify cart',
      }
    }

    // Verify the cart item belongs to the current user
    const cart = await local.cart.getCartByUser(user.id)
    if (!cart) {
      return {
        success: false,
        message: 'Cart item not found',
      }
    }
    const cartItem = cart.items.find((item) => item.id === cartItemId)

    if (!cartItem) {
      return {
        success: false,
        message: 'Cart item not found',
      }
    }

    const filteredItems = cart.items.filter((item) => item.id !== cartItemId)

    await local.cart.update(cart.id, {
      products: filteredItems,
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
