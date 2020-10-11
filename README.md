# Svelte Router

<!-- prettier-ignore -->
[![package version](https://img.shields.io/npm/v/@bjornlu/svelte-router)](https://www.npmjs.com/package/@bjornlu/svelte-router)
[![npm downloads](https://img.shields.io/npm/dm/@bjornlu/svelte-router)](https://www.npmjs.com/package/@bjornlu/svelte-router)
[![ci](https://github.com/bluwy/svelte-router/workflows/CI/badge.svg?event=push)](https://github.com/bluwy/svelte-router/actions)

An easy-to-use SPA router for Svelte.

[**Comparison with other routers**](./docs/comparison.md)

## Features

- Super simple API
- Support `hash` and `path` based navigation
- Nested routes
- Redirects and navigation guards (with async support)
- Lazy loading routes
- Auto `base` tag navigation

## Not Supported

- Server-side rendering (SSR) - Use [Sapper](https://github.com/sveltejs/sapper) instead
- Relative navigations - Use absolute path and [dynamic syntax](./docs/guide.md#dynamic-syntax) instead

## Quick Start

Install [`@bjornlu/svelte-router`](https://www.npmjs.com/package/@bjornlu/svelte-router):

```bash
$ npm install @bjornlu/svelte-router
```

Define routes:

```js
// main.js

import { initPathRouter } from '@bjornlu/svelte-router'
import App from './App.svelte'
import Home from './Home.svelte'

// Use `initHashRouter` for hash mode
initPathRouter([
  { path: '/', component: Home }
])

const app = new App({
  target: document.body
})

export default app
```

Render routes and links:

```svelte
<!-- App.svelte -->

<script>
  import { RouterView, Link } from '@bjornlu/svelte-router'
</script>

<main>
  <nav>
    <Link to="/">Home</Link>
  </nav>
  <RouterView />
</main>
```

Done!

## Documentation

Ready to learn more? The documentation is split into two parts:

- [Guide](./docs/guide.md): Covers common usage to advanced topics
- [API reference](./docs/api.md): Covers the structure of the API

## Examples

- [Basic](./examples/basic): Basic router usage
- [Lazy loading](./examples/lazy-loading): Lazy loading setup example

## Contributing

All contributions are welcomed. Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

## License

MIT
