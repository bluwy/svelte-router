# Svelte Router

A straight-forward and easy-to-use SPA router.

> npm install @bjornlu/svelte-router

## Features

- Super simple API
- Support hash and [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) navigation
- Auto `base` tag navigation
- Easy redirection and navigation guards (with async support)
- Define all routes in one object
- Nested routes
- Written in TypeScript

## Not supported

- Server-side rendering (SSR) - Use [Sapper](https://github.com/sveltejs/sapper) or [Routify](https://github.com/roxiness/routify) instead
- Relative navigations - Use absolute path and [param shorthand syntax](./Recipes.md#param-shorthand-paths) instead

## Table of contents

- [Usage](#usage)
  - [Setup](#setup)
  - [Navigation](#navigation)
  - [Route info](#route-info)
- [Recipes](./Recipes.md)

## Usage

### Setup

Before mounting your app, initialize the router:

```js
import { initRouter } from '@bjornlu/svelte-router'
import Home from './Home.svelte'
import Profile from './Profile.svelte'
import ProfileWelcome from './ProfileWelcome.svelte'
import ProfileBio from './ProfileBio.svelte'
import Null from './Null.svelte'

// Initializes the router. Subsequent calls to this function are ignored.
initRouter({
  // The routing mode: "hash" or "history". Default: "hash".
  mode: 'history',
  routes: [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/profile/:id',
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
      redirect: '/home'
    },
    {
      path: '/*',
      component: Null
    }
  ]
})
```

> Make sure routes are defined in the order of the most specific to the least.

Then, in your app add `<RouterView />`:

```svelte
<!-- App.svelte -->

<script>
  import { RouterView } from '@bjornlu/svelte-router'
</script>

<main>
  <RouterView />
</main>
```

Done!

> Wait. How does `<RouterView />` render nested components? The answer is that it renders them in the component's default `<slot />`. So make sure a slot tag is defined for all routes' component with children.

### Navigation

Svelte Router provides 3 ways for navigation. Each with its own use cases:

#### `<Link />` component

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| to | string \| LocationInput |  | Target route |
| replace | boolean | `false` | Replace current route instead of pushing |

- Renders an anchor tag
- Adds `aria-current="page"` when link exactly matches
- Display correct `href` by resolving base path, param shorthand paths and hash prepend, e.g. `/foo/:id` => `/foo/123`
- Adds active class names based on `to` and current route path:
  - `link-active` when link partially matches, e.g. `/foo` matches `/foo/bar`
  - `link-exact-active` when link exactly matches, e.g. `/foo` matches `/foo`

#### `use:link` action

- Used on anchor tag to use its `href` as target route
- Can also be used on any element, which its descendant anchor tags will all be applied
- `href` value must start with `/`, `?` or `#` so that it routes
- Add `replace` attribute on anchor tag to replace the route instead of pushing
- Add `noroute` attribute on anchor tag to ignore routing

While similar to the `<Link />` component, it does not do a few things:

- No `aria-current="page"` accessibility
- No `href` resolve, e.g. `/foo/:id` will be shown as is
- No active class names

It's recommended to use the `<Link />` component wherever possible so that the `href` resolves to a valid one. So for example when the user control-clicks the link (open in new tab), it opens a valid route.

#### `navigate` function

`navigate` has two function signatures:

##### `navigate(to: number)`

Navigate using an offset in the current history. Works the same way as [`history.go`](https://developer.mozilla.org/en-US/docs/Web/API/History/go).

##### `navigate(to: string | LocationInput, replace?: boolean)`

Navigate to a route using a string or an object. `string` and `LocationInput` are semantically equal and are just different ways to express the same route. For example, `/foo?key=value#top` is the same as:

```js
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

### Route info

Svelte Router exports a readable store `route` that contains the current route's information.

| Property | Type | Example | Description |
| --- | --- | --- | --- |
| path | string | `/foo` |  |
| params | Record<string, string> | `{ id: '123' }` | The parsed path parameters, e.g. /foo/:id |
| search | URLSearchParams |  | The path search parsed with URLSearchParams |
| hash | string | `#hey` | The path hash with leading `#`. Empty string if no hash. |
| matched | RouteRecord[] |  | The array of route records for all nested path segments of the current route. The matched records reference the records defined in the `routes` configuration. |

### Advanced usage

> Check out the [Recipes](./Recipes.md) section for more advanced use-cases and solutions.

## Contributing

All contributions are welcomed. For any major changes, please open an issue first :)

## License

MIT
