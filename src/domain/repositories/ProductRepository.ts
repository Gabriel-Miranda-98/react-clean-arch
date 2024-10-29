// src/domain/repositories/ProductRepository.ts
import { Product } from '@/domain/entities/Product'
import { HttpError } from '@/shared/errors/http.error'
import { Either } from '@/shared/types/either'

export type ProductFilter = {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
}

export type PaginationParams = {
  page: number
  limit: number
}

export type PaginatedProducts = {
  products: Product[]
  total: number
  page: number
  limit: number
}

export interface ProductRepository {
  findAll(
    params: PaginationParams,
    filters?: ProductFilter
  ): Promise<Either<HttpError, PaginatedProducts>>
  findById(id: string): Promise<Either<HttpError, Product>>
  create(product: Product): Promise<Either<HttpError, Product>>
  update(product: Product): Promise<Either<HttpError, Product>>
  delete(id: string): Promise<Either<HttpError, void>>
}
