import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import svelte from 'rollup-plugin-svelte'
import serve from 'rollup-plugin-serve'

const svelteConfig = require('../../svelte.config')

const p = (...args) => path.resolve(__dirname, ...args)

function createConfig(mode) {
  const publicPath = mode === 'history' ? 'public-history' : 'public-hash'

  return {
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
        __ROUTER_MODE__: JSON.stringify(mode),
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      typescript({
        tsconfig: p('tsconfig.json')
      }),
      serve({
        contentBase: p(publicPath),
        port: mode === 'history' ? 10001 : 10002,
        historyApiFallback: mode === 'history'
      })
    ]
  }
}

export default [createConfig('history'), createConfig('hash')]
