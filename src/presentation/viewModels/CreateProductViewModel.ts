import {
  CreateProductInput,
  CreateProductOutput,
  CreateProductUseCase
} from '@/application/useCases/products/CreateProductUseCase'
import { Product } from '@/domain/entities/Product'

export type CreateProductState = {
  loading: boolean
  error: string | null
  success: boolean
  product?: Product
}

export class CreateProductViewModel {
  private state: CreateProductState = {
    loading: false,
    error: null,
    success: false
  }

  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  async execute(input: CreateProductInput): Promise<CreateProductOutput> {
    this.setState({ loading: true })

    try {
      const result = await this.createProductUseCase.execute(input)

      if (result.isRight()) {
        this.setState({
          loading: false,
          error: null,
          success: true,
          product: result.value.product
        })
      }

      return result
    } catch (error) {
      this.setState({
        loading: false,
        error: 'An unexpected error occurred',
        success: false
      })
      throw error
    }
  }

  getState(): CreateProductState {
    return this.state
  }

  private setState(newState: Partial<CreateProductState>): void {
    this.state = { ...this.state, ...newState }
    this.notify()
  }

  private listeners = new Set<() => void>()

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    this.listeners.forEach(listener => listener())
  }
}
