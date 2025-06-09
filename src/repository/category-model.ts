import { Category } from '@/payload-types'
import { BaseModel } from './base-model'
import { CollectionSlug } from 'payload'

export class CategoryModel extends BaseModel<Category> {
  collection: CollectionSlug = 'categories'
}
