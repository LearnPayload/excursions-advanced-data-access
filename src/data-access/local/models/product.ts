import type { Category, Product } from '@/payload-types'
import { CollectionSlug } from 'payload'
import { LocalAccessBase } from '../local-access-base'

export class ProductModel extends LocalAccessBase<Product> {
  protected collectionSlug: CollectionSlug = 'products'

  // Domain-specific method for the products listing page
  async getLatest(depth: number = 1) {
    return this.findWhere(
      {},
      {
        sort: '-createdAt',
        limit: 50,
        depth,
      },
    )
  }

  // Future domain methods (for demonstration of the pattern)
  async getLatestByCategory(categorySlug: Category['slug'], depth: number = 1) {
    return this.findWhere(
      {
        'category.slug': {
          equals: categorySlug,
        },
      },
      {
        sort: '-createdAt',
        depth,
      },
    )
  }

  async getLatestInStock(depth: number = 1) {
    return this.findWhere(
      {
        inventory: { greater_than: 0 },
      },
      {
        sort: '-createdAt',
        depth,
      },
    )
  }

  async getLatestFeatured(depth: number = 1) {
    // This would require a featured field, but shows the pattern
    return this.findWhere(
      {},
      {
        sort: '-createdAt',
        limit: 6,
        depth,
      },
    )
  }
}
