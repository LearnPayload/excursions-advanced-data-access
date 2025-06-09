import { getPayloadClient } from '@/db/client'
import { notFound } from 'next/navigation'
import { CollectionSlug, PaginatedDocs, Where } from 'payload'

export abstract class BaseModel<T> {
  abstract collection: CollectionSlug
  async getBySlugOrFail(slug: string) {
    const doc = await this.getBySlug(slug)

    if (!doc) {
      notFound()
    }

    return doc
  }
  async getFirstOrFail(where: Where = {}) {
    const result = await this.getAll(where)
    if (result.length === 0) {
      notFound()
    }

    return result[0]
  }
  async getBySlug(slug: string): Promise<T | null> {
    const payload = await getPayloadClient()

    const result = (await payload.find({
      collection: this.collection,
      where: { slug: { equals: slug } },
      limit: 1,
    })) as PaginatedDocs<T>

    return result.docs[0] ?? null
  }
  async getAll(where: Where = {}): Promise<T[]> {
    const payload = await getPayloadClient()

    const result = (await payload.find({
      collection: this.collection,
      where,
    })) as PaginatedDocs<T>

    return result.docs ?? []
  }
  async getByID(id: number | string) {
    const payload = await getPayloadClient()

    const result = (await payload.findByID({
      collection: this.collection,
      id,
    })) as T

    return result
  }

  async create(data: Omit<Partial<T>, 'id' | 'createdAt' | 'updatedAt'>) {
    const payload = await getPayloadClient()
    await payload.create({
      collection: this.collection,
      data,
    })
  }
  async update(id: string | number, data: Omit<Partial<T>, 'id' | 'createdAt' | 'updatedAt'>) {
    const payload = await getPayloadClient()
    await payload.update({
      collection: this.collection,
      id,
      data,
    })
  }
  async delete(id: string | number) {
    const payload = await getPayloadClient()
    await payload.delete({
      collection: this.collection,
      id,
    })
  }
}
