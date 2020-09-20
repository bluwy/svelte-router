# Lazy Loading

An example with lazy loading components. There are many ways to support dynamic imports, this examples uses `<script type="module"/>`.

## Try it out

Copy example project with [degit](https://github.com/Rich-Harris/degit):

```bash
$ npx degit bluwy/svelte-router/examples/basic svelte-app
```

Install dependencies:

```bash
$ cd svelte-app
$ npm install
```

Run development server:

```bash
$ npm run dev
```

Then, navigate to http://localhost:5000. You should see your app running. Edit a component file in `src`, save it, and the page will auto reload.

To run in production:

```bash
$ npm run build
$ npm run start
```
