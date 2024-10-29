// src/presentation/adapters/useCreateProductAdapter.ts
import { CreateProductInput } from '@/application/useCases/products/CreateProductUseCase'
import { CreateProductViewModel } from '@/presentation/viewModels/CreateProductViewModel'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function useCreateProductAdapter(viewModel: CreateProductViewModel) {
  const queryClient = useQueryClient()
  const [state, setState] = useState(() => viewModel.getState())

  useEffect(() => {
    const unsubscribe = viewModel.subscribe(() => {
      setState(viewModel.getState())
    })
    return unsubscribe
  }, [viewModel])

  const mutation = useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const result = await viewModel.execute(input)

      if (result.isRight()) {
        return result.value
      }
      throw result.value
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })

  return {
    ...mutation,
    state
  }
}
