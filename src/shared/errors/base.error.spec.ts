import { describe, expect, it } from 'vitest'
import { NotFoundError, UnexpectedError, ValidationError } from './base.error'

describe('Errors', () => {
  it('should create ValidationError with correct message', () => {
    const error = new ValidationError('Invalid field')

    expect(error).toBeInstanceOf(ValidationError)
    expect(error.message).toBe('Invalid field')
    expect(error.name).toBe('ValidationError')
  })

  it('should create NotFoundError with correct message', () => {
    const error = new NotFoundError('User')

    expect(error).toBeInstanceOf(NotFoundError)
    expect(error.message).toBe('User not found')
    expect(error.name).toBe('NotFoundError')
  })

  it('should create UnexpectedError with correct message', () => {
    const error = new UnexpectedError()

    expect(error).toBeInstanceOf(UnexpectedError)
    expect(error.message).toBe('An unexpected error occurred')
    expect(error.name).toBe('UnexpectedError')
  })
})
