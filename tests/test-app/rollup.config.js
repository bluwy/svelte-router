import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import svelte from 'rollup-plugin-svelte'
import serve from 'rollup-plugin-serve'

const svelteConfig = require('../../svelte.config')

const p = (...args) => path.resolve(__dirname, ...args)

export default {
  input: p('src/main.ts'),
  output: {
    sourcemap: true,
    file: p('public/build/bundle.js'),
    format: 'iife',
    name: 'app'
  },
  plugins: [
    svelte({
      preprocess: svelteConfig.preprocess,
      css: (css) => {
        css.write(p('public/build/bundle.css'))
      }
    }),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    typescript({
      tsconfig: p('tsconfig.json')
    }),
    serve({
      contentBase: p('public'),
      historyApiFallback: true
    })
  ]
}
