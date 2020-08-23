import { RouteMatcher } from '../src/matcher'

describe('matcher', function () {
  it('should match a route', function () {
    const matcher = new RouteMatcher([{ path: '/foo' }, { path: '/bar' }])
    const route = matcher.matchRoute('/bar')
    expect(route?.matched[0].path).to.equal('/bar')
  })

  it('should match the same sequence of route records', function () {
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
    expect(route?.matched.length).to.equal(3)
    expect(route?.matched[0].path).to.equal('/foo')
    expect(route?.matched[1].path).to.equal('/bar')
    expect(route?.matched[2].path).to.equal('/baz')
  })

  it('should match nested routes', function () {
    const matcher = new RouteMatcher([
      {
        path: '/foo',
        children: [{ path: '/bar' }]
      }
    ])
    const route1 = matcher.matchRoute('/foo/bar')
    const route2 = matcher.matchRoute('/foo')
    expect(route1?.matched[1].path).to.equal('/bar')
    expect(route2?.matched.length).to.equal(1)
    expect(route2?.matched[0].path).to.equal('/foo')
  })

  it('should be tolerant to oddly named paths', function () {
    const matcher = new RouteMatcher([
      {
        path: 'foo',
        children: [{ path: 'bar/' }, { path: 'baz' }, { path: '*' }]
      }
    ])
    const route1 = matcher.matchRoute('/foo/bar')
    const route2 = matcher.matchRoute('/foo/baz')
    const route3 = matcher.matchRoute('/foo/bla/')
    expect(route1?.matched[1].path).to.equal('bar/')
    expect(route2?.matched[1].path).to.equal('baz')
    expect(route3?.params.wild).to.equal('/bla')
  })

  it('should parse named parameters', function () {
    const matcher = new RouteMatcher([{ path: '/foo/:id' }])
    const route = matcher.matchRoute('/foo/abc')
    expect(route?.params.id).to.equal('abc')
  })
})
