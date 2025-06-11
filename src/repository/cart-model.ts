import { Cart, Product, User } from '@/payload-types'
import { BaseModel } from './base-model'
import { CollectionSlug } from 'payload'

export type CartDetail = {
  id: number
  total: number
  items: {
    id: string
    quantity: number
    product: Product
  }[]
}
export class CartModel extends BaseModel<Cart> {
  collection: CollectionSlug = 'cart'

  async getCartByUser(userId: User['id']): Promise<CartDetail | null> {
    try {
      const cart = await this.getFirst({ user: { equals: userId } })
      if (!cart) return null
      const items = cart ? (cart.products ?? []) : []
      const preparedItems = items.map((item) => {
        const product = item.product as Product
        return { id: item.id!, quantity: item.quantity, product }
      })

      const total = preparedItems.reduce((sum, item) => {
        if (item.product) {
          return sum + item.product.price * item.quantity
        }
        return sum
      }, 0)
      return {
        id: cart.id,
        total,
        items: preparedItems,
      }
    } catch (error: unknown) {
      console.error(error)
      return {
        id: 0,
        total: 0,
        items: [],
      }
    }
  }
}
