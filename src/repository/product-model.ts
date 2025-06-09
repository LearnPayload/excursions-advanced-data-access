import { Product } from '@/payload-types'
import { BaseModel } from './base-model'
import { CollectionSlug } from 'payload'

export class ProductModel extends BaseModel<Product> {
  collection: CollectionSlug = 'products'
}
