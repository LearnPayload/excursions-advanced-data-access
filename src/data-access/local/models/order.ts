import { CollectionSlug } from 'payload'
import { LocalAccessBase } from '../local-access-base'
import { Order } from '@/payload-types'

export class OrderModel extends LocalAccessBase<Order> {
  protected collectionSlug: CollectionSlug = 'orders'
}
