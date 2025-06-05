import { CollectionSlug } from 'payload'
import { LocalAccessBase } from '../local-access-base'
import { Category } from '@/payload-types'
import { notFound } from 'next/navigation'
import { ProductModel } from './product'

export class CategoryModel extends LocalAccessBase<Category> {
  protected collectionSlug: CollectionSlug = 'categories'

  get products() {
    const products = this.attributes?.products?.docs ?? []
    return products
  }
}
