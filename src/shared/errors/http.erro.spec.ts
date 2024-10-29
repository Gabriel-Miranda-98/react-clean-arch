import { HttpStatusCode } from '../interfaces/HttpClient'
import { BaseError } from './base.error'
import { HttpError } from './http.error'

describe('HttpError', () => {
  it('should create http error with all properties', () => {
    const error = new HttpError('Not Found', HttpStatusCode.NOT_FOUND, {
      message: 'Resource not found'
    })

    expect(error.message).toBe('Not Found')
    expect(error.statusCode).toBe(HttpStatusCode.NOT_FOUND)
    expect(error.body).toEqual({ message: 'Resource not found' })
    expect(error.name).toBe('HttpError')
  })

  it('should create http error without body', () => {
    const error = new HttpError(
      'Internal Server Error',
      HttpStatusCode.INTERNAL_SERVER_ERROR
    )

    expect(error.message).toBe('Internal Server Error')
    expect(error.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR)
    expect(error.body).toBeUndefined()
  })

  it('should extend from BaseError', () => {
    const error = new HttpError('Test Error', HttpStatusCode.BAD_REQUEST)
    expect(error).toBeInstanceOf(BaseError)
  })
})
