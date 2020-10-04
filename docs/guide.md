# Guide

Here contains all you need to know about `svelte-router`!

If you haven't setup `svelte-router`, check out the [quick start](../README.md#quick-start)!

## Table of Contents

- [Router Modes](#router-modes)
- [Dynamic Route Matching](#dynamic-route-matching)
  - [Catch-all Route](#catch-all-route)
  - [Matching Priority](#matching-priority)
- [Nested Routes](#nested-routes)
- [Route Navigation](#route-navigation)
  - [Navigate with Links](#navigate-with-links)
  - [Programmatic Navigation](#programmatic-navigation)
  - [Dynamic Syntax](#dynamic-syntax)
- [Route Information](#route-information)
- [Link Information](#link-information)
- [Redirects and Navigation Guards](#redirects-and-navigation-guards)
- [Lazy Loading Routes](#lazy-loading-routes)
- [Transitions](#transitions)
- [Base Path](#base-path)

## Router Modes

`svelte-router` supports both `hash` and `path` mode routing. `hash` mode works by manipulating the URL hash, while `path` mode works by manipulating the URL path:

<!-- prettier-ignore -->
| Mode | Initialize API     | Example URL                    |
|------|--------------------|--------------------------------|
| hash | `initHashRouter()` | https://example.com/#/user/foo |
| path | `initPathRouter()` | https://example.com/user/foo   |

Do note that `path` mode requires additional configuration on the server-side to serve a single HTML file for all URL paths. For example, the server should serve http://example.com/index.html when the user visits https://example.com/user/foo.

## Dynamic Route Matching

Sometimes a route path cannot be known ahead of time. For example, a user ID may be used in the route to show its corresponding information.

In `svelte-router`, we can use a dynamic segment to capture the variable:

```js
[
  // Dynamic segment starts with ":" and the following text is its variable name
  { path: '/user/:id', component: User }
]
```

Now when the user visits `/user/foo`, it will match and render the `User` component. The `id` variable can then be accessed through `$route.params`:

```svelte
<!-- User.svelte -->

<script>
  import { route } from '@bjornlu/svelte-router'

  $: console.log($route.params.id) // => "foo"
</script>
```

### Catch-all Route

When no routes can be matched, we can use a wildcard as a safety net to render a fallback component:

```js
[
  { path: '/user', component: User },
  // Render fallback if route isn't `/user`
  { path: '/*', component: Fallback }
]
```

When the catch-all route is matched, `$route.params.wild` will also return the path that matched the wildcard. For example when navigating to `/non-exist`, `$route.params.wild` returns `/non-exist`.

### Matching Priority

`svelte-router` matches the defined routes sequentially from the first to last. For example:

```js
[
  { path: '/:foo', component: Foo },
  { path: '/user', component: User }
]
```

When the URL is `/user`, it will match `/:foo` instead since it satisfies the pattern first. Hence, routes with higher specificity should be placed before routes with lower specificity, such as dynamic segments and wildcards.

## Nested Routes

Similar to the hierarchical nature of DOM elements, segments of the URL path may also represent the hierarchy of the routes and its components.

In `svelte-router`, nested routes can be configured with the `children` property:

```js
[
  {
    path: '/user/:id',
    component: User,
    children: [
      { path: '/profile', component: UserProfile },
      { path: '/posts', component: UserPosts }
    ]
  }
]
```

For the `User` component to render its children, a `<slot />` tag must be present:

```svelte
<!-- User.svelte -->

<h1>User</h1>
<div>
  <h2>Children</h2>
  <slot />
</div>
```

Now when the user visits `/user/foo/profile`, it will render `User` and `UserProfile`.

## Route Navigation

`svelte-router` supports both declarative and programmatic ways of navigating between routes, that is with the `<Link />` component and the `navigate()` function.

### Navigate with Links

The `<Link />` component has a `to` prop which accepts either a string path or location descriptor object. For example:

```svelte
<script>
  import { Link } from '@bjornlu/svelte-router'
</script>

<!-- Navigate to `/` -->
<Link to="/">...</Link>

<!-- Navigate to `/login?foo=bar` -->
<Link to="/login?foo=bar">...</Link>

<!-- Navigate to `/login?foo=bar` -->
<Link to={{ path: '/login', search: { foo: 'bar' } }}>...</Link>

<!-- Navigate to `/` with replace -->
<Link to="/" replace={true}>...</Link>
```

### Programmatic Navigation

Sometimes manual navigation is needed to respond to a user action, like a form submission. The `navigate()` function can be used to do so:

```js
import { navigate } from '@bjornlu/svelte-router'

// Navigate to `/`
navigate('/')

// Navigate to `/login?foo=bar`
navigate('/login?foo=bar')

// Navigate to `/login?foo=bar`
navigate({ path: '/login', search: { foo: 'bar' } })

// Navigate to `/` with replace
navigate('/', true)

// Navigate forward
navigate(1)

// Navigate backward
navigate(-1)
```

### Dynamic Syntax

`svelte-router` supports defining dynamic segments in the string path and location descriptor object. This makes it convenient to navigate in deeply nested routes instead of relying on relative navigation. For example:

```svelte
<!--
  Current URL: `/user/foo/profile`
  Current path: `/user/:id/profile`
  $route.params: { id: 'foo' }
-->

<script>
  import { navigate, Link } from '@bjornlu/svelte-router'

  function visitPosts() {
    // Navigates to `/user/foo/posts`
    navigate('/user/:id/posts')

    // Navigates to `/user/foo/posts`
    navigate({ path: '/user/:id/posts' })
  }
</script>

<!-- Navigates to `/user/foo/posts` -->
<Link to="/user/:id/posts">...</Link>

<!-- Navigates to `/user/foo/posts` -->
<Link to={{ path: '/user/:id/posts' }}>...</Link>
```

Do note that:

- In `hash` mode, the syntax will not work in the `search` portion of the location
- In `path` mode, the syntax will not work in both the `search` and `hash` portion of the location

## Route Information

Very often the code needs to receive information about the current route to perform certain tasks.

You can use the global `$route` to do so by subscribing to it anywhere in your app:

```svelte
<script>
  import { route } from '@bjornlu/svelte-router'

  $: console.log($route)
</script>
```

The `$route` contains properties such as `path`, `search`, `hash`, `params`, and `matched`. You can learn more about it in its [API reference](./api.md/#route).

## Link Information

To find out if a link is partially or exactly matching the current path, `svelte-router` provides a `createLink()` function to easily retrieve this information. For example:

```svelte
<!--
  Hash mode router
  Current URL: `/user/foo/profile`
  Current path: `/user/:id/profile`
  $route.params: { id: 'foo' }
-->

<script>
  import { createLink } from '@bjornlu/svelte-router'

  const link = createLink('/user/:id')

  // Active info
  $: console.log($link.isActive) // => true
  $: console.log($link.isExactActive) // => false

  // Also returns href used for anchor tags
  $: console.log($link.href) // => '#/foo/123/baz'
</script>
```

Internally, the `<Link />` component also uses this [under-the-hood](https://github.com/bluwy/svelte-router/blob/master/src/components/Link.svelte), which means you can also use `createLink()` to create your own custom links!

## Redirects and Navigation Guards

When navigating to certain invalid or protected routes, a redirect may be required.

In `svelte-router`, the route `redirect` property can be used to acheive that:

```js
[
  // If path is `/secret`, redirect to `/login`
  { path: '/secret', redirect: '/login' }
]
```

Besides that, `redirect` also accepts a function or asynchronous function that may return the redirect path. This can be used to decide which path to redirect to depending on the condition. For example:

```js
[
  {
    path: '/secret',
    redirect: async () => {
      // Call external function to check if user is authenticated
      if (await isAuthenticated()) {
        // User is authenticated, stay on route
        return undefined
      } else {
        // User is not authenticated, redirect to `/`
        return '/'
      }
    }
  }
]
```

## Lazy Loading Routes

In large applications, it may be necessary to split up components to reduce the initial download size. This is done through dynamic importing components so that bundlers like [Rollup](https://rollupjs.org/) and [Webpack](https://webpack.js.org/) can perform code-splitting on them and only load when needed.

Lazy loading works by using the [dynamic import syntax](https://github.com/tc39/proposal-dynamic-import):

```js
[
  { path: '/foo', component: import('./Foo.svelte') },
  { path: '/bar', component: () => import('./Bar.svelte') }
]
```

## Transitions

Route components can use [svelte/transition](https://svelte.dev/tutorial/transition) to animate between routes. Wrap the route component with an element and apply the transition:

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

> NOTE: Only apply the solutions above if the issue arises.

## Base Path

In `path` mode, if the app is served under a specific path of a domain, then a `<base />` tag needs to be declared in the `<head />`. For example, if the app is hosted at `/app`:

```html
<head>
  <base href="/app" />
  <!-- ... other tags -->
</head>
```
