import { HttpError } from '@/shared/errors/http.error'
import {
  HttpClient,
  HttpHeaders,
  HttpMethod,
  HttpQueryParams,
  HttpRequest,
  HttpResponse,
  HttpStatusCode
} from '@/shared/interfaces/HttpClient'
import { Either, left, right } from '@/shared/types/either'
import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Tipos para tratamento de erro
type ErrorResponse = {
  status: number
  data: unknown
}

type AxiosErrorType = {
  message: string
  response?: ErrorResponse
  isAxiosError: boolean
}

export class AxiosHttpClient implements HttpClient {
  private readonly instance: AxiosInstance

  constructor(baseURL?: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async request<T = unknown>(
    data: HttpRequest
  ): Promise<Either<HttpError, HttpResponse<T>>> {
    try {
      const response = await this.instance.request({
        url: data.url,
        method: data.method,
        headers: this.mergeHeaders(data.headers),
        params: data.params,
        data: this.getRequestData(data)
      })

      return right(this.adaptResponse(response))
    } catch (error) {
      return left(this.handleError(error))
    }
  }

  async get<T = unknown>(
    url: string,
    params?: HttpQueryParams,
    headers?: HttpHeaders
  ): Promise<Either<HttpError, HttpResponse<T>>> {
    return this.request<T>({
      url,
      method: HttpMethod.GET,
      params,
      headers
    })
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    headers?: HttpHeaders
  ): Promise<Either<HttpError, HttpResponse<T>>> {
    return this.request<T>({
      url,
      method: HttpMethod.POST,
      data,
      headers
    } as HttpRequest)
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    headers?: HttpHeaders
  ): Promise<Either<HttpError, HttpResponse<T>>> {
    return this.request<T>({
      url,
      method: HttpMethod.PUT,
      data,
      headers
    } as HttpRequest)
  }

  async patch<T = unknown>(
    url: string,
    data?: unknown,
    headers?: HttpHeaders
  ): Promise<Either<HttpError, HttpResponse<T>>> {
    return this.request<T>({
      url,
      method: HttpMethod.PATCH,
      data,
      headers
    } as HttpRequest)
  }

  async delete<T = unknown>(
    url: string,
    headers?: HttpHeaders
  ): Promise<Either<HttpError, HttpResponse<T>>> {
    return this.request<T>({
      url,
      method: HttpMethod.DELETE,
      headers
    })
  }

  private getRequestData(request: HttpRequest): unknown | undefined {
    return isRequestWithData(request) ? request.data : undefined
  }

  private mergeHeaders(headers?: HttpHeaders): HttpHeaders {
    return {
      'Content-Type': 'application/json',
      ...headers
    }
  }

  private adaptResponse<T>(response: AxiosResponse): HttpResponse<T> {
    return {
      statusCode: response.status as HttpStatusCode,
      body: response.data as T,
      headers: response.headers as HttpHeaders
    }
  }

  private handleError(error: unknown): HttpError {
    if (isAxiosError(error)) {
      if (hasErrorResponse(error)) {
        return new HttpError(
          error.message,
          error.response.status,
          error.response.data
        )
      }
      return new HttpError(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }

    if (error instanceof Error) {
      return new HttpError(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR)
    }

    return new HttpError(
      'An unexpected error occurred',
      HttpStatusCode.INTERNAL_SERVER_ERROR
    )
  }
}

// Type Guards
function isAxiosError(error: unknown): error is AxiosErrorType {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosErrorType).isAxiosError === true
  )
}

function hasErrorResponse(
  error: AxiosErrorType
): error is AxiosErrorType & { response: ErrorResponse } {
  return (
    error.response !== undefined &&
    typeof error.response === 'object' &&
    'status' in error.response &&
    'data' in error.response
  )
}

function isRequestWithData(
  request: HttpRequest
): request is Extract<HttpRequest, { data: unknown }> {
  return 'data' in request
}
