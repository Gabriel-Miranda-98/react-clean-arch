// src/shared/errors/base-error.ts
export abstract class BaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message)
  }
}

export class NotFoundError extends BaseError {
  constructor(entity: string) {
    super(`${entity} not found`)
  }
}

export class UnexpectedError extends BaseError {
  constructor() {
    super('An unexpected error occurred')
  }
}
