// src/domain/repositories/ProductRepository.spec.ts
import { Product } from '@/domain/entities/Product'
import { HttpError } from '@/shared/errors/http.error'
import { Either, left, right } from '@/shared/types/either'
import {
  PaginatedProducts,
  PaginationParams,
  ProductFilter,
  ProductRepository
} from './ProductRepository'
class MockProductRepository implements ProductRepository {
  private products: Product[] = []
  async findAll(
    params: PaginationParams,
    filters?: ProductFilter
  ): Promise<Either<HttpError, PaginatedProducts>> {
    const products = this.products.filter(p => {
      if (filters?.category && p.category !== filters.category) {
        return false
      }
      if (filters?.minPrice && p.price < filters.minPrice) {
        return false
      }
      if (filters?.maxPrice && p.price > filters.maxPrice) {
        return false
      }
      if (filters?.search && !p.name.includes(filters.search)) {
        return false
      }
      return true
    })
    return new Promise(resolve => {
      resolve(
        right({
          products: products,
          total: products.length,
          page: params.page,
          limit: params.limit
        })
      )
    })
  }
  async findById(id: string): Promise<Either<HttpError, Product>> {
    const product = this.products.find(p => p.id === id)

    if (!product) {
      return new Promise(resolve => {
        resolve(left(new HttpError('Product not found', 404)))
      })
    }
    return new Promise(resolve => {
      resolve(right(product))
    })
  }
  create(product: Product): Promise<Either<HttpError, Product>> {
    this.products.push(product)
    return new Promise(resolve => {
      resolve(right(product))
    })
  }
  update(product: Product): Promise<Either<HttpError, Product>> {
    const index = this.products.findIndex(p => p.id === product.id)
    if (index === -1) {
      return new Promise(resolve => {
        resolve(left(new HttpError('Product not found', 404)))
      })
    }

    this.products[index] = product

    return new Promise(resolve => {
      resolve(right(product))
    })
  }
  delete(id: string): Promise<Either<HttpError, void>> {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) {
      return new Promise(resolve => {
        resolve(left(new HttpError('Product not found', 404)))
      })
    }

    this.products.splice(index, 1)

    return new Promise(resolve => {
      resolve(right(void 0))
    })
  }
}
describe('ProductRepository Interface', () => {
  it.only('should define all required repository methods', () => {
    const repository: ProductRepository = new MockProductRepository()

    expect(repository.findAll).toBeDefined()
    expect(repository.findById).toBeDefined()
    expect(repository.create).toBeDefined()
    expect(repository.update).toBeDefined()
    expect(repository.delete).toBeDefined()
  })

  it('should handle pagination and filters in findAll', async () => {
    const repository = new MockProductRepository()
    const product = Product.create({
      name: 'Product 1',
      price: 10,
      category: 'test',
      description: 'Product 1 description here',
      stock: 10
    })
    repository.create(product)
    const params: PaginationParams = { page: 1, limit: 10 }
    const filters: ProductFilter = { category: 'test' }

    const result = await repository.findAll(params, filters)

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.page).toBe(1)
      expect(result.value.limit).toBe(10)
      expect(Array.isArray(result.value.products)).toBe(true)
    }
  })
})
