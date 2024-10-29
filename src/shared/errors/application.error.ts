// src/shared/errors/application-error.ts
export abstract class ApplicationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message)
  }
}

export class NotFoundError extends ApplicationError {
  constructor(entity: string) {
    super(`${entity} not found`)
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor() {
    super('Unauthorized access')
  }
}

export class ForbiddenError extends ApplicationError {
  constructor() {
    super('Access forbidden')
  }
}

export class BadRequestError extends ApplicationError {
  constructor(message: string) {
    super(message)
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string) {
    super(message)
  }
}

export class InternalError extends ApplicationError {
  constructor(error?: Error) {
    super(error?.message || 'Internal server error')
  }
}
