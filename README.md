# Svelte Router

<!-- prettier-ignore -->
[![package version](https://img.shields.io/npm/v/@bjornlu/svelte-router)](https://www.npmjs.com/package/@bjornlu/svelte-router)
[![npm downloads](https://img.shields.io/npm/dm/@bjornlu/svelte-router)](https://www.npmjs.com/package/@bjornlu/svelte-router)
[![ci](https://github.com/bluwy/svelte-router/workflows/CI/badge.svg?event=push)](https://github.com/bluwy/svelte-router/actions)
[![e2e](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/vjxpm8/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/vjxpm8/runs)

An easy-to-use SPA router for Svelte.

> npm install @bjornlu/svelte-router

[**Comparison with other routers**](./Comparison.md)

## Features

- Super simple API
- Support `hash` and `path` based navigation
- Auto `base` tag navigation
- Easy [redirection and navigation guards](./Recipes.md#redirects-and-navigation-guard) (with async support)
- Define all routes in one object
- Nested routes

## Not supported

- Server-side rendering (SSR) - Use [Sapper](https://github.com/sveltejs/sapper) or [Routify](https://github.com/roxiness/routify) instead
- Relative navigations - Use absolute path and [param shorthand syntax](./Recipes.md#param-shorthand-paths) instead

## Table of contents

- [Usage](#usage)
- [API](#api)
  - [`<Link />`](#link)
  - [`navigate`](#navigate)
  - [`route`](#route)
- [Recipes](./Recipes.md)

## Usage

```js
// router.js

import { initRouter } from '@bjornlu/svelte-router'
import Home from './Home.svelte'
import Profile from './Profile.svelte'
import ProfileWelcome from './ProfileWelcome.svelte'
import ProfileBio from './ProfileBio.svelte'
import Null from './Null.svelte'

// Initialize the router
initRouter({
  // The routing mode: "hash" or "path"
  mode: 'history',
  // Define routes from the most specific to the least specific
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      // Use ":variable" to use named parameters
      path: '/profile/:id',
      // Component with childrens must have a <slot />
      component: Profile,
      children: [
        {
          path: '/welcome',
          component: ProfileWelcome
        },
        {
          path: '/bio',
          component: ProfileBio
        }
      ]
    },
    {
      path: '/secret',
      // Redirect to a new path if this route is matched.
      // Also accepts a function that returns a string, and may be asynchronous.
      // Learn more in the Recipes section.
      redirect: '/'
    },
    {
      path: '/*',
      component: Null
    }
  ]
})
```

```svelte
<!-- App.svelte -->

<script>
  import { RouterView } from '@bjornlu/svelte-router'
</script>

<main>
  <RouterView />
</main>
```

```js
// main.js

import App from './App.svelte'
import './router'

const app = new App({
  target: document.getElementById('app')
})

export default app
```

## API

### `<Link />`

<!-- prettier-ignore -->
| Prop    | Type                    | Default | Description                              |
|---------|-------------------------|---------|------------------------------------------|
| to      | string \| LocationInput |         | Target route                             |
| replace | boolean                 | `false` | Replace current route instead of pushing |

- Renders an anchor tag
- Adds `aria-current="page"` when link exactly matches
- Display correct `href` by resolving base path, param shorthand paths and hash prepends, e.g. `/foo/:id` => `/foo/123`
- Adds active class names based on `to` and current route path:
  - `link-active` when link partially matches, e.g. `/foo` matches `/foo/bar`
  - `link-exact-active` when link exactly matches, e.g. `/foo` matches `/foo`

### `navigate`

`navigate` has two function signatures:

1.  `navigate(to: number)`

Navigate using an offset in the current history. Works the same way as [`history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History/go).

2.  `navigate(to: string | LocationInput, replace?: boolean)`

Navigate to a route using a string or an object. `string` and `LocationInput` are semantically equal and are just different ways to express the same route. For example:

```js
'/foo?key=value#top'

// same as

{
  path: '/foo',
  search: { key: 'value' },
  hash: '#top'
}
```

Both `string`'s path and `LocationInput`'s path can take advantage of the [param shorthand syntax](./Recipes.md#param-shorthand-paths) to easily define absolute route navigation.

Example usage:

```js
navigate('/foo/bar')
navigate('/foo/bar?key=value')
navigate('?key=value')
navigate('#hey', true)
navigate('#/foo/bar')
navigate({ path: '/foo/bar', search: { key: 'value' } })
navigate({ path: '/foo/:id', hash: '#hey' })
navigate({ search: '?key=value' })
```

> In hash mode, `path` will take precedence over `hash`. e.g. `/foo#/bar` will navigate to `/foo`.

### `route`

Svelte Router exports a readable store `route` that contains the current route information.

<!-- prettier-ignore -->
| Property | Type            | Example         | Description                                                                                                                                                    |
|----------|-----------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| path     | string          | `'/foo'`        |                                                                                                                                                                |
| params   | Record          | `{ id: '123' }` | The parsed path parameters, e.g. /foo/:id                                                                                                                      |
| search   | URLSearchParams |                 | The path search parsed with URLSearchParams                                                                                                                    |
| hash     | string          | `'#hey'`        | The path hash with leading `#`. Empty string if no hash.                                                                                                       |
| matched  | RouteRecord[]   |                 | The array of route records for all nested path segments of the current route. The matched records reference the records defined in the `routes` configuration. |

### Advanced usage

Check out the [recipes](./Recipes.md) section for more advanced use-cases and solutions.

## Contributing

All contributions are welcomed. For any major changes, please open an issue first :)

## License

MIT
