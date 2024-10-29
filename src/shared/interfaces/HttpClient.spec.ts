// src/shared/interfaces/http-client.spec.ts
import { describe, expect, it, vi } from 'vitest'
import { HttpError } from '../errors/http.error'
import { left, right } from '../types/either'
import {
  HttpMethod,
  HttpStatusCode,
  type HttpClient,
  type HttpHeaders,
  type HttpQueryParams,
  type HttpRequest,
  type HttpResponse
} from './HttpClient'

describe('HttpClient Interface', () => {
  // Mock implementation para testar os tipos
  class MockHttpClient implements HttpClient {
    request = vi.fn()
    get = vi.fn()
    post = vi.fn()
    put = vi.fn()
    patch = vi.fn()
    delete = vi.fn()
  }

  let httpClient: HttpClient

  beforeEach(() => {
    httpClient = new MockHttpClient()
  })

  describe('Type Safety', () => {
    it('should accept valid GET request', () => {
      const request: HttpRequest = {
        url: '/test',
        method: HttpMethod.GET,
        params: { page: 1 },
        headers: { 'Content-Type': 'application/json' }
      }

      expect(request.method).toBe(HttpMethod.GET)
    })

    it('should accept valid POST request with data', () => {
      const request: HttpRequest = {
        url: '/test',
        method: HttpMethod.POST,
        data: { test: true },
        headers: { 'Content-Type': 'application/json' }
      }

      expect(request.method).toBe(HttpMethod.POST)
    })

    it('should validate Content-Type header values', () => {
      const validHeaders: HttpHeaders = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token'
      }

      expect(validHeaders['Content-Type']).toBe('application/json')
    })

    it('should validate query params types', () => {
      const validParams: HttpQueryParams = {
        page: 1,
        active: true,
        search: 'test'
      }

      expect(typeof validParams.page).toBe('number')
    })
  })

  describe('Response Handling', () => {
    it('should handle success response', async () => {
      const successResponse: HttpResponse = {
        statusCode: HttpStatusCode.OK,
        body: { data: 'test' },
        headers: { 'Content-Type': 'application/json' }
      }

      vi.mocked(httpClient.get).mockResolvedValue(right(successResponse))

      const result = await httpClient.get('/test')

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.statusCode).toBe(HttpStatusCode.OK)
        expect(result.value.body).toEqual({ data: 'test' })
      }
    })

    it('should handle error response', async () => {
      const error = new HttpError('Not Found', HttpStatusCode.NOT_FOUND, {
        message: 'Resource not found'
      })

      vi.mocked(httpClient.get).mockResolvedValue(left(error))

      const result = await httpClient.get('/test')

      expect(result.isLeft()).toBe(true)
      if (result.isLeft()) {
        expect(result.value).toBeInstanceOf(HttpError)
        expect(result.value.statusCode).toBe(HttpStatusCode.NOT_FOUND)
      }
    })
  })

  describe('HTTP Methods', () => {
    const mockSuccessResponse: HttpResponse = {
      statusCode: HttpStatusCode.OK,
      body: { success: true }
    }

    it('should implement GET method correctly', async () => {
      vi.mocked(httpClient.get).mockResolvedValue(right(mockSuccessResponse))

      const params = { page: 1 }
      const headers = { Authorization: 'Bearer token' }

      await httpClient.get('/test', params, headers)

      expect(httpClient.get).toHaveBeenCalledWith('/test', params, headers)
    })

    it('should implement POST method correctly', async () => {
      vi.mocked(httpClient.post).mockResolvedValue(right(mockSuccessResponse))

      const data = { test: true }
      const headers = { 'Content-Type': 'application/json' } as HttpHeaders

      await httpClient.post('/test', data, headers)

      expect(httpClient.post).toHaveBeenCalledWith('/test', data, headers)
    })

    it('should implement PUT method correctly', async () => {
      vi.mocked(httpClient.put).mockResolvedValue(right(mockSuccessResponse))

      const data = { test: true }
      const headers = { 'Content-Type': 'application/json' } as HttpHeaders

      await httpClient.put('/test', data, headers)

      expect(httpClient.put).toHaveBeenCalledWith('/test', data, headers)
    })

    it('should implement PATCH method correctly', async () => {
      vi.mocked(httpClient.patch).mockResolvedValue(right(mockSuccessResponse))

      const data = { test: true }
      const headers = { 'Content-Type': 'application/json' } as HttpHeaders

      await httpClient.patch('/test', data, headers)

      expect(httpClient.patch).toHaveBeenCalledWith('/test', data, headers)
    })

    it('should implement DELETE method correctly', async () => {
      vi.mocked(httpClient.delete).mockResolvedValue(right(mockSuccessResponse))

      const headers = { Authorization: 'Bearer token' }

      await httpClient.delete('/test', headers)

      expect(httpClient.delete).toHaveBeenCalledWith('/test', headers)
    })
  })

  describe('Generic Type Support', () => {
    interface TestResponse {
      id: number
      name: string
    }

    it('should handle generic response types', async () => {
      const response: HttpResponse<TestResponse> = {
        statusCode: HttpStatusCode.OK,
        body: { id: 1, name: 'test' }
      }

      vi.mocked(httpClient.get).mockResolvedValue(right(response))

      const result = await httpClient.get<TestResponse>('/test')

      expect(result.isRight()).toBe(true)
      if (result.isRight()) {
        expect(result.value.body.id).toBeDefined()
        expect(result.value.body.name).toBeDefined()
      }
    })

    it('should handle request with generic types', async () => {
      const request: HttpRequest = {
        url: '/test',
        method: HttpMethod.POST,
        data: { id: 1, name: 'test' } as TestResponse
      }

      expect(request.method).toBe(HttpMethod.POST)
    })
  })
})
