import { PaginatedDocs, Where } from 'payload'

// Base types for our data access layer
export interface QueryOptions {
  limit?: number
  sort?: string
  depth?: number
}

export interface FindManyResult<T> extends PaginatedDocs<T> {}

// Base interface that all backend implementations must follow
export interface BaseDataAccess<T> {
  find(id: string): Promise<T | null>
  findWhere(where: Where, options?: QueryOptions): Promise<FindManyResult<T>>
  create(data: Partial<T>): Promise<T>
  update(id: string, data: Partial<T>): Promise<T>
  delete(id: string): Promise<void>
}
