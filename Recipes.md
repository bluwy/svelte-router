# Recipes

## Table of contents

- [Param shorthand paths](#param-shorthand-paths)
- [Redirects and navigation guard](#redirects-and-navigation-guard)
- [`base` tag](#base-tag)
- [Custom links](#custom-links)
- [Dynamic import](#dynamic-import)
- [Route transitions](#route-transitions)
- [Access API before router initialization](#access-api-before-router-initialization)

## Param shorthand paths

Navigation paths can use the named param syntax to automatically replace the param with the current route's param.

For example, if the current route is `/foo/123/bar` and the route param is `{ id: '123' }`, `navigate('/foo/:id/baz')` will route to `/foo/123/baz`.

This syntax can also be used in `LocationInput`'s path and with `createLink` and `<Link />`.

## Redirects and navigation guard

Svelte Router combines these two concepts into a single `redirect` property. When configuring routes, `redirect` accepts the same type as `navigate`'s `to` param. Furthermore, it also accepts a function or async function that returns the value.

<details>
  <summary>View Typescript type</summary>

```ts
type Thunk<T> = T | (() => T)

type Promisable<T> = T | Promise<T>

interface RouteRecord {
  // ...
  redirect?: Thunk<Promisable<string | LocationInput | undefined>>
  // ...
}
```

</details>

Navigation guards work by using a function that conditionally returns a `string` or `LocationInput` to redirect, **or** `undefined` to stay on route. For example:

```js
import { initPathRouter } from '@bjornlu/svelte-router'

initPathRouter([
  {
    path: '/secret',
    redirect: () => {
      if (localStorage.getItem('password') === 'hunter2') {
        return undefined // Continue route
      } else {
        return '/' // Redirect to "/"
      }
    }
  }
])
```

## `base` tag

In `path` mode, if the app is served under a specific path of a domain, then a `base` tag needs to be declared in the `head`. For example, if the app is at `/app`, the `head` should have:

```html
<base href="/app" />
```

## Custom links

Svelte Router exposes the `createLink` function which allows creating custom links for any scenario. In fact, the built-in `<Link />` component also [uses it under-the-hood](./src/Link.svelte). Example usage:

```js
import { get } from 'svelte/store'
import { createLink } from '@bjornlu/svelte-router'

// Example scenario:
// - `hash` mode
// - Current route is '/foo/123/bar'
// - Route param is { id: '123' }

// Creates a readable store with link properties
const link = createLink('/foo/:id')

// Get current store value.
// In Svelte components, $link can be used directly without `get`.
const $link = get(link)

console.log($link.href) // => '#/foo/123/baz'
console.log($link.isActive) // => true
console.log($link.isExactActive) // => false
```

## Dynamic import

Dynamically importing components can work with [`svelte-spa-chunk`](https://github.com/hmmhmmhm/svelte-spa-chunk) and can be further customized with [`svelte-loadable](https://github.com/kaisermann/svelte-loadable). Example usage:

```js
import { initPathRouter } from '@bjornlu/svelte-router'
import { ChunkGenerator } from 'svelte-spa-chunk'
import ChunkComponent from 'svelte-spa-chunk/Chunk.svelte'
const Chunk = ChunkGenerator(ChunkComponent)

initPathRouter([
  {
    path: '/',
    component: Chunk(() => import('./Home.svelte'))
  }
])
```

## Route transitions

Route components can use [svelte/transition](https://svelte.dev/tutorial/transition) to animate between routes. Wrap the route component with a container and apply the transition:

<!-- prettier-ignore -->
```svelte
<script>
  import { fade } from 'svelte/transition'
</script>

<div in:fade>
  Content
</div>
```

When navigating to another route, if the current route component's descendants transition too, it may cause the UI to be in a half-transitioned state. There are 2 solutions:

1. Use [local transitions](https://svelte.dev/tutorial/local-transitions): Make sure the descendants' transitions are local, e.g. `<div transition:fade|local></div>`

2. [Tick](https://svelte.dev/tutorial/tick) before navigate: This will wait for the descendants' transitions to end before navigating, e.g. `tick().then(() => navigate('/foo'))`

## Access API before router initialization

`navigate` and `createLink` will both throw error if called before `initHashRouter` or `initPathRouter`.

However, `route` has a default value which can be accessed before router initialization:

```js
{
  path: '',
  params: {},
  matched: [],
  search: new URLSearchParams(),
  hash: ''
}
```
