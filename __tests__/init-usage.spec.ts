import { initRouter } from '../src'

describe('init usage', () => {
  it('should throw if initRouter called more than once', () => {
    const call = () => {
      initRouter({ mode: 'hash', routes: [] })
      initRouter({ mode: 'hash', routes: [] })
    }
    expect(call).toThrow()
  })
})
