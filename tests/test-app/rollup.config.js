import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import svelte from 'rollup-plugin-svelte'
import serve from 'rollup-plugin-serve'

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
      css: (css) => {
        css.write(p('public/build/bundle.css'))
      }
    }),
    resolve(),
    typescript({
      tsconfig: p('tsconfig.json')
    }),
    serve({
      contentBase: p('public'),
      historyApiFallback: true
    })
  ]
}
