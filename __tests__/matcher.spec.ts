import { RouteMatcher } from '../src/matcher'

describe('matcher', () => {
  it('should match a route', () => {
    const matcher = new RouteMatcher([{ path: '/foo' }, { path: '/bar' }])
    const route = matcher.matchRoute('/bar')
    expect(route?.matched[0].path).toBe('/bar')
  })

  it('should match the same sequence of route records', () => {
    const matcher = new RouteMatcher([
      {
        path: '/foo',
        children: [
          {
            path: '/bar',
            children: [{ path: '/baz' }]
          }
        ]
      }
    ])
    const route = matcher.matchRoute('/foo/bar/baz')
    expect(route?.matched.length).toBe(3)
    expect(route?.matched[0].path).toBe('/foo')
    expect(route?.matched[1].path).toBe('/bar')
    expect(route?.matched[2].path).toBe('/baz')
  })

  it('should match nested routes', () => {
    const matcher = new RouteMatcher([
      {
        path: '/foo',
        children: [{ path: '/bar' }]
      }
    ])
    const route1 = matcher.matchRoute('/foo/bar')
    const route2 = matcher.matchRoute('/foo')
    expect(route1?.matched[1].path).toBe('/bar')
    expect(route2?.matched.length).toBe(1)
    expect(route2?.matched[0].path).toBe('/foo')
  })

  it('should be tolerant to oddly named paths', () => {
    const matcher = new RouteMatcher([
      {
        path: 'foo',
        children: [{ path: 'bar/' }, { path: 'baz' }, { path: '*' }]
      }
    ])
    const route1 = matcher.matchRoute('/foo/bar')
    const route2 = matcher.matchRoute('/foo/baz')
    const route3 = matcher.matchRoute('/foo/bla/')
    expect(route1?.matched[1].path).toBe('bar/')
    expect(route2?.matched[1].path).toBe('baz')
    expect(route3?.params.wild).toBe('/bla')
  })

  it('should parse named parameters', () => {
    const matcher = new RouteMatcher([{ path: '/foo/:id' }])
    const route = matcher.matchRoute('/foo/abc')
    expect(route?.params.id).toBe('abc')
  })
})
