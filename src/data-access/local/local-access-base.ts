import { getPayloadClient } from '@/db/client'
import type { BaseDataAccess, QueryOptions, FindManyResult } from '../types'
import { CollectionSlug, PaginatedDocs, Where } from 'payload'
import { notFound } from 'next/navigation'

interface BaseDocument {
  id: string | number
}

// Base class for Local API (direct Payload calls)
export abstract class LocalAccessBase<T extends BaseDocument> implements BaseDataAccess<T> {
  protected abstract collectionSlug: CollectionSlug

  protected async getPayload() {
    return await getPayloadClient()
  }

  /**
   * Returns the *first* record with a given attribute or notFound Exception if no record is found.
   * Example: local.product.findBy("slug", "iphone")
   * @param id
   * @returns
   */
  async findBy(attribute: keyof T, value: any): Promise<T> {
    try {
      const payload = await this.getPayload()
      const result = await payload.find({
        collection: this.collectionSlug,
        where: { [attribute]: { equals: value } },
        depth: 1,
      })

      return result.docs[0] as unknown as T
    } catch (error) {
      notFound()
    }
  }

  /**
   * Alternative to LocalAccessBase.findBy(id: 42). Will throw an exception if no matching record is found.
   * @param id
   * @returns
   */
  async find(id: string | number): Promise<T | null> {
    try {
      const payload = await this.getPayload()
      const result = await payload.findByID({
        collection: this.collectionSlug,
        id,
        depth: 1,
      })
      return result as unknown as T
    } catch (error) {
      notFound()
    }
  }

  async findWhere(where: Where = {}, options: QueryOptions = {}): Promise<PaginatedDocs<T>> {
    const payload = await this.getPayload()

    const result = (await payload.find({
      collection: this.collectionSlug,
      where,
      limit: options.limit || 50,
      sort: options.sort || '-createdAt',
      depth: options.depth || 1,
    })) as unknown as PaginatedDocs<T>

    return result
  }

  async create(data: Omit<Partial<T>, 'id'>): Promise<T> {
    const payload = await this.getPayload()
    const result = await payload.create({
      collection: this.collectionSlug,
      data,
    })
    return result as unknown as T
  }

  async update(id: string | number, data: Omit<Partial<T>, 'id'>): Promise<T> {
    const payload = await this.getPayload()
    const result = await payload.update({
      collection: this.collectionSlug,
      id,
      data,
    })
    return result as unknown as T
  }

  async delete(id: string): Promise<void> {
    const payload = await this.getPayload()
    await payload.delete({
      collection: this.collectionSlug,
      id,
    })
  }
}
