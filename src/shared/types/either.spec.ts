import { left, right } from './either'

describe('Either', () => {
  it('should create a Left instance', () => {
    const sut = left(new Error('error'))

    expect(sut.isLeft()).toBe(true)
    expect(sut.isRight()).toBe(false)
    expect(sut.value).toBeInstanceOf(Error)
  })

  it('should create a Right instance', () => {
    const sut = right({ value: 'success' })

    expect(sut.isRight()).toBe(true)
    expect(sut.isLeft()).toBe(false)
    expect(sut.value).toEqual({ value: 'success' })
  })
})
