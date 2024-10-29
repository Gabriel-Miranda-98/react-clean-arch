import { HttpError } from '../errors/http.error'
import { Either } from '../types/either'
// src/shared/interfaces/http-client.ts
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export type HttpHeaders = {
  'Content-Type'?: 'application/json' | 'multipart/form-data' | 'text/plain'
  Authorization?: string
  [key: string]: string | undefined
}

export type HttpQueryParams = {
  [key: string]: string | number | boolean | undefined
}

// Tipos específicos para cada método
export type HttpGetRequest = {
  url: string
  method: HttpMethod.GET
  params?: HttpQueryParams
  headers?: HttpHeaders
}

export type HttpPostRequest = {
  url: string
  method: HttpMethod.POST
  data: unknown
  headers?: HttpHeaders
  params?: HttpQueryParams
}

export type HttpPutRequest = {
  url: string
  method: HttpMethod.PUT
  data: unknown
  headers?: HttpHeaders
  params?: HttpQueryParams
}

export type HttpPatchRequest = {
  url: string
  method: HttpMethod.PATCH
  data: unknown
  headers?: HttpHeaders
  params?: HttpQueryParams
}

export type HttpDeleteRequest = {
  url: string
  method: HttpMethod.DELETE
  headers?: HttpHeaders
  params?: HttpQueryParams
}

export type HttpRequest =
  | HttpGetRequest
  | HttpPostRequest
  | HttpPutRequest
  | HttpPatchRequest
  | HttpDeleteRequest

export type HttpResponse<T = unknown> = {
  statusCode: HttpStatusCode
  body: T
  headers?: HttpHeaders
}

export interface HttpClient {
  request<T = unknown>(
    data: HttpRequest
  ): Promise<Either<HttpError, HttpResponse<T>>>
  get<T = unknown>(
    url: string,
    params?: HttpQueryParams,
    headers?: HttpHeaders
  ): Promise<Either<HttpError, HttpResponse<T>>>
  post<T = unknown>(
    url: string,
    data?: unknown,
    headers?: HttpHeaders
  ): Promise<Either<HttpError, HttpResponse<T>>>
  put<T = unknown>(
    url: string,
    data?: unknown,
    headers?: HttpHeaders
  ): Promise<Either<HttpError, HttpResponse<T>>>
  patch<T = unknown>(
    url: string,
    data?: unknown,
    headers?: HttpHeaders
  ): Promise<Either<HttpError, HttpResponse<T>>>
  delete<T = unknown>(
    url: string,
    headers?: HttpHeaders
  ): Promise<Either<HttpError, HttpResponse<T>>>
}
