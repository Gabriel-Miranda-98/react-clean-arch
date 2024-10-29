import { Product } from '@/domain/entities/Product'
import { ProductRepository } from '@/domain/repositories/ProductRepository'
import { describe, expect, it, vi } from 'vitest'
import { CreateProductUseCase } from './CreateProductUseCase'

describe('CreateProductUseCase', () => {
  it('should create a product successfully', async () => {
    const mockProductRepository: ProductRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }

    const createProductUseCase = new CreateProductUseCase(mockProductRepository)

    const input = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      category: 'Test Category',
      stock: 10
    }

    const product = Product.create(input)

    vi.spyOn(Product, 'create').mockReturnValue(product)

    const result = await createProductUseCase.execute(input)
    if (result.isRight()) {
      expect(result.value.product).toEqual(product)
      expect(mockProductRepository.create).toHaveBeenCalledWith(product)
    }
  })

  it('should throw an error if product creation fails', async () => {
    const mockProductRepository: ProductRepository = {
      create: vi.fn().mockRejectedValue(new Error('Failed to create product')),
      delete: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn()
    }

    const createProductUseCase = new CreateProductUseCase(mockProductRepository)

    const input = {
      name: 'Test Product',
      description: 'Test Description',
      price: 100,
      category: 'Test Category',
      stock: 10
    }

    await expect(createProductUseCase.execute(input)).rejects.toThrow(
      'Failed to create product'
    )
  })
})
