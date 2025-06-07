import { CollectionSlug } from 'payload'
import { LocalAccessBase } from '../local-access-base'
import { Category } from '@/payload-types'

export class CategoryModel extends LocalAccessBase<Category> {
  protected collectionSlug: CollectionSlug = 'categories'
}
