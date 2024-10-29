import {
  CreateProductInput,
  CreateProductOutput,
  CreateProductUseCase
} from '@/application/useCases/products/CreateProductUseCase'
import { makeProduct } from '@/domain/entities/__test__/make-product'
import { right } from '@/shared/types/either'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateProductViewModel } from './CreateProductViewModel'

describe('CreateProductViewModel', () => {
  let createProductUseCase: CreateProductUseCase
  let viewModel: CreateProductViewModel

  beforeEach(() => {
    createProductUseCase = {
      execute: vi.fn()
    } as unknown as CreateProductUseCase
    viewModel = new CreateProductViewModel(createProductUseCase)
  })

  it('should initialize with the correct state', () => {
    const state = viewModel.getState()
    expect(state).toEqual({
      loading: false,
      error: null,
      success: false
    })
  })

  it('should set loading state when execute is called', async () => {
    const input: CreateProductInput = {
      name: 'Test Product',
      price: 100,
      category: 'teste',
      description: 'Description Teste',
      stock: 10
    }
    const output: CreateProductOutput = right({
      product: makeProduct({
        ...input
      })
    })

    vi.spyOn(createProductUseCase, 'execute').mockResolvedValue(output)

    const promise = viewModel.execute(input)
    expect(viewModel.getState().loading).toBe(true)

    await promise
  })

  it('should set success state when execute is successful', async () => {
    const input: CreateProductInput = {
      name: 'Test Product',
      price: 100,
      category: 'teste',
      description: 'Description Teste',
      stock: 10
    }
    const product = makeProduct({
      ...input
    })
    const output: CreateProductOutput = right({ product })

    vi.spyOn(createProductUseCase, 'execute').mockResolvedValue(output)

    await viewModel.execute(input)

    const state = viewModel.getState()
    expect(state).toEqual({
      loading: false,
      error: null,
      success: true,
      product
    })
  })

  // it('should set error state when execute fails', async () => {
  //   const input: CreateProductInput = {
  //     name: 'Test Product',
  //     price: 100,
  //     category: 'teste',
  //     description: 'Description Teste',
  //     stock: 10
  //   }
  //   const error = new Error('Test Error')
  //   const output: CreateProductOutput = left(error)

  //   vi.spyOn(createProductUseCase, 'execute').mockResolvedValue(output)

  //   await expect(viewModel.execute(input)).rejects.toThrow('Test Error')

  //   const state = viewModel.getState()
  //   expect(state).toEqual({
  //     loading: false,
  //     error: 'An unexpected error occurred',
  //     success: false
  //   })
  // })

  // it('should notify listeners when state changes', async () => {
  //   const listener = vi.fn()
  //   viewModel.subscribe(listener)

  //   const input: CreateProductInput = { name: 'Test Product', price: 100 }
  //   const product = new Product('1', 'Test Product', 100)
  //   const output: CreateProductOutput = right({ product })

  //   vi.spyOn(createProductUseCase, 'execute').mockResolvedValue(output)

  //   await viewModel.execute(input)

  //   expect(listener).toHaveBeenCalled()
  // })
})
