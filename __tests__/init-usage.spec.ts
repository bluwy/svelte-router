import { initHashRouter, initPathRouter } from '../src'

describe('init usage', () => {
  it('should throw if initRouter called more than once', () => {
    const call = () => {
      initHashRouter([])
      initPathRouter([])
    }
    expect(call).toThrow()
  })
})
