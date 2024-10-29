// src/infrastructure/http/AxiosHttpClient.spec.ts
import { HttpError } from '@/shared/errors/http.error'
import { HttpMethod, HttpStatusCode } from '@/shared/interfaces/HttpClient'
import axios, { type AxiosInstance } from 'axios'
import { AxiosHttpClient } from './AxiosHttpClient'

vi.mock('axios')

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let mockAxiosInstance: { request: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockAxiosInstance = {
      request: vi.fn()
    }

    vi.mocked(axios.create).mockReturnValue(
      mockAxiosInstance as unknown as AxiosInstance
    )
    sut = new AxiosHttpClient('http://api.test')
    vi.clearAllMocks()
  })

  const mockSuccessResponse = {
    status: HttpStatusCode.OK,
    data: { result: 'success' },
    headers: { 'content-type': 'application/json' }
  }

  describe('GET', () => {
    it('should make successful GET request', async () => {
      mockAxiosInstance.request.mockResolvedValueOnce(mockSuccessResponse)

      const result = await sut.get('/test', { page: 1 }, { 'X-Test': 'test' })

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/test',
        method: HttpMethod.GET,
        params: { page: 1 },
        headers: { 'X-Test': 'test', 'Content-Type': 'application/json' },
        data: undefined
      })

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.statusCode).toBe(HttpStatusCode.OK)
        expect(result.value.body).toEqual({ result: 'success' })
      }
    })

    it('should handle GET request error', async () => {
      // Criando um erro do Axios com a estrutura correta
      const errorResponse = {
        status: HttpStatusCode.NOT_FOUND,
        data: { error: 'Resource not found' },
        statusText: 'Not Found',
        headers: {},
        config: {}
      }

      const axiosError = {
        isAxiosError: true,
        name: 'AxiosError',
        message: 'Request failed with status code 404',
        code: 'ERR_BAD_REQUEST',
        config: { method: 'GET' },
        response: errorResponse // Importante: definindo a response explicitamente
      }

      mockAxiosInstance.request.mockImplementationOnce(() =>
        Promise.reject(axiosError)
      )

      const result = await sut.get('/test')
     

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(HttpError)
        expect(result.value.statusCode).toBe(HttpStatusCode.NOT_FOUND)
        expect(result.value.body).toEqual({ error: 'Resource not found' })
      }
    })
  })

  describe('POST', () => {
    it('should make successful POST request with data', async () => {
      mockAxiosInstance.request.mockResolvedValueOnce(mockSuccessResponse)
      const postData = { name: 'test' }

      const result = await sut.post('/test', postData)

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/test',
        method: HttpMethod.POST,
        data: postData,
        headers: { 'Content-Type': 'application/json' }
      })

      expect(result.isRight()).toBe(true)
    })
  })

  describe('PUT', () => {
    it('should make successful PUT request with data', async () => {
      mockAxiosInstance.request.mockResolvedValueOnce(mockSuccessResponse)
      const putData = { name: 'test' }

      const result = await sut.put('/test', putData)

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/test',
        method: HttpMethod.PUT,
        data: putData,
        headers: { 'Content-Type': 'application/json' }
      })

      expect(result.isRight()).toBe(true)
    })
  })

  describe('PATCH', () => {
    it('should make successful PATCH request with data', async () => {
      mockAxiosInstance.request.mockResolvedValueOnce(mockSuccessResponse)
      const patchData = { name: 'test' }

      const result = await sut.patch('/test', patchData)

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/test',
        method: HttpMethod.PATCH,
        data: patchData,
        headers: { 'Content-Type': 'application/json' }
      })

      expect(result.isRight()).toBe(true)
    })
  })

  describe('DELETE', () => {
    it('should make successful DELETE request', async () => {
      mockAxiosInstance.request.mockResolvedValueOnce(mockSuccessResponse)

      const result = await sut.delete('/test')

      expect(mockAxiosInstance.request).toHaveBeenCalledWith({
        url: '/test',
        method: HttpMethod.DELETE,
        headers: { 'Content-Type': 'application/json' }
      })

      expect(result.isRight()).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle non-Axios errors', async () => {
      mockAxiosInstance.request.mockRejectedValueOnce(
        new Error('Unknown error')
      )

      const result = await sut.get('/test')
      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value.statusCode).toBe(
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
        expect(result.value.message).toBe('Unknown error')
      }
    })

    it('should handle network errors', async () => {
      const networkError = {
        isAxiosError: true,
        message: 'Network Error',
        response: undefined
      }
      mockAxiosInstance.request.mockRejectedValueOnce(networkError)

      const result = await sut.get('/test')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value.statusCode).toBe(
          HttpStatusCode.INTERNAL_SERVER_ERROR
        )
        expect(result.value.message).toBe('Network Error')
      }
    })

    it('should handle axios errors with invalid status', async () => {
      const error = {
        isAxiosError: true,
        message: 'Bad Request',
        response: {
          status: 418, // Status não mapeado
          data: { error: 'Im a teapot' }
        }
      }

      mockAxiosInstance.request.mockRejectedValueOnce(error)

      const result = await sut.get('/test')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value.statusCode).toBe(418)
        expect(result.value.body).toEqual({ error: 'Im a teapot' })
      }
    })
  })
})
