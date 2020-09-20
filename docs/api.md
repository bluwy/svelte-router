# API Reference

## Table of Contents

- [`<RouterView />`](#routerview-)
- [`<Link />`](#link-)
- [`initHashRouter(routes: RouteRecord[])`](#inithashrouterroutes-routerecord)
- [`initPathRouter(routes: RouteRecord[])`](#initpathrouterroutes-routerecord)
- [`navigate()`](#navigate)
  - [`navigate(to: number)`](#navigateto-number)
  - [`navigate(to: string | LocationInput, replace?: boolean)`](#navigateto-string--locationinput-replace-boolean)
- [`$route`](#route)
- [`createLink(to: string | LocationInput)`](#createlinkto-string--locationinput)

## `<RouterView />`

Renders the routes. No additional props.

## `<Link />`

<!-- prettier-ignore -->
| Prop    | Type                    | Default | Description                              |
|---------|-------------------------|---------|------------------------------------------|
| to      | string \| LocationInput |         | Target route                             |
| replace | boolean                 | `false` | Replace current route instead of pushing |

- Renders an anchor tag
- Adds `aria-current="page"` when link exactly matches
- Display correct `href` with resolved dynamic segments, base path and hash prepends, e.g. `/user/:id` => `#/user/foo`
- Adds active class names based on `to` and current route path:
  - `link-active` when link partially matches, e.g. `/foo` matches `/foo/bar`
  - `link-exact-active` when link exactly matches, e.g. `/foo` matches `/foo`

## `initHashRouter(routes: RouteRecord[])`

Initializes a `hash` mode router for the app.

## `initPathRouter(routes: RouteRecord[])`

Initializes a `path` mode router for the app.

## `navigate()`

`navigate()` has two function signatures:

### `navigate(to: number)`

Navigate using an offset in the current history. Works the same way as [`history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History/go).

### `navigate(to: string | LocationInput, replace?: boolean)`

Navigate to a route using a path string or a location descriptor object. `string` and `LocationInput` are semantically equal and are just different ways to express the same route. For example:

```js
'/foo?key=value#top'

// same as

{
  path: '/foo',
  search: { key: 'value' },
  hash: '#top'
}
```

## `$route`

A readable store that contains the current route information.

<!-- prettier-ignore -->
| Property | Type                   | Example         | Description                                               |
|----------|------------------------|-----------------|-----------------------------------------------------------|
| path     | string                 | `'/user/foo'`   | The route path without search and hash                    |
| params   | Record<string, string> | `{ id: 'foo' }` | The parsed dynamic segments of the path, e.g. `/user/:id` |
| search   | URLSearchParams        |                 | The path search parsed with URLSearchParams               |
| hash     | string                 | `'#hey'`        | The path hash with leading `#`. Empty string if no hash.  |
| matched  | RouteRecord[]          |                 | The array of route records that matches the current route |

## `createLink(to: string | LocationInput)`

Returns a readable store that contains the given link's information.

<!-- prettier-ignore -->
| Property      | Type    | Example        | Description                                                          |
|---------------|---------|----------------|----------------------------------------------------------------------|
| href          | string  | `'#/user/foo'` | The path with resolved dynamic segments, base path and hash prepends |
| isActive      | boolean | `false`        | Whether the link is partially matching the current path              |
| isExactActive | boolean | `false`        | Whether the link is exactly matching the current path                |
