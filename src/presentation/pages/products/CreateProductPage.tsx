// src/presentation/pages/CreateProductPage.tsx
import { CreateProductUseCase } from '@/application/useCases/products/CreateProductUseCase'
import { AxiosHttpClient } from '@/infrastructure/http/AxiosHttpClient'
import { CreateProductForm } from '@/presentation/components/products/CreateProductForm'
import { CreateProductViewModel } from '@/presentation/viewModels/CreateProductViewModel'

const httpClient = new AxiosHttpClient('http://your-api-url')
const productRepository = new ProductRepositoryImpl(httpClient)
const createProductUseCase = new CreateProductUseCase(productRepository)
const createProductViewModel = new CreateProductViewModel(createProductUseCase)

export function CreateProductPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
      <CreateProductForm viewModel={createProductViewModel} />
    </div>
  )
}
