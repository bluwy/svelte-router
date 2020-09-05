# Comparison

## Key difference

One main feature most routers don't have is a global route store. Most routers require the route data to be manually passed via props or use [context](https://svelte.dev/tutorial/context-api) which only works in components.

I have however found one library, [yrv](https://github.com/pateketrueke/yrv) to have a properly implemented global route store, but I could not get it to work with Vite.

## General difference

A non-exhaustive list of differences between popular routers:

<!-- prettier-ignore -->
|                                          | [@bjornlu/svelte-router](https://github.com/bluwy/svelte-router) | [svelte-routing](https://github.com/EmilTholin/svelte-routing)                                                                                                       | [svelte-spa-router](https://github.com/ItalyPaleAle/svelte-spa-router)                        | [svelte-router-spa](https://github.com/jorgegorka/svelte-router)                       |
|------------------------------------------|------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| Route definition style                   | JS object                                                        | Component                                                                                                                                                            | JS object. Nested routes are separated into different objects.                                | JS object                                                                              |
| Router mode                              | Hash and path                                                    | Path                                                                                                                                                                 | Hash                                                                                          | Path                                                                                   |
| Access route data (params, hash, search) | Global route store, access anywhere                              | Passed by prop and `let:param`. [A workaround](https://github.com/EmilTholin/svelte-routing/issues/41#issuecomment-503462045) can be used for descendant components. | Route params are passed by props. Location and search can be accessed anywhere.               | Passed by props only                                                                   |
| Redirects and navigation guards          | Built-in with async support                                      | Manual redirect in components                                                                                                                                        | Built-in but [no async support](https://github.com/ItalyPaleAle/svelte-spa-router/issues/125) | Built-in but [no async support](https://github.com/jorgegorka/svelte-router/issues/20) |
| SSR support                              | :x:                                                              | :heavy_check_mark:                                                                                                                                                   | :x:                                                                                           | :x:                                                                                    |

> Feel free to edit with additional points, error fixes or info updates.
