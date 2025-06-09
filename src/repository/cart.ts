import { CartItem } from '@/payload-types'
import { BaseModel } from './base-model'
import { CollectionSlug } from 'payload'

export class CartModel extends BaseModel<CartItem> {
  collection: CollectionSlug = 'cart-items'
}
