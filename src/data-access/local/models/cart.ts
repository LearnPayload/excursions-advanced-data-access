import { CollectionSlug } from 'payload'
import { LocalAccessBase } from '../local-access-base'
import { CartItem, User } from '@/payload-types'

export type Cart = {
  total: number
  items: CartItem[]
}

export class CartModel extends LocalAccessBase<CartItem> {
  protected collectionSlug: CollectionSlug = 'cart-items'

  async cartItemExists(
    userId: CartItem['user'],
    productId: CartItem['product'],
  ): Promise<CartItem | null> {
    const result = await this.findWhere({
      and: [{ user: { equals: userId } }, { product: { equals: productId } }],
    })

    return result.docs?.at(0) ?? null
  }

  async getCartByUser(userId: User['id']): Promise<Cart> {
    try {
      const result = await this.findWhere(
        { user: { equals: userId } },
        {
          limit: 1,
          depth: 2,
        },
      )
      const items = result.docs || []

      const total = items.reduce((sum, item) => {
        if (typeof item.product === 'object' && item.product.price) {
          return sum + item.product.price * item.quantity
        }
        return sum
      }, 0)
      return {
        total,
        items,
      }
    } catch (error) {
      return {
        total: 0,
        items: [],
      }
    }
  }
}
