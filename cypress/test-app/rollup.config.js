import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import svelte from 'rollup-plugin-svelte'

const svelteConfig = require('../../svelte.config')

const p = (...args) => path.resolve(__dirname, ...args)

const createConfig = (routerMode, publicPath) => ({
  input: p('src/main.ts'),
  output: {
    sourcemap: true,
    dir: p(publicPath, 'build'),
    format: 'es',
    name: 'app'
  },
  plugins: [
    svelte({
      dev: true,
      preprocess: svelteConfig.preprocess,
      css: (v) => v.write('bundle.css')
    }),
    resolve(),
    replace({
      preventAssignment: true,
      values: {
        __ROUTER_MODE__: JSON.stringify(routerMode),
        'process.env.NODE_ENV': JSON.stringify('development')
      }
    }),
    typescript({
      tsconfig: p('tsconfig.json')
    })
  ]
})

export default [
  createConfig('hash', 'public-hash'),
  createConfig('path', 'public-path'),
  createConfig('path', 'public-path-base')
]
