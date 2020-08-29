import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import svelte from 'rollup-plugin-svelte'
import serve from 'rollup-plugin-serve'

const svelteConfig = require('../../svelte.config')

const p = (...args) => path.resolve(__dirname, ...args)

const createConfig = (routerMode, publicPath, port) => ({
  input: p('src/main.ts'),
  output: {
    sourcemap: true,
    file: p(publicPath, 'build/bundle.js'),
    format: 'iife',
    name: 'app'
  },
  plugins: [
    svelte({
      preprocess: svelteConfig.preprocess,
      css: (css) => {
        css.write(p(publicPath, 'build/bundle.css'))
      }
    }),
    resolve(),
    replace({
      __ROUTER_MODE__: JSON.stringify(routerMode),
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    typescript({
      tsconfig: p('tsconfig.json')
    }),
    serve({
      contentBase: p(publicPath),
      port,
      historyApiFallback: routerMode === 'path'
    })
  ]
})

export default [
  createConfig('hash', 'public-hash', 10001),
  createConfig('path', 'public-path', 10002),
  createConfig('path', 'public-path-base', 10003)
]
