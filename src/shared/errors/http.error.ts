import { HttpStatusCode } from '../interfaces/HttpClient'
import { BaseError } from './base.error'

export class HttpError extends BaseError {
  constructor(
    message: string,
    public readonly statusCode: HttpStatusCode,
    public readonly body?: unknown
  ) {
    super(message)
  }
}
