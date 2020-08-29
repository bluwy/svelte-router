import { get } from 'svelte/store'
import { route, navigate, createLink } from '../src'

describe('API access before router initialization', function () {
  it('should have a default route store value', function () {
    const $route = get(route)
    expect(typeof $route === 'object').toBe(true)
  })

  it('should throw error if navigate', function () {
    expect(() => navigate(0)).toThrow()
  })

  it('should throw error if createLink', function () {
    expect(() => createLink({})).toThrow()
  })
})
