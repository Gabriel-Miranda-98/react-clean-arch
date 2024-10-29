import { Product } from '@/domain/entities/Product'
import { ProductRepository } from '@/domain/repositories/ProductRepository'
import { Either, right } from '@/shared/types/either'

export type CreateProductInput = {
  name: string
  description: string
  price: number
  category: string
  stock: number
}

export type CreateProductOutput = Either<null, { product: Product }>

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    const product = Product.create({
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      stock: input.stock
    })

    await this.productRepository.create(product)

    return right({ product })
  }
}
