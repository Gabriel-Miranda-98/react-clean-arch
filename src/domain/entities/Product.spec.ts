import { ValidationError } from '@/shared/errors/application.error'
import { Product } from './Product'

describe('Product Entity', () => {
  const validProps = {
    name: 'Test Product',
    description: 'This is a test product description that is long enough',
    price: 99.99,
    category: 'Test',
    stock: 10
  }

  describe('Creation', () => {
    it('should create a valid product', () => {
      const product = Product.create(validProps)

      expect(product.id).toBeDefined()
      expect(product.name).toBe(validProps.name)
      expect(product.description).toBe(validProps.description)
      expect(product.price).toBe(validProps.price)
      expect(product.category).toBe(validProps.category)
      expect(product.stock).toBe(validProps.stock)
      expect(product.createdAt).toBeInstanceOf(Date)
      expect(product.updatedAt).toBeInstanceOf(Date)
    })

    it('should throw error for invalid name', () => {
      expect(() => Product.create({ ...validProps, name: 'ab' })).toThrow(
        ValidationError
      )
    })

    it('should throw error for invalid description', () => {
      expect(() => Product.create({ ...validProps, description: '' })).toThrow(
        ValidationError
      )
    })

    it('should throw error for invalid price', () => {
      expect(() => Product.create({ ...validProps, price: -1 })).toThrow(
        ValidationError
      )
    })
  })

  describe('Stock Management', () => {
    it('should add stock correctly', () => {
      const product = Product.create(validProps)
      const initialStock = product.stock

      product.addStock(5)
      expect(product.stock).toBe(initialStock + 5)
    })

    it('should remove stock correctly', () => {
      const product = Product.create(validProps)
      const initialStock = product.stock

      product.removeStock(5)
      expect(product.stock).toBe(initialStock - 5)
    })

    it('should throw error when removing more than available stock', () => {
      const product = Product.create(validProps)

      expect(() => product.removeStock(product.stock + 1)).toThrow(
        ValidationError
      )
    })
  })

  describe('Updates', () => {
    it('should update name correctly', () => {
      const product = Product.create(validProps)
      const newName = 'Updated Product Name'

      product.updateName(newName)
      expect(product.name).toBe(newName)
    })

    it('should update price correctly', () => {
      const product = Product.create(validProps)
      const newPrice = 199.99

      product.updatePrice(newPrice)
      expect(product.price).toBe(newPrice)
    })

    it('should update updatedAt on any change', () => {
      const product = Product.create(validProps)
      const initialUpdatedAt = product.updatedAt

      // Wait a millisecond to ensure different timestamp
      setTimeout(() => {
        product.updateName('New Name')
        expect(product.updatedAt.getTime()).toBeGreaterThan(
          initialUpdatedAt.getTime()
        )
      }, 1)
    })
  })

  describe('Reconstruction', () => {
    it('should reconstruct a product from persistence', () => {
      const persistedData = {
        id: '123',
        ...validProps,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      }

      const product = Product.reconstruct(persistedData)

      expect(product.id).toBe(persistedData.id)
      expect(product.createdAt).toEqual(persistedData.createdAt)
      expect(product.updatedAt).toEqual(persistedData.updatedAt)
    })
  })
})
