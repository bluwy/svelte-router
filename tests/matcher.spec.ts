import { RouterError } from '../src/error'
import { matchRoute, routesToMatchers } from '../src/matcher'

describe('matcher', function () {
  context('matching', function () {
    it('should match a route', function () {
      const matchers = routesToMatchers([{ path: '/foo' }, { path: '/bar' }])
      const route = matchRoute('/bar', matchers)
      expect(route.matched[0].path).to.equal('/bar')
    })

    it('should match the same sequence of route records', function () {
      const matchers = routesToMatchers([
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
      const route = matchRoute('/foo/bar/baz', matchers)
      expect(route.matched.length).to.equal(3)
      expect(route.matched[0].path).to.equal('/foo')
      expect(route.matched[1].path).to.equal('/bar')
      expect(route.matched[2].path).to.equal('/baz')
    })

    it('should match nested routes', function () {
      const matchers = routesToMatchers([
        {
          path: '/foo',
          children: [{ path: '/bar' }]
        }
      ])
      const route1 = matchRoute('/foo/bar', matchers)
      const route2 = matchRoute('/foo', matchers)
      expect(route1.matched[1].path).to.equal('/bar')
      expect(route2.matched.length).to.equal(1)
      expect(route2.matched[0].path).to.equal('/foo')
    })

    it('should be tolerant to oddly named paths', function () {
      const matchers = routesToMatchers([
        {
          path: 'foo',
          children: [{ path: 'bar/' }, { path: 'baz' }, { path: '' }]
        }
      ])
      const route1 = matchRoute('/foo/bar', matchers)
      const route2 = matchRoute('/foo/baz', matchers)
      const route3 = matchRoute('/foo/bla/', matchers)
      expect(route1.matched[1].path).to.equal('bar/')
      expect(route2.matched[1].path).to.equal('baz')
      expect(route3.params.wild).to.equal('/bla')
    })
  })

  context('catch-all', function () {
    it('should create a default catch-all route if not defined', function () {
      const matchers = routesToMatchers([{ path: '/foo' }, { path: '/bar' }])
      const route = matchRoute('/hello', matchers)
      expect(route).to.be.ok
      expect(route.matched.length).to.equal(0)
    })

    it('should create a default nested catch-all route if not defined', function () {
      const matchers = routesToMatchers([
        {
          path: '/foo',
          children: [{ path: '/bar' }]
        }
      ])
      const route = matchRoute('/foo/invalid', matchers)
      expect(route).to.be.ok
      expect(route.matched.length).to.equal(1)
      expect(route.matched[0].path).to.equal('/foo')
    })
  })

  context('parsing', function () {
    it('should parse named parameters', function () {
      const matchers = routesToMatchers([{ path: '/foo/:id' }])
      const route = matchRoute('/foo/abc', matchers)
      expect(route.params.id).to.equal('abc')
    })

    it('should parse path query', function () {
      const matchers = routesToMatchers([{ path: '/foo' }])
      const route = matchRoute('/foo?id=abc', matchers)
      expect(route.query.id).to.equal('abc')
    })

    it('should parse path hash', function () {
      const matchers = routesToMatchers([{ path: '/foo' }])
      const route = matchRoute('/foo#abc', matchers)
      expect(route.hash).to.equal('#abc')
    })

    it('should parse all named parameters, query and hash', function () {
      const matchers = routesToMatchers([{ path: '/foo/:id' }])
      const route = matchRoute('/foo/abc?def=ghi#jkl', matchers)
      expect(route.params.id).to.equal('abc')
      expect(route.query.def).to.equal('ghi')
      expect(route.hash).to.equal('#jkl')
    })

    it('should preserve full path when matching route', function () {
      const matchers = routesToMatchers([{ path: '/foo' }])
      const route = matchRoute('/foo#abc', matchers)
      expect(route.fullPath).to.equal('/foo#abc')
    })
  })

  context('redirects', function () {
    it('should handle redirects', function () {
      const matchers = routesToMatchers([
        { path: '/foo' },
        { path: '/bar', redirect: '/foo' }
      ])
      const route = matchRoute('/bar', matchers)
      expect(route.path).to.equal('/foo')
    })

    it('should handle catch-all redirects', function () {
      const matchers = routesToMatchers([
        { path: '/foo' },
        { path: '/*', redirect: '/foo' }
      ])
      const route = matchRoute('/bar', matchers)
      expect(route.path).to.equal('/foo')
    })

    it('should handle nested redirects', function () {
      const matchers = routesToMatchers([
        { path: '/foo' },
        {
          path: '/bar',
          children: [
            {
              path: '/baz',
              redirect: '/foo'
            }
          ]
        }
      ])
      const route = matchRoute('/bar/baz', matchers)
      expect(route.path).to.equal('/foo')
    })

    it('should prioritize child redirects over parent redirects', function () {
      const matchers = routesToMatchers([
        { path: '/foo' },
        { path: '/hello' },
        {
          path: '/bar',
          redirect: '/hello',
          children: [
            {
              path: '/baz',
              redirect: '/foo'
            }
          ]
        }
      ])
      const route = matchRoute('/bar/baz', matchers)
      expect(route.path).to.equal('/foo')
    })

    it('should handle dynamic redirects', function () {
      const matchers = routesToMatchers([
        { path: '/foo' },
        {
          path: '/bar/:id',
          redirect: (to) => `/${to.params.id}`
        }
      ])
      const route = matchRoute('/bar/foo', matchers)
      expect(route.path).to.equal('/foo')
    })

    it('should throw RouterError if infinite redirect detected', function () {
      const matchers = routesToMatchers([
        { path: '/foo', redirect: '/bar' },
        { path: '/bar', redirect: '/foo' }
      ])
      expect(() => matchRoute('/foo', matchers)).to.throw(RouterError)
    })
  })
})
