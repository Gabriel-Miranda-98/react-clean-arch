import { describe, expect, it } from 'vitest'
import {
  ApplicationError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
  ValidationError
} from './application.error'

describe('ApplicationError', () => {
  it('should set the correct name and message', () => {
    class TestError extends ApplicationError {}
    const error = new TestError('Test message')
    expect(error.name).toBe('TestError')
    expect(error.message).toBe('Test message')
  })
})

describe('ValidationError', () => {
  it('should set the correct name and message', () => {
    const error = new ValidationError('Validation failed')
    expect(error.name).toBe('ValidationError')
    expect(error.message).toBe('Validation failed')
  })
})

describe('NotFoundError', () => {
  it('should set the correct name and message', () => {
    const error = new NotFoundError('Entity')
    expect(error.name).toBe('NotFoundError')
    expect(error.message).toBe('Entity not found')
  })
})

describe('UnauthorizedError', () => {
  it('should set the correct name and message', () => {
    const error = new UnauthorizedError()
    expect(error.name).toBe('UnauthorizedError')
    expect(error.message).toBe('Unauthorized access')
  })
})

describe('ForbiddenError', () => {
  it('should set the correct name and message', () => {
    const error = new ForbiddenError()
    expect(error.name).toBe('ForbiddenError')
    expect(error.message).toBe('Access forbidden')
  })
})

describe('BadRequestError', () => {
  it('should set the correct name and message', () => {
    const error = new BadRequestError('Bad request')
    expect(error.name).toBe('BadRequestError')
    expect(error.message).toBe('Bad request')
  })
})

describe('ConflictError', () => {
  it('should set the correct name and message', () => {
    const error = new ConflictError('Conflict occurred')
    expect(error.name).toBe('ConflictError')
    expect(error.message).toBe('Conflict occurred')
  })
})

describe('InternalError', () => {
  it('should set the correct name and message when error is provided', () => {
    const innerError = new Error('Inner error message')
    const error = new InternalError(innerError)
    expect(error.name).toBe('InternalError')
    expect(error.message).toBe('Inner error message')
  })

  it('should set the correct name and default message when no error is provided', () => {
    const error = new InternalError()
    expect(error.name).toBe('InternalError')
    expect(error.message).toBe('Internal server error')
  })
})
