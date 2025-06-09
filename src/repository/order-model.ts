import { CollectionSlug } from 'payload'
import { Order } from '@/payload-types'
import { BaseModel } from './base-model'

export class OrderModel extends BaseModel<Order> {
  collection: CollectionSlug = 'orders'
}
