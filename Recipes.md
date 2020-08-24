# Recipes

## Table of contents

- [Param shorthand paths](#param-shorthand-paths)
- [Redirects and navigation guard](#redirects-and-navigation-guard)
- [Dynamic import](#dynamic-import)
- [Route transitions](#route-transitions)

## Param shorthand paths

Navigation paths can use the named param syntax to automatically replace the param with the current route's param.

For example, if the current route is `/foo/123/bar` and the route param is `{ id: '123' }`, `navigate('/foo/:id/baz')` will route to `/foo/123/baz`.

## Redirects and navigation guard

Svelte Router combines these two concepts into a single `redirect` property when configuring routes. `redirect` accepts the same type as `navigate`'s `to` param. On top of that, it also accepts a function or async function that returns the value.

<details>
  <summary>View Typescript type</summary>

```ts
type Thunk<T> = T | (() => T)

type Promisable<T> = T | Promise<T>

type RedirectOption = Thunk<Promisable<string | LocationInput | undefined>>
```

</details>

Navigation guards work by using a function that conditionally returns a `string` or `LocationInput` to redirect, **or** `undefined` to stay on route. For example:

```js
initRouter({
  routes: [
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
  ]
})
```

## Dynamic import

Dynamically importing components can work with [`svelte-spa-chunk`](https://github.com/hmmhmmhm/svelte-spa-chunk). Built-in support is currently unavailable. Library usage:

```js
import { initRouter } from '@bjornlu/svelte-router'
import { ChunkGenerator } from 'svelte-spa-chunk'
import ChunkComponent from 'svelte-spa-chunk/Chunk.svelte'
const Chunk = ChunkGenerator(ChunkComponent)

initRouter({
  routes: [
    {
      path: '/home',
      component: Chunk(() => import('./Home.svelte'))
    }
  ]
})
```

## Route transitions

Route components can use [svelte/transition](https://svelte.dev/docs#svelte_transition) to animate between routes. Wrap the route component with a container and apply the transition:

```svelte
<script>
  import { fade } from 'svelte/transition'
</script>

<div in:fade>
  Content
</div>
```
