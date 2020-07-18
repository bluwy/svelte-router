const fs = require('fs').promises
const path = require('path')
const svelte = require('svelte/compiler')
const svelteConfig = require('../svelte.config')

/*
  This script reads RouterView.svelte, preprocesses it and write to destination.
  A more general solution would be to recursively do that for all detected
  Svelte files under src, but the concept is here.
*/

main()

async function main() {
  const cwd = process.cwd()

  // Copy RouterView component
  await preprocessSvelte(
    path.resolve(cwd, 'src/RouterView.svelte'),
    path.resolve(cwd, 'dist/RouterView.svelte')
  )
}

async function preprocessSvelte(src, dest) {
  const srcCode = await fs.readFile(src, { encoding: 'utf-8' })

  let { code } = await svelte.preprocess(srcCode, svelteConfig.preprocess, {
    filename: src
  })

  // What a hack. Luckily we're not using sourcemaps.
  code = code.replace('script lang="ts"', 'script')

  await fs.writeFile(dest, code, { encoding: 'utf-8' })
}
