// src/domain/entities/Product.ts
import { ValidationError } from '@/shared/errors/application.error'

export class Product {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _description: string,
    private _price: number,
    private _category: string,
    private _stock: number,
    private _createdAt: Date,
    private _updatedAt: Date
  ) {
    this.validate()
  }

  // Getters
  get id(): string {
    return this._id
  }
  get name(): string {
    return this._name
  }
  get description(): string {
    return this._description
  }
  get price(): number {
    return this._price
  }
  get category(): string {
    return this._category
  }
  get stock(): number {
    return this._stock
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }

  // Métodos de negócio
  updateName(name: string): void {
    this._name = this.validateName(name)
    this._updatedAt = new Date()
  }

  updateDescription(description: string): void {
    this._description = this.validateDescription(description)
    this._updatedAt = new Date()
  }

  updatePrice(price: number): void {
    this._price = this.validatePrice(price)
    this._updatedAt = new Date()
  }

  updateCategory(category: string): void {
    this._category = this.validateCategory(category)
    this._updatedAt = new Date()
  }

  addStock(quantity: number): void {
    if (quantity <= 0) {
      throw new ValidationError('Quantity must be positive')
    }
    this._stock += quantity
    this._updatedAt = new Date()
  }

  removeStock(quantity: number): void {
    if (quantity <= 0) {
      throw new ValidationError('Quantity must be positive')
    }
    if (quantity > this._stock) {
      throw new ValidationError('Insufficient stock')
    }
    this._stock -= quantity
    this._updatedAt = new Date()
  }

  // Validações
  private validate(): void {
    this.validateName(this._name)
    this.validateDescription(this._description)
    this.validatePrice(this._price)
    this.validateCategory(this._category)
    this.validateStock(this._stock)
  }

  private validateName(name: string): string {
    if (!name || name.trim().length < 3) {
      throw new ValidationError('Name must be at least 3 characters long')
    }
    if (name.trim().length > 100) {
      throw new ValidationError('Name must be at most 100 characters long')
    }
    return name.trim()
  }

  private validateDescription(description: string): string {
    if (!description || description.trim().length < 1) {
      throw new ValidationError(
        'Description must be at least 1 characters long'
      )
    }
    if (description.trim().length > 500) {
      throw new ValidationError(
        'Description must be at most 500 characters long'
      )
    }
    return description.trim()
  }

  private validatePrice(price: number): number {
    if (price <= 0) {
      throw new ValidationError('Price must be greater than zero')
    }
    return price
  }

  private validateCategory(category: string): string {
    if (!category || category.trim().length < 2) {
      throw new ValidationError('Category must be at least 2 characters long')
    }
    return category.trim()
  }

  private validateStock(stock: number): number {
    if (stock < 0) {
      throw new ValidationError('Stock cannot be negative')
    }
    return stock
  }

  // Factory Methods
  static create(props: CreateProductProps): Product {
    const now = new Date()
    return new Product(
      crypto.randomUUID(),
      props.name,
      props.description,
      props.price,
      props.category,
      props.stock,
      now,
      now
    )
  }

  static reconstruct(props: ReconstructProductProps): Product {
    return new Product(
      props.id,
      props.name,
      props.description,
      props.price,
      props.category,
      props.stock,
      props.createdAt,
      props.updatedAt
    )
  }

  // Método para serialização
  toJSON() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      price: this._price,
      category: this._category,
      stock: this._stock,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    }
  }
}

// Types
export type CreateProductProps = {
  name: string
  description: string
  price: number
  category: string
  stock: number
}

export type ReconstructProductProps = {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  createdAt: Date
  updatedAt: Date
}
