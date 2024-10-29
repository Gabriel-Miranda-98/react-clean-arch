import { Product } from '@/domain/entities/Product'

type Override = Partial<Parameters<typeof Product.create>[0]>

export const makeProduct = (override: Override = {}): Product => {
  return Product.create({
    name: 'Test Product',
    description: 'Test Description that is long enough',
    price: 100,
    category: 'test',
    stock: 10,
    ...override
  })
}
