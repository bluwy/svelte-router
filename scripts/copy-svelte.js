const fs = require('fs').promises
const path = require('path')
const svelte = require('svelte/compiler')
const svelteConfig = require('../svelte.config')

main()

async function main() {
  const cwd = process.cwd()

  await fs.mkdir(path.resolve(cwd, 'dist/components'), { recursive: true })

  // Copy RouterView component
  await preprocessSvelte(
    path.resolve(cwd, 'src/components/RouterView.svelte'),
    path.resolve(cwd, 'dist/components/RouterView.svelte')
  )

  // Copy Link component
  await preprocessSvelte(
    path.resolve(cwd, 'src/components/Link.svelte'),
    path.resolve(cwd, 'dist/components/Link.svelte')
  )
}

async function preprocessSvelte(src, dest) {
  const srcCode = await fs.readFile(src, { encoding: 'utf-8' })

  let { code } = await svelte.preprocess(srcCode, svelteConfig.preprocess, {
    filename: src
  })

  // Remove lang to prevent preprocess on user side
  code = code.replace('lang="ts"', '')

  await fs.writeFile(dest, code, { encoding: 'utf-8' })
}
