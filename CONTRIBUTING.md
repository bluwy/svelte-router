# Contributing to Svelte Router

Thanks for your interest in making `svelte-router` better!

## Issues and Feature Requests

[Open an issue](https://github.com/bluwy/svelte-router/issues/new/choose) for any bug reports, unexpected behaviors, or feature requests. If possible, provide a reproduction repo to help us in resolving the issues.

## Documentation Updates

All are welcomed to improve the documentation. The docs are currently located in [`/docs`](./docs). Do note that the docs follow the [Vue Docs Writing Guide](https://v3.vuejs.org/guide/contributing/writing-guide.html).

## Code Contribution

When sending a pull request, make sure the changes are properly formatted and tested so it can be merged. See the [code formatting](#code-formatting) and [testing](#testing) sections below for more information.

Below is the general development workflow:

### Local Development

1. Clone the repo
2. Run `pnpm install` to install dependencies
3. Run `pnpm cy:setup` to manually test the router

This will start up 3 servers at:

- http://localhost:10001 - `hash` mode
- http://localhost:10002 - `path` mode
- http://localhost:10003 - `path` mode with base tag

### Code Formatting

The library uses [Prettier](https://prettier.io/) to format the code, including HTML, JS, TS and Svelte files.

Code will be auto-formatted per git commits using [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged).

> NOTE: Markdown files are temporarily not formatted until [prettier-plugin-svelte#129](https://github.com/sveltejs/prettier-plugin-svelte/issues/129) is fixed.

### Testing

The library performs unit testing (with [Jest](https://jestjs.io)) and e2e testing (with [Cypress](https://cypress.io)).

- Run `pnpm test:unit` for unit tests
- Run `pnpm test:e2e` for e2e tests

When pushing or sending a pull request to this repo, a GitHub Actions workflow will run both unit and e2e tests.

### Publishing

There's currently no automated publishing workflow. For now, it is done locally by [bluwy](https://github.com/bluwy).
