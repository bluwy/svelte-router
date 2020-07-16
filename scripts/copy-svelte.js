const fs = require('fs')
const path = require('path')

/*
  This only copies Route.svelte from src to dist. In the future, the better
  solution would be to recursively copy over. We can also take the opportunity
  to preprocess the files to take advantage of TypeScript goodness.
*/

const cwd = process.cwd()

// Copy Route component
fs.copyFileSync(
  path.resolve(cwd, 'src/Route.svelte'),
  path.resolve(cwd, 'dist/Route.svelte')
)
