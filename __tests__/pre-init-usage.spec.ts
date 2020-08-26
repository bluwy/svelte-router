import { get } from 'svelte/store'
import { route } from '../src/router'
import { navigate } from '../src/navigate'

describe('API access before router initialization', function () {
  it('should have a default route store value', function () {
    const $route = get(route)
    expect(typeof $route === 'object').toBe(true)
  })

  // TODO: Maybe actually throw but in dev mode?
  it('should not throw error if navigate', function () {
    expect(() => navigate(0)).not.toThrow()
  })
})
